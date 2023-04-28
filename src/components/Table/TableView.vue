<template>
    <div>
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header.key" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ header.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in items" :key="item.id">
            <td v-for="header in headers" :key="header.key" class="px-6 py-4 whitespace-nowrap">
              <div v-if="header.key === 'player'">
                <router-link :to="{ name: 'PlayerDetails', params: { id: item.id } }">
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
    </div>
  </template>

<script>
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
    },
    data() {
        return {
            sortedKey: '',
            sortOrder: 'asc',
            filterValue: '',
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
    },
};

</script>