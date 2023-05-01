<template>
        <div v-if="filteredHits" class="intro-y box player-box">
            <div class="player-details">
                <div class="player-header">
                    <div class="player-avatar">
                        {{ getInitials(getName()) }}
                    </div>
                    <div class="player-name">
                        {{ getName() }}
                    </div>
                </div>
                <div class="player-season-details">
                    <div class="section-title">Player Season Details</div>
                    <div class="player-info">
                        <div class="info-row">
                            <p class="info-label">Rank:</p> {{ getPlayerRank() }}
                        </div>
                        <div class="info-row">
                            <p class="info-label">Age That Year:</p>{{ getPlayerAgeThatYear() }}
                        </div>
                        <div class="info-row">
                            <p class="info-label">Player Hits:</p>
                            {{ getPlayerHits() }}
                        </div>
                        <div class="info-row">
                            <p class="info-label">Player Bats:</p>
                            {{ getBats() }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="hits-per-season">
                <h3>Hits por Temporada</h3>
                <ul>
                    <li v-for="hit in filteredHits" :key="hit.id">
                        {{ hit.season }}: {{ hit.hits }}
                    </li>
                </ul>
            </div>
        </div>

        <div v-else>
            <p>Loading player details...</p>
        </div>
</template>

<script>
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default {
    setup() {
        const route = useRoute();
        const store = useStore();
        const playerId = Number(route.params.id);
        
        const hitsSingleSeason = computed(() => store.getters['baseball/getHitsSingleSeason']);
        const fetchHitsSingleSeason = () => store.dispatch('baseball/fetchHitsSingleSeason');
    
        const filteredHits = computed(() => {
            if (!hitsSingleSeason.value || hitsSingleSeason.value.length === 0) return [];

            return hitsSingleSeason.value.filter((hit) => {
                return hit.id === playerId;
            });
        });

        const getName = () => {
            return filteredHits.value.length ? filteredHits.value[0].player : '';
        };

        const getPlayerRank = () => {
            return filteredHits.value.length ? filteredHits.value[0].rank : '';
        };

        const getPlayerAgeThatYear = () => {
            return filteredHits.value.length ? filteredHits.value[0].agethatyear : '';
        };

        const getPlayerHits = () => {
            return filteredHits.value.length ? filteredHits.value[0].hits : '';
        };

        const getBats = () => {
            return filteredHits.value
                .map((hit) => hit.bats)
                .join(', ');
        };

        const getInitials = (name) => {
            return name.split(' ')
                .map((word) => word.charAt(0))
                .join('')
                .toUpperCase();
        };

        if (hitsSingleSeason.value.length === 0) {
            fetchHitsSingleSeason();
        }

        return {
            filteredHits,
            getName,
            getPlayerRank,
            getPlayerAgeThatYear,
            getPlayerHits,
            getBats,
            getInitials,
        };
    },
};

</script>

<style scoped>
.player-box {
    @apply px-5 pt-5 mt-5;
}

.player-details {
    @apply flex flex-col lg:flex-row border-b pb-5 -mx-5;
}

.player-header {
    @apply flex flex-1 px-5 items-center justify-center lg:justify-start;
}

.player-avatar {
    @apply w-16 h-16 rounded-full flex items-center justify-center bg-blue-500 text-white text-xl font-bold;
}

.player-name {
    @apply w-24 sm:w-40 truncate sm:whitespace-normal font-medium text-lg ml-5;
}

.player-season-details {
    @apply mt-6 lg:mt-0 flex-1 px-5 border-l border-r border-slate-200/60 border-t lg:border-t-0 pt-5 lg:pt-0;
}

.section-title {
    @apply font-medium text-center lg:text-left lg:mt-3;
}

.player-info {
    @apply flex flex-col justify-center items-center lg:items-start mt-4;
}

.info-row {
    @apply truncate sm:whitespace-normal flex items-center mt-3;
}

.info-label {
    @apply font-medium pr-3;
}

.hits-per-season {
    @apply mt-5;
}
</style>