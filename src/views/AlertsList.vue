<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Button, Cell, CellGroup, Empty, List, SwipeCell } from 'vant';

import MainButton from '../components/MainButton.vue';
import currencies from '../../data/currencies.js';
import data from '../data.js';
import showConfirm from '../helpers/showConfirm.js';
import { useAlertsStore } from '../stores/alerts.js';

const router = useRouter();
const alertsStore = useAlertsStore();
const { t, locale } = useI18n();

onMounted(async () => {
  await alertsStore.load();
});

function type(alert) {
  if (alert.type === 'oneway') {
    return t('One-way');
  } else {
    return t('Return');
  }
}

function range(alert) {
  if (alert.type === 'return') {
    if (alert.range[0] === alert.range[1]) {
      return t('Duration {0} days', alert.range, alert.range[0]);
    } else {
      return t('Duration from {0} to {1} days', alert.range, alert.range[1]);
    }
  }
}

function currency(alert) {
  return currencies.find((item) => item.code === alert.currency).name[locale.value];
}

function remove(alert) {
  showConfirm(t('Delete alert?'))
    .then(() => {
      alertsStore.remove(alert.id);
    }, () => {});
}
</script>

<template>
  <List
    :class="$style.list"
    :loading="alertsStore.loading"
  >
    <SwipeCell
      v-for="alert in alertsStore.alerts"
      :key="alert.id"
    >
      <CellGroup>
        <Cell
          :title="$t('From')"
          :value="data.get(alert.origin).title"
        />
        <Cell
          :title="$t('To')"
          :value="data.get(alert.destination).title"
        />
        <Cell
          :title="$t('Trip')"
          :value="type(alert)"
          :label="range(alert)"
        />
        <Cell
          :title="$t('Currency')"
          :value="currency(alert)"
        />
      </CellGroup>
      <template #right>
        <Button
          square
          type="danger"
          :text="$t('Delete')"
          :class="$style.remove"
          @click="remove(alert)"
        />
      </template>
    </SwipeCell>
    <Empty
      v-if="!alertsStore.alerts?.length"
      :description="$t('No alerts')"
    />
  </List>
  <MainButton
    :text="$t('Create alert')"
    @click="router.push('/create/origin')"
  />
</template>

<style module>
.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.remove {
  height: 100%;
}
</style>
