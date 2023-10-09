import WebApp from '@twa-dev/sdk';
import ky from 'ky';

export default ky.create({
  headers: {
    'tgwebappdata': WebApp.initData,
  },
  prefixUrl: '/api/',
});
