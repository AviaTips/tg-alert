<script setup>
import { useI18n } from 'vue-i18n';
import {
  Cell,
  CellGroup,
  Field,
  Form,
  Picker,
  Popup,
  Radio,
  RadioGroup,
  Slider,
  showFailToast,
  showLoadingToast,
  showSuccessToast,
} from 'vant';
import { computed, ref } from 'vue';

import AlertSteps from '../components/AlertSteps.vue';
import BackButton from '../components/BackButton.vue';
import MainButton from '../components/MainButton.vue';
import currencies from '../../data/currencies.js';
import { useAlertStore } from '../stores/alert.js';
import { useRoute, useRouter } from 'vue-router';

const alertStore = useAlertStore();
const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

const loading = ref(false);

function onConfirm({ selectedOptions }) {
  alertStore.alert.currency = selectedOptions[0]?.value;
  showCurrencyPicker.value = false;
}

function onClickOption({ selectedOptions }) {
  if (alertStore.alert.currency === selectedOptions[0]?.value) {
    showCurrencyPicker.value = false;
  }
}

function formatRange(alert) {
  if (alert.range[0] === alert.range[1]) {
    return t('Trip for {0} days', alert.range, alert.range[0]);
  } else {
    return t('Trip from {0} to {1} days', alert.range, alert.range[1]);
  }
}

const columns = computed(() => {
  return currencies.map((item) => {
    return {
      text: item.name[locale.value],
      value: item.code,
    };
  });
});

const currency = computed(() => {
  return currencies.find((item) => item.code === alertStore.alert.currency);
});

const showCurrencyPicker = computed({
  get() {
    return route.query?.popup === 'currency';
  },
  set(value) {
    if (value) {
      router.push({ query: { popup: 'currency' }});
    } else {
      router.back();
    }
  },
});

async function save() {
  loading.value = true;
  showLoadingToast({ forbidClick: true });
  try {
    await alertStore.save();
    showSuccessToast();
    router.push('/');
  } catch (err) {
    console.error(err);
    showFailToast();
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <BackButton />
  <AlertSteps :active="3" />
  <Form>
    <CellGroup>
      <Field
        :model-value="currency.name[locale]"
        is-link
        readonly
        name="currency"
        :label="$t('Currency')"
        :placeholder="$t('Select currency')"
        @click="showCurrencyPicker = true"
      />
      <Popup
        v-model:show="showCurrencyPicker"
        position="bottom"
        :style="{height: '100%'}"
      >
        <Picker
          :model-value="[alertStore.alert.currency]"
          :columns="columns"
          @confirm="onConfirm"
          @change="onConfirm"
          @click-option="onClickOption"
          @cancel="showCurrencyPicker = false"
        />
      </Popup>

      <RadioGroup
        v-model="alertStore.alert.type"
        :class="$style.group"
      >
        <Radio
          name="oneway"
          :class="$style.radio"
        >
          {{ $t('One-way') }}
        </Radio>
        <Radio
          name="return"
          :class="$style.radio"
        >
          {{ $t('Return') }}
        </Radio>
      </RadioGroup>

      <Cell
        v-if="alertStore.alert.type === 'return'"
        :title="$t('Trip duration')"
        :label="formatRange(alertStore.alert)"
      />
      <Field
        v-if="alertStore.alert.type === 'return'"
        name="range"
      >
        <template #input>
          <Slider
            v-model="alertStore.alert.range"
            :min="1"
            :max="90"
            :step="1"
            range
          />
        </template>
      </Field>
    </CellGroup>
  </Form>
  <MainButton
    :text="$t('Create alert')"
    :progress="loading"
    @click="save"
  />
</template>

<style module>
.group {
  padding: 10px 16px;
}
.radio {
  margin-bottom: 8px;
}
</style>
