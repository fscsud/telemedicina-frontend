<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
     <h1 class="text-2xl font-bold">Bem-vindo à Telemedicina</h1>
    <p class="mt-2">Escolha uma sala de chamada para iniciar sua consulta.</p>

    <h1 class="text-2xl font-bold mb-4">Entrar na Consulta</h1>
    <input
      v-model="roomId"
      type="text"
      placeholder="Digite o ID da consulta"
      class="border rounded px-4 py-2 w-full max-w-md mb-4"
    />
    <button
      @click="enterRoom"
      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Entrar na chamada
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const roomId = ref('');
const router = useRouter();

function enterRoom() {
  if (roomId.value.trim() !== '') {
    router.push(`/chamada/${roomId.value.trim()}`);
  }
}
</script>