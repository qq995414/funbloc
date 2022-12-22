import axios from "axios";

export const HOST = "/api/v1";
export const HOST_MANAGER = "/api/v1/manager";

const LOCALSTORAGE_KEY = "funbloc";

const headerConfig = {
  // 'Content-Type': 'application/json',
  Accept: "application/json",
};

export const getDataFromLocalStorage = () =>
  JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || {};
export const setDataToLocalStorage = (data) =>
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(data));
export const removeDataFromLocalStorage = () =>
  localStorage.removeItem(LOCALSTORAGE_KEY);
export const isExpired = (expiresAt) => new Date().getTime() >= expiresAt;
export const getExpiresAt = (expiresIn) =>
  new Date().getTime() + expiresIn * 1_000;

export const checkAndRefreshAccessToken = async (config) => {
  let {
    AT: accessToken,
    expiresAt,
    managerAT,
    managerExpiresAt,
  } = getDataFromLocalStorage();

  if (isExpired(expiresAt)) {
    window.location = "/";
    removeDataFromLocalStorage();
    return;
  }
  if (isExpired(managerExpiresAt)) {
    removeDataFromLocalStorage();
    window.location = "/manager";
    return;
  }
  if (window.location.pathname.includes("/manager")) {
    config.headers.Authorization = `Bearer ${managerAT}`;
  } else {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

const onRequestFulfilled = (config) => checkAndRefreshAccessToken(config);
const onRequestRejected = (error) => Promise.reject(error);

const onResponseFulfilled = (response) => response;
const onResponseRejected = (error) => {
  alert(error.response.data.message);
  if (error.response.status === 401) {
    window.location = "/";
  }
  return Promise.reject(error);
};
export const ajax = ({
  host = HOST,
  url,
  method = "get",
  headers = headerConfig,
  data = {},
  params,
  signal,
}) => {
  return new Promise((resolve, reject) => {
    const instance = axios.create({});
    instance.interceptors.request.use(onRequestFulfilled, onRequestRejected);
    instance.interceptors.response.use(onResponseFulfilled, onResponseRejected);

    instance
      .request({
        headers,
        url: `${host}${url}`,
        method,
        params,
        data,
        signal,
      })
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
};

export const ajaxManager = ({
  host = HOST_MANAGER,
  url,
  method = "get",
  headers = headerConfig,
  data = {},
  params,
  signal,
}) => {
  return new Promise((resolve, reject) => {
    const instance = axios.create({});
    instance.interceptors.request.use(onRequestFulfilled, onRequestRejected);
    instance.interceptors.response.use(onResponseFulfilled, onResponseRejected);

    instance
      .request({
        headers,
        url: `${host}${url}`,
        method,
        params,
        data,
        signal,
      })
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
};
