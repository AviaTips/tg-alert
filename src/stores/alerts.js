import api from '../api.js';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAlertsStore = defineStore('alerts', () => {
  const loading = ref(false);
  const alerts = ref([]);

  async function load() {
    loading.value = true;
    alerts.value = (await api.get('alerts').json()).data;
    loading.value = false;
  }

  async function remove(id) {
    loading.value = true;
    await api.delete(`alerts/${id}`).json();
    await load();
    loading.value = false;
  }

  return { loading, alerts, load, remove };
});
