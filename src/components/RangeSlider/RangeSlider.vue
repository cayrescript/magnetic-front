<template>
    <h3>Range: {{ minValue }} - {{ maxValue }}</h3>
    <div class="range-slider" ref="slider" @mousedown="startDrag">
      <div class="range" :style="rangeStyle">
      </div>
      <div
        class="thumb thumb-min"
        :style="{ left: `${(minValue / max) * 100}%` }"
        ref="minThumb"
      ></div>
      <div
        class="thumb thumb-max"
        :style="{ left: `${(maxValue / max) * 100}%` }"
        ref="maxThumb"
      ></div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onUnmounted } from 'vue';
  
  export default {
    props: {
      minValue: {
        type: Number,
        required: true,
      },
      maxValue: {
        type: Number,
        required: true,
      },
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 100,
      },
    },
    setup(props, { emit }) {
      const slider = ref(null);
      const minThumb = ref(null);
      const maxThumb = ref(null);
  
      let isDragging = false;
      let activeThumb = null;
  
      const startDrag = (event) => {
        isDragging = true;
        const minThumbRect = minThumb.value.getBoundingClientRect();
        const maxThumbRect = maxThumb.value.getBoundingClientRect();
  
        if (
          Math.abs(event.clientX - minThumbRect.x) <
          Math.abs(event.clientX - maxThumbRect.x)
        ) {
          activeThumb = minThumb.value;
        } else {
          activeThumb = maxThumb.value;
        }
  
        window.addEventListener('mousemove', updateValue);
        window.addEventListener('mouseup', stopDrag);
      };
  
      const updateValue = (event) => {
        if (!isDragging) return;
  
        const sliderRect = slider.value.getBoundingClientRect();
        const sliderWidth = sliderRect.width;
        const offsetX = event.clientX - sliderRect.x;
  
        let newValue = parseInt(((offsetX / sliderWidth) * (props.max - props.min)) + props.min);
        newValue = parseInt(Math.min(Math.max(newValue, props.min), props.max));
  
        if (activeThumb === minThumb.value) {
          if (newValue > props.maxValue) {
            newValue = props.maxValue;
          }
          emit('update:minValue', newValue);
        } else {
          if (newValue < props.minValue) {
            newValue = props.minValue;
          }
          emit('update:maxValue', newValue);
        }
      };
  
      const stopDrag = () => {
        isDragging = false;
        window.removeEventListener('mousemove', updateValue);
        window.removeEventListener('mouseup', stopDrag);
      };
  
      onUnmounted(() => {
        window.removeEventListener('mousemove', updateValue);
        window.removeEventListener('mouseup', stopDrag);
      });
  
      const rangeStyle = computed(() => ({
        left: `${(props.minValue / props.max) * 100}%`,
        right: `${100 - (props.maxValue / props.max) * 108}%`,
      }));
  
      return {
        slider,
        minThumb,
        maxThumb,
        startDrag,
        rangeStyle,
      };
    },
  };
  </script>
  
  <style scoped>
  .range-slider {
    display: flex;
    align-items: center;
    background: #ddd;
    border-radius: 2rem;
    cursor: pointer;
    height: 0.5rem;
    margin: 2rem 0;
    position: relative;
    width: 8rem;
    
  }

  .range {
    position: absolute;
    height: 100%;
    background-color: #0a0;
  }

  .thumb {
    position: absolute;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    cursor: grab;
    user-select: none;
  }

  .thumb.thumb-min {
    margin-left: -0.5rem;
  }
  .thumb.thumb-max {
    margin-right: 0.5rem;
  }

</style>