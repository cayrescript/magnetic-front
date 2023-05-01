<template>
    <HitsSingleSeasonContext.Provider :value="hitsSingleSeason">
        <slot></slot>
    </HitsSingleSeasonContext.Provider>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export const HitsSingleSeasonContext = Symbol('HitsSingleSeasonContext');

export default {
    setup(props, { slots }) {
        const store = useStore();
        const hitsSingleSeason = ref([]);
        
        const fetchHitsSingleSeason = async () => {
            if (hitsSingleSeason.value.length === 0) {
                await store.dispatch('baseball/fetchHitsSingleSeason');
            }
        };

        onMounted(async () => {
            await fetchHitsSingleSeason();
            hitsSingleSeason.value = store.getters['baseball/getHitsSingleSeason'];
        });

        return () => {
            return h(
                HitsSingleSeasonContext.Provider,
                {
                    value: hitsSingleSeason.value
                },
                slots.default && slots.default()
            );
        };
    }

};
</script>
  