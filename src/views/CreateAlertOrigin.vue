<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

import AlertSteps from '../components/AlertSteps.vue';
import BackButton from '../components/BackButton.vue';
import MainButton from '../components/MainButton.vue';
import SearchList from '../components/SearchList.vue';
import { currentCode } from '../utils.js';
import data from '../data.js';
import { useAlertStore } from '../stores/alert.js';

const router = useRouter();
const alertStore = useAlertStore();
const defaultList =ref([]);
const { locale } = useI18n();

function next() {
  if (alertStore.alert.origin) {
    router.push('/create/destination');
  }
}

onMounted(async () => {
  const list = (locale.value === 'ru'
    ? ['MOW', 'LED', 'SVX', 'OVB', 'AER', 'KZN', 'OMS', 'IKT', 'VVO', 'KGD']
    : ['BKK', 'LON', 'PAR', 'DXB', 'SIN', 'NYC', 'KUL', 'IST', 'TYO', 'AYT']);
  if (alertStore.alert.origin && !list.includes(alertStore.alert.origin)) {
    list.unshift(alertStore.alert.origin);
  }
  const code = await currentCode();
  if (code) {
    list.unshift(code);
  }
  defaultList.value = list.map((code) => data.get(code));
});

function select(value) {
  alertStore.alert.origin = value.code;
  next();
}
</script>

<template>
  <BackButton />
  <AlertSteps :active="0" />
  <SearchList
    :placeholder="$t('Departure city or country')"
    :default="defaultList"
    :selected="alertStore.alert.origin"
    @select="select"
  />
  <MainButton
    :text="$t('Next')"
    :active="!!alertStore.alert.origin"
    @click="next"
  />
</template>
