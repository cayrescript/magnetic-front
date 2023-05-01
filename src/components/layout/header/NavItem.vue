<template>
    <router-link :to="href" :class="[active && 'bg-gray-900', 'text-white rounded-md px-3 py-2 text-sm font-medium']">
        <slot></slot>
    </router-link>
</template>
  
<script>
export default {
    props: {
        href: {
            type: String,
            required: true,
        },
        active: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
