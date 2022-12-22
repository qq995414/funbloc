import {
  ajaxManager,
  getDataFromLocalStorage,
  getExpiresAt,
  setDataToLocalStorage,
} from "../Api";

export const managerLogin = (account, password) => {
  const localStorage = getDataFromLocalStorage();
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: "/auth/login",
      method: "post",
      data: {
        account: account,
        password: password,
      },
    })
      .then(({ data }) => {
        setDataToLocalStorage({
          ...localStorage,
          managerAT: data.data.access_token,
          managerExpiresAt: getExpiresAt(data.data.expires_in),
        });
        resolve(data.data);
      })
      .catch((error) => reject(error));
  });
};

export const fetchMe = (account, password) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: "/auth/me",
      method: "post",
    })
      .then(({ data }) => {
        resolve(data.data);
      })
      .catch((error) => reject(error));
  });
};
