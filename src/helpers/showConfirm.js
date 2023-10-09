import WebApp from '@twa-dev/sdk';
import { showConfirmDialog } from 'vant';


export default function showConfirm(message) {
  if (WebApp.initData) {
    return new Promise((resolve, reject) => {
      WebApp.showConfirm(message, (res) => {
        if (res) {
          resolve();
        } else {
          reject();
        }
      });
    });
  } else {
    return showConfirmDialog({
      title: message,
    });
  }
}
