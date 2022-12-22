import { ajax } from "../Api";

export const fetchFamiliarHawkers = ({
  page,
  perPage = 15,
  keyword,
  stats,
  startDate,
  endDate,
} = {}) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: "/familiar-hawker",
      params: {
        page,
        perPage,
        keyword,
        stats,
        startDate,
        endDate,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const editFamiliarHawker = (hawkerId, data) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: `/familiar-hawker/${hawkerId}`,
      method: "put",
      data,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const deleteFamiliarHawker = (hawkerId) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: `/familiar-hawker/${hawkerId}`,
      method: "delete",
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const fetchCommonAddresses = ({
  page,
  perPage = 15,
  keyword,
  stats,
  startDate,
  endDate,
} = {}) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: "/common-address",
      params: {
        page,
        perPage,
        keyword,
        stats,
        startDate,
        endDate,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const createFamiliarHawker = (data) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: `/familiar-hawker`,
      method: "post",
      data,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const createCommonAddresses = (data) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: `/common-address`,
      method: "post",
      data,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const editCommonAddresses = (data) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: `/common-address/${data.id}`,
      method: "put",
      data,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const deleteCommonAddresses = (id) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: `/common-address/${id}`,
      method: "delete",
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};
