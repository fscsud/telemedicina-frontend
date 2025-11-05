<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-2xl font-bold mb-4">Chamada de Vídeo</h1>
    <video ref="localVideo" autoplay playsinline class="w-full max-w-md rounded shadow"></video>
    <button
      @click="startCall"
      class="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Iniciar chamada
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const localVideo = ref<HTMLVideoElement | null>(null);

async function startCall() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localVideo.value) {
      localVideo.value.srcObject = stream;
    }
  } catch (err) {
    console.error('Erro ao acessar câmera/microfone:', err);
  }
}
</script>
