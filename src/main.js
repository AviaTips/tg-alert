import WebApp from '@twa-dev/sdk';
// calls the ready() method to initialize the Telegram Mini App
WebApp.ready();

import '@vant/touch-emulator';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import {
  createRouter,
  createWebHistory,
} from 'vue-router';

import './style.css'; // Custom CSS styles
import 'vant/lib/index.css'; // Vant CSS styles

import i18n from './i18n.js'; // Internationalization logic

import App from './App.vue';

import AlertsList from './views/AlertsList.vue';
import CreateAlertDestination from './views/CreateAlertDestination.vue';
import CreateAlertOptions from './views/CreateAlertOptions.vue';
import CreateAlertOrigin from './views/CreateAlertOrigin.vue';

// Create a Vue Router instance with defined routes
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
