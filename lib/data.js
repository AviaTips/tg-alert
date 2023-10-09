import cities from '../data/cities.json' assert { type: 'json' };
import countries from '../data/countries.json' assert { type: 'json' };

for (const city of cities) {
  city.country = countries.find((item) => item.code === city.country);
}

const data = new Map([
  ...cities,
  ...countries,
  {
    code: 'XXX',
    name: {
      en: 'Anywhere',
      ru: 'Куда угодно',
    },
  }
].map((item) => [item.code, item]));

export default data;
