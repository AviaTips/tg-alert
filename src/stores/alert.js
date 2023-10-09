import api from '../api.js';
import { defineStore } from 'pinia';
import i18n from '../i18n.js';
import { reactive } from 'vue';
import { timezone } from '../utils.js';

function defaultAlert() {
  return {
    origin: null,
    destination: null,
    type: 'oneway',
    currency: i18n.global.locale.value === 'ru' ? 'RUB' : 'USD',
    range: [5, 14],
  };
}

export const useAlertStore = defineStore('alert', () => {
  const alert = reactive(defaultAlert());

  async function save() {
    const json = {
      origin: alert.origin,
      destination: alert.destination,
      currency: alert.currency,
      type: alert.type,
      timezone: timezone(),
    };
    if (alert.type === 'return') {
      json.range = alert.range;
    }
    await api.post('alerts', { json }).json();
    Object.assign(alert, defaultAlert());
  }

  return { alert, save };
});
