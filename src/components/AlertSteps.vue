<script setup>
import {
  Step,
  Steps,
} from 'vant';
const props = defineProps({
  active: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <Steps :active="props.active">
    <Step>{{ $t('From') }}</Step>
    <Step>{{ $t('To') }}</Step>
    <Step>{{ $t('Type') }}</Step>
  </Steps>
</template>
