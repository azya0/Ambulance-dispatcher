<script setup lang="ts">
import { ref } from 'vue'

const currentPath = ref(window.location.pathname);

</script>

<template>
  <div id="not-found">
    <h1>404</h1>
    <h2>Miss page "{{ currentPath.slice(1) }}"</h2>
  </div>
</template>
