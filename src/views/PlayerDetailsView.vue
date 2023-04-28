<template>
    <div v-if="player" class="intro-y box px-5 pt-5 mt-5">
        <div class="flex flex-col lg:flex-row border-b border-slate-200/60 dark:border-darkmode-400 pb-5 -mx-5">
            <div class="flex flex-1 px-5 items-center justify-center lg:justify-start">
                <div
                    class="player-avatar w-16 h-16 rounded-full flex items-center justify-center bg-blue-500 text-white text-xl font-bold">
                    {{ getInitials(player.player) }}
                </div>
                <div class="ml-5">
                    <div class="w-24 sm:w-40 truncate sm:whitespace-normal font-medium text-lg">{{ player.player }}</div>
                </div>
            </div>
            <div
                class="mt-6 lg:mt-0 flex-1 px-5 border-l border-r border-slate-200/60 dark:border-darkmode-400 border-t lg:border-t-0 pt-5 lg:pt-0">
                <div class="font-medium text-center lg:text-left lg:mt-3">Player Season Details</div>
                <div class="flex flex-col justify-center items-center lg:items-start mt-4">
                    <div class="truncate sm:whitespace-normal flex items-center">
                        <p class="font-medium pr-3">Rank:</p> {{ player.rank }}
                    </div>
                    <div class="truncate sm:whitespace-normal flex items-center mt-3">
                        <p class="font-medium pr-3">Age That Year:</p>{{ player.agethatyear }}
                    </div>
                    <div class="truncate sm:whitespace-normal flex items-center mt-3">
                        <p class="font-medium pr-3">Player Hits:</p>
                        {{ player.hits }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else>
        <p>Loading player details...</p>
    </div>
    <!-- 
    <div>
        <h1>{{ player.player }}</h1>
        <p>Id: {{ player.id }}</p>
        <p>Rank: {{ player.rank }}</p>
        <p>Age That Year: {{ player.agethatyear }}</p>
        <p>Hits: {{ player.hits }}</p>
    </div> -->
</template>
  
<script>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default {
    setup() {
        const route = useRoute();
        const store = useStore();
        const playerId = Number(route.params.id); // Convertendo playerId para número
        const player = ref(null);

        const hitsSingleSeason = store.getters['baseball/getHitsSingleSeason'];

        const fetchPlayer = async () => {
            if (hitsSingleSeason.length === 0) {
                await store.dispatch('baseball/fetchHitsSingleSeason');
            }
            player.value = store.getters['baseball/getHitsSingleSeason'].find((p) => p.id === playerId);
        };

        watch(
            () => hitsSingleSeason,
            (newHitsSingleSeason) => {
                if (newHitsSingleSeason.length > 0) {
                    player.value = newHitsSingleSeason.find((p) => p.id === playerId);
                }
            },
            { immediate: true }
        );

        onMounted(async () => {
            await fetchPlayer();
        });

        const getInitials = (name) => {
            return name.split(' ').map((word) => word.charAt(0)).join('').toUpperCase();
        };

        return {
            player,
            getInitials,
        };
    },
};
</script>
  