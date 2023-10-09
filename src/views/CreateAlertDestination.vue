<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

import AlertSteps from '../components/AlertSteps.vue';
import BackButton from '../components/BackButton.vue';
import MainButton from '../components/MainButton.vue';
import SearchList from '../components/SearchList.vue';
import data from '../data.js';
import { useAlertStore } from '../stores/alert.js';

const router = useRouter();
const alertStore = useAlertStore();
const defaultList = ref([]);
const { locale } = useI18n();

onMounted(() => {
  const list = (locale.value === 'ru'
    ? ['XXX', 'MOW', 'LED', 'SVX', 'OVB', 'AER', 'KZN', 'OMS', 'IKT', 'VVO', 'IST']
    : ['XXX', 'BKK', 'LON', 'PAR', 'DXB', 'SIN', 'NYC', 'KUL', 'IST', 'TYO', 'AYT'])
    .filter((code) => code !== alertStore.alert.origin);
  if (alertStore.alert.destination && !list.includes(alertStore.alert.destination)) {
    list.unshift(alertStore.alert.destination);
  }
  defaultList.value = list.map((code) => data.get(code));
});

function next() {
  if (alertStore.alert.destination) {
    router.push('/create/options');
  }
}

function select(value) {
  alertStore.alert.destination = value.code;
  next();
}
</script>

<template>
  <BackButton />
  <AlertSteps :active="1" />
  <SearchList
    :placeholder="$t('Destination city or country')"
    :default="defaultList"
    :selected="alertStore.alert.destination"
    :exclude="alertStore.alert.origin"
    @select="select"
  />
  <MainButton
    :text="$t('Next')"
    :active="!!alertStore.alert.destination"
    @click="next"
  />
</template>
