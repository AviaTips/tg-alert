import { Locale } from 'vant';
import WebApp from '@twa-dev/sdk';
import { createI18n } from 'vue-i18n';

// eslint-disable-next-line import/no-unresolved
import messages from '@intlify/unplugin-vue-i18n/messages';
//import messagesEN from './locales/en.json';
//import messagesRU from './locales/ru.json';

import vantMessagesEN from 'vant/es/locale/lang/en-US';
import vantMessagesRU from 'vant/es/locale/lang/ru-RU';

function detectLoacale() {
  if (WebApp.initDataUnsafe?.user?.language_code === 'ru') {
    return 'ru';
  }
  return 'en';
}

const locale = detectLoacale();
//const messages = (await import(`./locales/${locale}.json`)).default;

function customRule(choice, choicesLength) {
  if (choice === 0) {
    return 0;
  }

  const teen = choice > 10 && choice < 20;
  const endsWithOne = choice % 10 === 1;
  if (!teen && endsWithOne) {
    return 1;
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2;
  }

  return choicesLength < 4 ? 2 : 3;
}

const numberFormats = {
  'en': {
    currency: {
      style: 'currency',
      currency: 'USD',
    },
  },
  'ru': {
    currency: {
      style: 'currency',
      currency: 'RUB',
    },
  },
};

const i18n = createI18n({
  legacy: false,
  locale,
  globalInjection: true,
  //messages: {
  //  [locale]: messages,
  //},
  //messages: {
  //  ru: messagesRU,
  //  en: messagesEN,
  //},
  messages,
  pluralRules: {
    ru: customRule,
  },
  numberFormats,
});

//const vantMessages = (await import(`../node_modules/vant/es/locale/lang/${locale === 'ru' ? 'ru-RU' : 'en-US'}.mjs`));

Locale.add({
  en: vantMessagesEN,
  ru: vantMessagesRU,
});

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
Locale.add({
  ru: {
    vanCalendar: {
      monthTitle: (year, month) => {
        return `${MONTHS[month - 1]} ${year}`;
      },
    },
  },
});

Locale.use(locale);

export default i18n;

