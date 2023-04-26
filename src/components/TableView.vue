<template>
    <div class="w-full">
        <input type="text"
            class="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Filter..." v-model="filterValue" @input="filterData" />

        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th v-for="header in headers" :key="header.key"
                        class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        <button @click="sortColumn(header.key)">
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
                <tr v-for="item in items" :key="item.id">
                    <td v-for=" header  in  headers " :key="header.key" class="px-6 py-4 whitespace-nowrap">
                        {{ item[header.key] }}
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