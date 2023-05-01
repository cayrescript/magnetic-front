<template>
    <button
      type="button"
      @click="$emit('update:isOpen', !isOpen)"
      class="mobile-menu-button md:hidden"
      aria-controls="mobile-menu"
      :aria-expanded="isOpen ? 'true' : 'false'"
    >
      <span class="sr-only">Open main menu</span>
  
      <svg
        v-show="!isOpen"
        class="menu-icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
  
      <svg
        v-show="isOpen"
        class="menu-icon hidden"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </template>
  
  <script>
  export default {
    props: {
      isOpen: {
        type: Boolean,
        default: false,
      },
    },
  };
  </script>
  
  <style scoped>
  .mobile-menu-button {
    @apply inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 md:hidden;
    @apply hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800;
  }
  
  .menu-icon {
    @apply block h-6 w-6;
  }
  </style>
  