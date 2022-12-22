import {
  ajax,
  getDataFromLocalStorage,
  getExpiresAt,
  setDataToLocalStorage,
} from "../Api";

export const login = (account, password) => {
  const localStorage = getDataFromLocalStorage();
  return new Promise((resolve, reject) => {
    ajax({
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
          AT: data.data.access_token,
          expiresAt: getExpiresAt(data.data.expires_in),
        });
        resolve(data.data);
      })
      .catch((error) => reject(error));
  });
};
