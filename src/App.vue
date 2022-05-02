
<template>
  <canvas ref="canvas" />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import Scene from '@/scene'

const canvas = ref<HTMLElement>(null)

onMounted (() => {
  const scene = new Scene(canvas.value)
})
</script>

<style>
@import '@/assets/base.css';
canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
