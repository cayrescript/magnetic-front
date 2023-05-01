<template>
    <div id="app">
        <BaseballChart :hitsSingleSeason="hitsSingleSeason" />
    </div>
</template>

<script>
import { computed } from 'vue';

import { useStore } from 'vuex';
import BaseballChart from '../components/Charts.vue';


export default {
    components: {
        BaseballChart,
    },
    setup() {
        const store = useStore();
        const hitsSingleSeason = computed(() => store.getters['baseball/getHitsSingleSeason']);
        const fetchHitsSingleSeason = () => store.dispatch('baseball/fetchHitsSingleSeason');

        if (hitsSingleSeason.value.length === 0) {
            fetchHitsSingleSeason();
        }

        return {
            hitsSingleSeason,
        }
    }
};
</script>