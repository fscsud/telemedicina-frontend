import { ref } from 'vue';

export function useCall() {
  const localStream = ref<MediaStream | null>(null);

  async function startCall() {
    localStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  }

  return { localStream, startCall };
}
