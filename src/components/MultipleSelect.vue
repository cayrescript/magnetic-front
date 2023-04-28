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
</template>
  
<script>
export default {
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
    computed: {
        selectedItemsText() {
            if (this.selectedItems.length === 0) {
                return 'Select age values';
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
    },
};
</script>
  
<style scoped>
.multiple-select {
    position: relative;
    display: inline-block;
    cursor: pointer;
    user-select: none;
}

.multiple-select__selected {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f9f9f9;
}

.multiple-select__options {
    position: absolute;
    left: 0;
    right: 0;
    margin-top: 2px;
    padding: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
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
</style>
  