<script setup>
import { ConfigProvider } from 'vant';
import { RouterView } from 'vue-router';
import WebApp from '@twa-dev/sdk';
</script>

<template>
  <ConfigProvider :theme="WebApp.colorScheme">
    <RouterView />
  </ConfigProvider>
</template>
