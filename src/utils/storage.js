// src/utils/storage.js

export const getSetupDataFromLocalStorage = () => {
    const data = JSON.parse(localStorage.getItem("setupData"));
    return data || {}; // return empty object if not found
  };
  