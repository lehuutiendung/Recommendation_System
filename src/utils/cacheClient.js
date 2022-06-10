// Local Storage
export const _getLocalStorage = (key) => {
    return localStorage.getItem(`visonet_${key}`);
}
export const _setLocalStorage = (key, value) => {
    localStorage.setItem(`visonet_${key}`, value);
}
export const _removeLocalStorage = (key) => {
    localStorage.removeItem(`visonet_${key}`);
}

// Session Storage
export const _getSessionStorage = (key) => {
    return sessionStorage.getItem(`visonet_${key}`);
}
export const _setSessionStorage = (key, value) => {
    sessionStorage.setItem(`visonet_${key}`, value);
}
export const _removeSessionStorage = (key) => {
    sessionStorage.removeItem(`visonet_${key}`);
}




