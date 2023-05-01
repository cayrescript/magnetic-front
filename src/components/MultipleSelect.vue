<template>
    <div class="multiple-select">
        <div @click="toggleDropdown" class="multiple-select__selected">
            <span>{{ selectedItemsText }}</span>
        </div>
        <transition name="fade">
            <div v-if="isOpen" class="multiple-select__options">
                <div v-for="(option, index) in options" :key="index" @click="toggleOption(option)"
                    class="multiple-select__option" :class="{ 'multiple-select__option--selected': isSelected(option) }">
                    {{ option }}
                </div>
            </div>
        </transition>
    </div>
    <button v-if="selectedItems.length > 0" @click="clearSelectedItems" class="btn-clear ml-2">
        Limpar
    </button>
</template>
  
<script>
export default {
    inheritAttrs: false,
    props: {
        options: {
            type: Array,
            required: true,
        },
        value: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            selectedItems: this.value,
            isOpen: false,
        };
    },
    emits: ['input'],
    computed: {
        selectedItemsText() {
            if (this.selectedItems.length === 0) {
                return 'Choose';
            } else {
                return this.selectedItems.join(', ');
            }
        },
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
        toggleOption(option) {
            const index = this.selectedItems.indexOf(option);
            if (index === -1) {
                this.selectedItems.push(option);
            } else {
                this.selectedItems.splice(index, 1);
            }
            this.$emit('input', this.selectedItems);
        },
        isSelected(option) {
            return this.selectedItems.includes(option);
        },
        clearSelectedItems() {
            this.selectedItems = [];
            this.isOpen = false;
            this.$emit('input', this.selectedItems); // Emitindo o evento 'input' com um array vazio
        }
    },
};
</script>

<style scoped>
.multiple-select {
    cursor: pointer;
    display: inline-block;
    position: relative;
    user-select: none;
}

.multiple-select__selected {
    background-color: 0;
    border-radius: 4px;
    border: 1px solid #ccc;
    padding: 10px;
}

.multiple-select__options {
    background-color: #f9f9f9;
    border-radius: 4px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    left: 0;
    margin-top: 2px;
    max-height: 200px;
    overflow-y: auto;
    padding: 10px 0;
    position: absolute;
    right: 0;
    z-index: 100;
}

.multiple-select__option {
    padding: 5px 10px;
}

.multiple-select__option:hover {
    background-color: #eee;
}

.multiple-select__option--selected {
    font-weight: bold;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.btn-clear {
    @apply py-1 px-2 rounded bg-red-500 text-white;
}

.btn-clear:hover {
    @apply bg-blue-700;
}
</style>
      