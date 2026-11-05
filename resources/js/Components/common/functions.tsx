import React from 'react';

export default function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
export function getStorage(item: string) {
  let s_item = undefined;
  if (localStorage.hasOwnProperty(item)) {
    s_item = JSON.parse(localStorage[item]);
  }
  return s_item;
}

// 同一タブ内でのlocalStorage変更を通知するイベント名
// (window の 'storage' イベントは他タブでの変更時にしか発火しないため)
const STORAGE_CHANGE_EVENT = 'app-storage-change';

function notifyStorageChange(item_name: string) {
  window.dispatchEvent(
    new CustomEvent(STORAGE_CHANGE_EVENT, { detail: item_name }),
  );
}

export function setStorage(item_name: string, item: Object) {
  localStorage.setItem(item_name, JSON.stringify(item));
  notifyStorageChange(item_name);
}
export function deleteStorage(item_name: string) {
  localStorage.removeItem(item_name);
  notifyStorageChange(item_name);
}

/**
 * localStorageの値を購読するフック。
 * ログイン/ログアウトなどで値が変わると再レンダリングされる。
 */
export function useStorage(item: string) {
  const [value, setValue] = React.useState(() => getStorage(item));
  React.useEffect(() => {
    const update = () => setValue(getStorage(item));
    const onChange = (e: Event) => {
      const key =
        e instanceof StorageEvent ? e.key : (e as CustomEvent<string>).detail;
      if (key === null || key === item) update();
    };
    window.addEventListener(STORAGE_CHANGE_EVENT, onChange);
    window.addEventListener('storage', onChange);
    // マウントまでの間に変更されていた場合に備えて最新値を反映
    update();
    return () => {
      window.removeEventListener(STORAGE_CHANGE_EVENT, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, [item]);
  return value;
}
