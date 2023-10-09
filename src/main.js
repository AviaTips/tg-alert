import WebApp from '@twa-dev/sdk';
WebApp.ready();

import '@vant/touch-emulator';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import {
  createRouter,
  createWebHistory,
} from 'vue-router';

import './style.css';
import 'vant/lib/index.css';

import i18n from './i18n.js';

import App from './App.vue';

import AlertsList from './views/AlertsList.vue';
import CreateAlertDestination from './views/CreateAlertDestination.vue';
import CreateAlertOptions from './views/CreateAlertOptions.vue';
import CreateAlertOrigin from './views/CreateAlertOrigin.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    component: AlertsList,
  }, {
    path: '/create/origin',
    alias: '/create',
    component: CreateAlertOrigin,
  }, {
    path: '/create/destination',
    component: CreateAlertDestination,
  }, {
    path: '/create/options',
    component: CreateAlertOptions,
  }],
});

const pinia = createPinia();
const app = createApp(App);

app.use(i18n);
app.use(router);
app.use(pinia);
app.mount('#app');
