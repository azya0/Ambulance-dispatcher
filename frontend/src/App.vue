<script setup lang="ts">
import Vue, { ref, computed } from 'vue'
import NotFound from './components/NotFound.vue'
import Main from './components/Main.vue'

const routes: { [key: string]: Vue.Component } = {
  '/': Main,
  '/about': Main
}

const currentPath = ref(window.location.pathname);

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.pathname;
});

const currentView: Vue.Component = computed(() => {
  return routes[currentPath.value] || NotFound;
});
</script>

<template>
  <component :is="currentView"/>
</template>
