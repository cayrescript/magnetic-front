<template>
  <input v-if="isPagination" type="text" id="filter-input"
    class="filter-input"
    placeholder="Filter..." v-model="filterValue" @input="filterData"
    aria-label="Filter table" />

  <div class="table-container">
    <table class="custom-table divide-y divide-gray-200" aria-label="Data table">
      <thead class="bg-gray-50">
        <tr>
          <th v-for="header in headers" :key="header.key" class="table-header">
            <button @click="sortColumn(header.key)" :id="`sort-${header.key}`">
              {{ header.label }}
              <span v-if="sortedKey === header.key">
                <span v-if="sortOrder === 'asc'">&#8593;</span>
                <span v-else>&#8595;</span>
              </span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="item in paginatedItems" :key="item.id">
          <td v-for="header in headers" :key="header.key" class="table-data">
            <div v-if="header.key === 'player'">
              <router-link :to="{ name: 'Details', params: { player: getPlayerNameConcat(item.player) } }">
                {{ item.player }}
              </router-link>
            </div>
            <div v-else>
              {{ item[header.key] }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="showFooter && isPagination " class="footer-table">
      <div class="items-per-page-control mt-4">
        <label for="items-per-page" class="mr-2">Itens por página:</label>
        <select id="items-per-page" v-model.number="itemsPerPage"
          class="bg-white border border-gray-300 rounded py-1 pl-2 pr-6">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
      <div class="pagination mt-4">
        <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1" class="btn-pagination">
          Anterior
        </button>
        <span class="mx-2">{{ currentPage }}</span>
        <button @click="goToNextPage" :disabled="currentPage === lastPage || items.length <= itemsPerPage"
          class="btn-pagination">
          Próximo
        </button>
      </div>

    </div>

  </div>
</template>

<script>
import { computed, ref, watchEffect, toRefs } from 'vue';

export default {
  props: {
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    linkKey: {
      type: String,
      default: '',
    },
    perPage: {
      type: Number,
      default: 10,
    },
    isPagination: {
      type: Boolean,
      default: true,
    }
  },
  emits: ['sort', 'filter'],

  data() {
    return {
      sortedKey: '',
      sortOrder: 'asc',
    };
  },
  methods: {
    sortColumn(columnKey) {
      if (this.sortedKey === columnKey) {

        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortedKey = columnKey;
        this.sortOrder = 'asc';
      }

      this.$emit('sort', { columnKey, sortOrder: this.sortOrder });
    },
    filterData() {
      this.$emit('filter', this.filterValue);
    },
    getPlayerNameConcat(name) {
      return name.toLocaleLowerCase().replace(/\s/g, '-')
    }
  },
  setup(props) {
    const { perPage, items } = toRefs(props);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const filterValue = ref('');

    const filteredItems = computed(() => {
      if (!filterValue.value) return items.value;
      return items.value.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(filterValue.value.toLowerCase())
        )
      );
    });

    const paginatedItems = computed(() => {
      if (!props.isPagination) {
        return items.value;
      }
      if (items.value && items.value.length > 0) {
        const startIndex = (currentPage.value - 1) * itemsPerPage.value;
        const endIndex = startIndex + itemsPerPage.value;
        return filteredItems.value.slice(startIndex, endIndex);
      } else {
        return [];
      }
    });

    const lastPage = computed(() => {
      return Math.ceil(filteredItems.value.length / perPage.value);
    });

    const goToNextPage = () => {
      if (currentPage.value * itemsPerPage.value < filteredItems.value.length) {
        currentPage.value++;
      }
    };

    const showFooter = computed(() => {
      return items.value.length >= itemsPerPage.value;
    });

    watchEffect(() => {
      filteredItems.value;
      currentPage.value = 1;
    });

    return {
      currentPage,
      lastPage,
      paginatedItems,
      itemsPerPage,
      goToNextPage,
      filteredItems,
      filterValue,
      showFooter
    };
  }
};

</script>

<style scoped>
.filter-input {
  @apply w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.table-container {
  @apply overflow-x-auto;
}

.custom-table {
  @apply min-w-full;
}

.table-header {
  @apply px-6 py-3 text-left text-xs font-medium uppercase tracking-wider;
}

.table-data {
  @apply px-6 py-4 whitespace-nowrap;
}

.pagination {
  @apply flex justify-end items-center;
}

.footer-table {
  @apply flex items-center justify-between;
}

.btn-pagination {
  @apply font-bold py-2 px-4 rounded;
}

.btn-pagination:disabled {
  @apply bg-gray-300 text-gray-500 cursor-not-allowed;
}

@media screen and (max-width: 640px) {
  .table-header,
  .table-data {
    @apply px-2 py-2;
  }
}

@media screen and (min-width: 641px) and (max-width: 1024px) {
  .table-header,
  .table-data {
    @apply px-4 py-3;
  }
}
</style>