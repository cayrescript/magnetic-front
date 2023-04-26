<template>
  <div id="app">
    <TableView :headers="headers" :items="filteredAndSortedData" @sort="updateSortConfig" @filter="updateFilterValue" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import TableView from '../components/TableView.vue';

export default {
  components: {
    TableView,
  },
  data() {
    return {
      sortConfig: {
        sortedKey: '',
        sortOrder: 'asc',
      },
      filterValue: '',
    };
  },
  computed: {
    ...mapGetters('baseball', ['getHitsSingleSeason', 'getError']),
    hitsSingleSeason() {
      return this.getHitsSingleSeason;
    },
    headers() {
      return [
        { key: 'id', label: 'Id' },
        { key: 'rank', label: 'Rank' },
        { key: 'player', label: 'Player' },
        { key: 'agethatyear', label: 'Age That Year' },
        { key: 'hits', label: 'Hits' },
      ];
    },
    filteredAndSortedData() {
      let data = this.hitsSingleSeason;

      if (this.filterValue) {
        data = data.filter((item) =>
          Object.values(item).some((value) =>
            String(value).toLowerCase().includes(this.filterValue.toLowerCase())
          )
        );
      }

      if (this.sortConfig.sortedKey) {
        data.sort((a, b) => {
          const aValue = a[this.sortConfig.sortedKey];
          const bValue = b[this.sortConfig.sortedKey];

          if (aValue < bValue) return this.sortConfig.sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return this.sortConfig.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return data;
    },
  },
  methods: {
    ...mapActions('baseball', ['fetchHitsSingleSeason']),
    updateSortConfig({ columnKey, sortOrder }) {
      this.sortConfig = {
        sortedKey: columnKey,
        sortOrder,
      };
    },
    updateFilterValue(value) {
      this.filterValue = value;
    },
  },
  mounted() {
    this.fetchHitsSingleSeason();
  },
};
</script>
