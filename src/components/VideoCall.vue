<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <h1 class="text-xl font-bold mb-4">Chamada de Vídeo</h1>

    <!-- video local -->
    <video ref="localVideo" autoplay playsinline class="rounded shadow w-full max-w-md mb-4 border" /><div class="flex gap-4 items-center mb-4">
      <button @click="toggleMute" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {{ isMuted ? 'Desmutar' : 'Mutar' }}
      </button>

      <label class="flex items-center gap-2">
        Volume:
        <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="updateVolume" />
      </label>
    </div>

    <!-- video remoto -->
    <video ref="remoteVideo" autoplay playsinline class="rounded shadow w-full max-w-md mb-4 border" />

    <button @click="startCall" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      Iniciar chamada
    </button>
    <br>

    <button @click="leaveCall" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mt-2">
      Sair da sala
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { io } from 'socket.io-client';
import { useRoute } from 'vue-router';

const router = useRoute();
const roomId = router.params.id as string;
const socket = io('http://localhost:4000');
let localStream: MediaStream;

const localVideo = ref<HTMLVideoElement | null>(null);
const remoteVideo = ref<HTMLVideoElement | null>(null);
let peerConnection: RTCPeerConnection;

const config = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

//controles de volume do video
const isMuted = ref(false);
const volume = ref(1);

function toggleMute() {
  if (localVideo.value) {
    isMuted.value = !isMuted.value;
    localVideo.value.muted = isMuted.value;
  }
}

function updateVolume() {
  if (localVideo.value) {
    localVideo.value.volume = volume.value;
  }
}
//fim do controle de cvolume 

// onMounted(() => {
//    console.log('roomId:', roomId);
//   console.log('Entrando na sala:', roomId);
//   socket.emit('join', roomId);
// });

socket.on('connect', () => {
  console.log('Socket conectado:', socket.id);
  socket.emit('join', roomId);
});


//Inicia a chamada Call
async function startCall() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  if (localVideo.value) localVideo.value.srcObject = stream;

  peerConnection = new RTCPeerConnection(config);
  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

  peerConnection.ontrack = event => {
    if (remoteVideo.value) remoteVideo.value.srcObject = event.streams[0];
  };

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit('candidate', { roomId, candidate: event.candidate });
    }
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit('offer', { roomId, offer });
}

//Finaliza a chamada Call
function leaveCall() {
  if (peerConnection) peerConnection.close();
  if (localStream) localStream.getTracks().forEach(track => track.stop());
  socket.emit('leave', roomId); // ✅ antes do push
  router.push('/');
}



socket.on('offer', async offer => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  if (localVideo.value) localVideo.value.srcObject = stream;

  peerConnection = new RTCPeerConnection(config);
  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

  peerConnection.ontrack = event => {
    if (remoteVideo.value) remoteVideo.value.srcObject = event.streams[0];
  };

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit('candidate', { roomId, candidate: event.candidate });
    }
  };

  await peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  socket.emit('answer', { roomId, answer });
});

socket.on('answer', async answer => {
  await peerConnection.setRemoteDescription(answer);
});

socket.on('candidate', async candidate => {
  await peerConnection.addIceCandidate(candidate);
});
</script>
