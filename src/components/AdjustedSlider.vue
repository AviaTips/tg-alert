<script setup>
import { Slider } from 'vant';
import { computed, ref } from 'vue';

import currencies from '../../data/currencies.js';

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
  currency: {
    type: String,
    default: null,
  },
});
const emit = defineEmits(['update:modelValue']);

const currency = computed(() => {
  return currencies.find((item) => item.code === props.currency);
});

const value = computed({
  get() {
    return Math.floor(props.modelValue / currency.value.step) || 1;
  },
  set(value) {
    emit('update:modelValue', value * currency.value.step);
  },
});

function initialMax(value) {
  let tmp = 100;
  while (value >= (tmp * 0.9)) {
    tmp *= 2;
  }
  return tmp;
}

const max = ref(initialMax(value.value));

function onChange(value) {
  if (value > (max.value * 0.9)) {
    if (max.value * 2 <= 3200) {
      max.value = max.value * 2;
    }
  }
  if (value < (max.value * 0.1)) {
    if (max.value / 2 >= 100) {
      max.value = max.value / 2;
    }
  }
}
</script>

<template>
  <Slider
    v-model="value"
    :min="1"
    :max="max"
    :step="1"
    @change="onChange"
  />
</template>
