export const store = (storageKey: any, value: any) => {
  // encrypt the value
  const encryptedValue = btoa(escape(JSON.stringify(value)));
  //const encryptedValue = JSON.stringify(value);
  localStorage.setItem(storageKey, encryptedValue);
};

export const get = (storageKey: any) => {
  const res = localStorage.getItem(storageKey);
  if (res) {
    // decrypt the value
    return JSON.parse(unescape(atob(res)));
    //return JSON.parse(res);
  } else {
    return false;
  }
};

export const removeItem = (storageKey: any) => {
  localStorage.removeItem(storageKey);
};

export const clear = () => {
  localStorage.clear();
};

//export default storage
