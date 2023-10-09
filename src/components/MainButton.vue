<script setup>
import { Button } from 'vant';
import WebApp from '@twa-dev/sdk';
import { onMounted, onUnmounted, watch } from 'vue';

const isWebApp = !!WebApp.initData;

const props = defineProps({
  text: {
    type: String,
    default: null,
  },
  progress: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['click']);

function onClick() {
  emit('click');
}

onMounted(() => {
  if (isWebApp) {
    WebApp.MainButton.setParams({
      text: props.text,
      is_active: props.active,
      is_visible: true,
    });
    WebApp.MainButton.show();
    WebApp.MainButton.onClick(onClick);
    if (props.progress) {
      WebApp.MainButton.showProgress();
    } else {
      WebApp.MainButton.hideProgress();
    }
    if (props.active) {
      WebApp.MainButton.enable();
    } else {
      WebApp.MainButton.disable();
    }
  }
});

onUnmounted(() => {
  if (isWebApp) {
    WebApp.MainButton.setParams({ is_visible: false });
    WebApp.MainButton.offClick(onClick);
  }
});

watch(() => props.progress, () => {
  if (props.progress) {
    WebApp.MainButton.showProgress();
  } else {
    WebApp.MainButton.hideProgress();
  }
});

watch(() => props.active, () => {
  if (props.active) {
    WebApp.MainButton.enable();
  } else {
    WebApp.MainButton.disable();
  }
});
</script>

<template>
  <Button
    v-if="!isWebApp"
    type="primary"
    size="large"
    :class="$style.button"
    :loading="progress"
    :disabled="!props.active"
    @click="$emit('click')"
  >
    {{ props.text }}
  </Button>
</template>

<style module>
.button {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
