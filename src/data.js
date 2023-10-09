import Document from 'flexsearch/src/document.js';
import i18n from './i18n.js';

import cities from '../data/cities.json';
import countries from '../data/countries.json';

for (const city of cities) {
  city.country = countries.find((item) => item.code === city.country);
}

const lang = i18n.global.locale.value;

const index = new Document({
  split: /[\s()\-,.]+/,
  tokenize: 'forward',
  document: {
    id: 'code',
    index: 'key',
    store: ['name', 'country', 'title'],
  },
});

console.time('index');
for (const doc of [...countries, ...cities]) {
  const key = [doc.name.en, doc.code];
  if (lang === 'ru') {
    key.unshift(doc.name.ru);
  }
  if (doc.country) {
    if (lang === 'ru') {
      key.push(doc.country.name.ru);
    }
    key.push(doc.country.name.en, doc.country.code);
  }
  index.add({
    code: doc.code,
    name: doc.name[lang],
    country: doc.country ? doc.country.name[lang] : undefined,
    title: doc.country ? `${doc.name[lang]}, ${doc.country.name[lang]}` : doc.name[lang],
    key: key.join(' '),
  });
}
console.timeEnd('index');

export default {
  search(query) {
    return index.search(query, { pluck: 'key', enrich: true })
      .map((item) => {
        return {
          ...item.doc,
          code: item.id,
        };
      });
  },
  get(code) {
    if (code === 'XXX') {
      return {
        code: 'XXX',
        name: i18n.global.t('Anywhere'),
        title: i18n.global.t('Anywhere'),
      };
    }
    const item = index.get(code);
    if (item) {
      return {
        code,
        ...item,
      };
    }
    return {
      code,
      name: code,
      title: code,
    };
  },
};
