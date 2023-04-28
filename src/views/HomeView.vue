<template>
  <div id="app">
    <h3>Filter by Rank Range:</h3>
    <section class="filter-section">
      <RangeSlider v-if="hitsSingleSeason" v-model:minValue="slider.minValue" v-model:maxValue="slider.maxValue" :min="0"
        :max="maxRank" @update:minValue="slider.minValue = $event" @update:maxValue="slider.maxValue = $event" />
      <div class="input-control">
        <label for="selected-ages">
          Select Ages
        </label>
        <MultipleSelect name="selected-ages" :value="selectedAges" :options="uniqueAges" placeholder="Select ages"
          @change="selectedAges = $event" />
      </div>
      <h3>Filter by Hits Range:</h3>
      <div class="flex items-center space-x-4">
        <label for="minHits" class="text-sm font-semibold">Min Hits:</label>
        <input id="minHits" type="number" v-model="minHits" min="0" @input="updateHitsRange"
          class="w-20 border border-gray-300 rounded px-2 py-1 text-sm" />
        <div class="flex items-center">
          <label for="maxHits" class="text-sm font-semibold">Max Hits:</label>
          <input v-model="maxHits" type="number" class="border border-gray-300 rounded-md p-2 w-20"
            placeholder="Max Hits" />
          <button @click="fillMaxHits" class="bg-blue-500 text-white px-2 py-1 rounded-md ml-2">
            Fill Max Hits
          </button>
        </div>
        <router-view :player="selectedPlayer" />

      </div>

    </section>

    <TableView v-if="hitsSingleSeason.length > 0" :headers="headers" :items="filteredAndSortedData"
      @sort="updateSortConfig" @filter="updateFilterValue"   :linkKey="'player'" />
    <Loading else="hitsSingleSeason" />
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue';
import { useStore } from 'vuex';
import TableView from '../components/Table/TableView.vue';
import RangeSlider from '../components/RangeSlider/RangeSlider.vue';
import Loading from '../components/Loading.vue';
import MultipleSelect from '../components/MultipleSelect.vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  components: {
    TableView,
    RangeSlider,
    Loading,
    MultipleSelect
  },
  setup() {
    const store = useStore();
    const hitsSingleSeason = computed(() => store.getters['baseball/getHitsSingleSeason']);
    const fetchHitsSingleSeason = () => store.dispatch('baseball/fetchHitsSingleSeason');
    const route = useRoute();
    const router = useRouter();

    const slider = ref({
      minValue: 0,
      maxValue: 0
    });

    const minHits = ref(0);
    const maxHits = ref(0);

    const updateHitsRange = () => {
      if (minHits.value > maxHits.value) {
        maxHits.value = minHits.value;
      }
    };

    const fillMaxHits = () => {
      if (hitsSingleSeason.value.length > 0) {
        const maxHitsValue = Math.max(...hitsSingleSeason.value.map((item) => item.hits));
        maxHits.value = maxHitsValue;
      }
    };


    const selectedAges = ref([]);
    const filterValue = ref('');
    const sortConfig = ref({
      sortedKey: '',
      sortOrder: 'asc',
    });

    const selectedPlayer = ref(null);

    const selectPlayer = (player) => {
      selectedPlayer.value = player;
      router.push({ name: 'PlayerDetail', params: { id: player.id } });
    };
    const headers = computed(() => [
      { key: 'id', label: 'Id' },
      { key: 'rank', label: 'Rank' },
      { key: 'player', label: 'Player' },
      { key: 'agethatyear', label: 'Age That Year' },
      { key: 'hits', label: 'Hits' },
    ]);

    const uniqueAges = computed(() => {
      const ages = hitsSingleSeason.value.map((item) => parseInt(item.agethatyear));
      return Array.from(new Set(ages));
    });

    const maxRank = computed(() => {
      if (hitsSingleSeason.value.length > 0) {
        const ranks = hitsSingleSeason.value.map((record) => record.rank);
        return Math.max(...ranks)
      }
    });

    const filteredAndSortedData = computed(() => {
      let data = hitsSingleSeason.value;

      if (filterValue.value) {
        data = data.filter((item) =>
          Object.values(item).some((value) =>
            String(value).toLowerCase().includes(filterValue.value.toLowerCase())
          )
        );
      }

      if (sortConfig.value.sortedKey) {
        data.sort((a, b) => {
          const aValue = a[sortConfig.value.sortedKey];
          const bValue = b[sortConfig.value.sortedKey];

          if (aValue < bValue) return sortConfig.value.sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortConfig.value.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }

      if (selectedAges.value.length > 0 && data.length > 0) {
        data = data.filter((item) => selectedAges.value.includes(Number(item["agethatyear"])));
      }

      data = data.filter((item) => {
        return item.rank >= slider.value.minValue && item.rank <= slider.value.maxValue;
      });


      if (minHits.value || maxHits.value) {
        data = data.filter((item) => {
          const hits = parseInt(item.hits);
          const minCondition = minHits.value ? hits >= minHits.value : true;
          const maxCondition = maxHits.value ? hits <= maxHits.value : true;

          return minCondition && maxCondition;
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

    const updateFilterValue = (value) => {
      filterValue.value = value;
    };

    watch(
      () => hitsSingleSeason.value,
      (newHitsSingleSeason) => {
        if (newHitsSingleSeason.length > 0) {
          slider.value.maxValue = newHitsSingleSeason.length;
        }
      },
      { immediate: true }
    );


    watch(
      () => route.params.id,
      (id) => {
        if (id) {
          const player = hitsSingleSeason.value.find((player) => player.id === parseInt(id));
          selectedPlayer.value = player;
        } else {
          selectedPlayer.value = null;
        }
      }
    );

    fetchHitsSingleSeason();

    return {
      hitsSingleSeason,
      slider,
      selectedAges,
      headers,
      uniqueAges,
      maxRank,
      filteredAndSortedData,
      updateSortConfig,
      updateFilterValue,
      minHits,
      maxHits,
      updateHitsRange,
      fillMaxHits,
      selectPlayer,
      selectedPlayer,
      
    };
  },
};
</script>


<style>
.input-control {
  display: flex;
  flex-direction: column;
}

.selected-ages {}
</style>