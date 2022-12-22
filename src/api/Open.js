import { ajax } from "./Api";

export const fetchOpens = ({
  page,
  keyword,
  stats,
  type,
  perPage = 10,
  subType,
} = {}) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: "/funbloc/open",
      params: {
        page,
        keyword: keyword,
        stats: stats,
        type: type,
        perPage: perPage,
        subType,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const fetchOpen = (openId) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: `/funbloc/open/${openId}`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const setOpen = (openId, products) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: `/funbloc/open/${openId}/price`,
      method: "post",
      data: {
        products,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const fetchFunblocTypes = ({ page, perPage = 10 } = {}) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: "/funbloc/open/types/funbloc",
      params: { page, perPage: perPage },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};
