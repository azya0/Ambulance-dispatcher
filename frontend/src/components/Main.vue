<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0);

const func = () => {
  count.value++;
}

</script>


<template>
  <h2>
    Hello, Tanya!
  </h2>
  <b>Count is {{ count }}</b><br>
  <button @click="func">Flex</button>
</template>
