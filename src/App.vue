

<template>
  <div class="min-h-full">
    <Header />
    <main>
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 px-3">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped></style>

<script setup>
import { RouterView } from 'vue-router'
import Header from './components/layout/Header.vue'

</script>