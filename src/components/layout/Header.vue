<template>
  <nav class="bg-gray-800">
    <div class="header-container">
      <div class="header-content">
        <p class="text-white">Baseball Hits</p>
  
        <div class="hidden header-nav md:flex">
          <nav-item v-bind:href="'/'" v-bind:active="isActive('/')">Home</nav-item>
          <nav-item v-bind:href="'/dashboard'" v-bind:active="isActive('/dashboard')">Dashboard</nav-item>
        </div>
        <div class="header-mobile-menu md:hidden">
          <MobileMenuButton :isOpen="isMobileMenuOpen" @update:isOpen="isMobileMenuOpen = $event"></MobileMenuButton>
        </div>
      </div>
    </div>
    <div class="md:hidden" id="mobile-menu" v-show="isMobileMenuOpen">
      <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
        <nav-item v-bind:href="'/'" v-bind:active="isActive('/')">Home</nav-item>
        <nav-item v-bind:href="'/dashboard'" v-bind:active="isActive('/dashboard')">Dashboard</nav-item>
      </div>
    </div>

  </nav>
  <header class="bg-white shadow">
    <h1 class="text-3xl font-bold tracking-tight text-gray-900 mx-8 my-4 py-4">
      {{ route.name }}
    </h1>
  </header>
</template>
  
<script>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import NavItem from './header/NavItem.vue';
import MobileMenuButton from './header/mobileMenuButton.vue';

export default {
  components: {
    NavItem,
    MobileMenuButton,
  },
  setup() {
    const route = useRoute();
    const isMobileMenuOpen = ref(false);
    const isActive = (path) => route.path === path;
    return { route, isMobileMenuOpen, isActive };
  },
};
</script>
  
<style scoped>
.header-container {
  @apply mx-auto max-w-7xl px-4;
}

.header-content {
  @apply justify-between flex h-16 items-center md:justify-start;
}

.header-logo {
  @apply flex-shrink-0;
}

.header-nav {
  @apply hidden ml-10 flex items-baseline space-x-4 md:block ;
}

.header-mobile-menu {
  @apply -mr-2 flex;
}

.header-nav-desktop {
  justify-content: flex-start;
}
</style>
