import { ajax } from "../Api";

export const fetchFunblocs = ({
  page,
  perPage = 15,
  keyword,
  stats,
  startDate,
  endDate,
} = {}) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: "/funbloc/ing",
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

export const fetchPayStatus = (ingId) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: `/funbloc/ing/${ingId}/pay-status`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const updatePayStatus = ({ ingId, data }) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: `/funbloc/ing/${ingId}/pay-status`,
      method: "PUT",
      data,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const fetchFunbloc = (funblocId) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: `/funbloc/ing/${funblocId}`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const createNewBuyer = (funblocId, data) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: `/funbloc/ing/${funblocId}/order`,
      method: "post",
      data,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const editBuyer = (funblocId, buyerId, data) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: `/funbloc/ing/${funblocId}/order/${buyerId}`,
      method: "put",
      data,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const checkoutFunbloc = ({ funblocId, data }) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: `/funbloc/ing/${funblocId}/checkout`,
      method: "put",
      data,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const cancelFunbloc = ({ funblocId, reason }) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: `/funbloc/ing/${funblocId}/cancel`,
      method: "patch",
      data: {
        reason,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const finishFunbloc = (funblocId) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: `/funbloc/ing/${funblocId}/finish`,
      method: "put",
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const lastFiveNumber = (
  funblocId,
  lastFiveNumber,
  payDate,
  payAmount
) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: `/funbloc/ing/${funblocId}/paid`,
      method: "put",
      data: {
        fiveNumber: lastFiveNumber,
        payDate,
        payAmount,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};
