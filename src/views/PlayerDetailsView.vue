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
            <div class="mt-6 lg:mt-0 flex-1 flex items-center justify-center px-5 border-t lg:border-0 border-slate-200/60 dark:border-darkmode-400 pt-5 lg:pt-0">
                <div class="text-center rounded-md py-3 mx-4">
                    <div class="font-medium text-primary text-xl">{{ getTotalHits() }}</div>
                    <div class="text-slate-500">Total de hits</div>
                </div>
                <div class="text-center rounded-md py-3 mx-4">
                    <div class="font-medium text-primary text-xl">{{ getSeasonsCount() }}</div>
                    <div class="text-slate-500">Temporadas</div>
                </div>
                <div class="text-center rounded-md py-3 mx-4">
                    <div class="font-medium text-primary text-xl">{{ getHighestRank() }}</div>
                    <div class="text-slate-500">Maior Ranking</div>
                </div>
            </div>
        </div>
       
        <TableView v-if="filteredHits.length > 0" :headers="headers" :items="sortedHits" @sort="updateSortConfig" />

    </div>

    <div v-else>
        <p>Loading player details...</p>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { getPlayerNameConcat } from '../utils';
import TableView from '../components/Table/TableView.vue';

export default {
    components: {
        TableView,
    },
    setup() {

        const route = useRoute();
        const store = useStore();
        const playerNameQuery = route.params.player;
        const hitsSingleSeason = computed(() => store.getters['baseball/getHitsSingleSeason']);
        const fetchHitsSingleSeason = () => store.dispatch('baseball/fetchHitsSingleSeason');


        const filteredHits = computed(() => {
            if (!hitsSingleSeason.value || hitsSingleSeason.value.length === 0) return [];

            let onlyHitsOfPlayer = hitsSingleSeason.value.filter((hit) => {
                return getPlayerNameConcat(hit.player) === playerNameQuery;
            });
            return onlyHitsOfPlayer;
        });

        const getName = () => {
            return filteredHits.value.length ? filteredHits.value[0].player : '';
        };

        const getTotalHits = () => {
            return filteredHits.value.reduce((total, hit) => total + hit.hits, 0);
        };

        const getSeasonsCount = () => {
            return filteredHits.value.length;
        };

        const getHighestRank = () => {
            return Math.max(...filteredHits.value.map(hit => hit.rank));
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

        const headers = computed(() => [
            { key: 'rank', label: 'Rank' },
            { key: 'year', label: 'Year' },
            { key: 'agethatyear', label: 'Age That Year' },
            { key: 'hits', label: 'Hits' },
        ]);

        if (hitsSingleSeason.value.length === 0) {
            fetchHitsSingleSeason();
        }
        const sortConfig = ref({
            sortedKey: '',
            sortOrder: 'asc',
        });
        const sortedHits = computed(() => {
            let data = filteredHits.value;

            if (sortConfig.value.sortedKey) {
                data.sort((a, b) => {
                    const aValue = a[sortConfig.value.sortedKey];
                    const bValue = b[sortConfig.value.sortedKey];

                    if (aValue < bValue) return sortConfig.value.sortOrder === 'asc' ? -1 : 1;
                    if (aValue > bValue) return sortConfig.value.sortOrder === 'asc' ? 1 : -1;
                    return 0;
                });
            }

            return data;
        });
        const updateSortConfig = ({ columnKey, sortOrder }) => {
            sortConfig.value = {
                sortedKey: columnKey,
                sortOrder,
            };
        };

        return {
            filteredHits,
            getBats,
            getHighestRank,
            getInitials,
            getName,
            getSeasonsCount,
            getTotalHits,
            headers,
            sortedHits,
            TableView,
            updateSortConfig,
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
    @apply w-24 sm:w-40 sm:whitespace-normal font-medium text-lg ml-5;
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