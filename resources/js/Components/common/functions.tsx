export default function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
export function getStorage(item: string) {
  var s_item = undefined;
  if (localStorage.hasOwnProperty(item)) {
    s_item = JSON.parse(localStorage[item]);
  }
  return s_item;
}

export function setStorage(item_name: string, item: Object) {
  localStorage.setItem(item_name, JSON.stringify(item));
}
export function deleteStorage(item_name: string) {
  localStorage.removeItem(item_name);
}