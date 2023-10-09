import ky from 'ky';

let current;
export async function currentCode() {
  if (!current) {
    try {
      const res = await ky('https://www.travelpayouts.com/whereami').json();
      if (res.iata) {
        current = res;
      }
    } catch (err) { console.error(err); }
  }
  return current.iata;
}

export function timezone() {
  try {
    return new Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch (err) {
    console.error(err);
    return 'UTC';
  }
}
