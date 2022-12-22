import { ajaxManager } from "../Api";

export const fetchOrders = ({
  page,
  perPage = 15,
  stats,
  keyword,
  hawkerId,
  startDate,
  endDate,
} = {}) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: "/order",
      params: {
        page,
        perPage,
        stats,
        keyword,
        hawkerId,
        startDate,
        endDate,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const fetchOrder = (orderId) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/order/${orderId}`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const editOrder = ({ orderId, data }) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/order/${orderId}`,
      method: "patch",
      data,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const finishOrder = (orderId) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/order/${orderId}/finish`,
      method: "put",
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const cancelOrder = (orderId, reason) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/order/${orderId}/cancel`,
      method: "put",
      data: {
        reason,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const confirmPayment = (orderId) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/order/${orderId}/confirm-payment`,
      method: "put",
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const confirmOrder = (orderId) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/order/${orderId}/confirm-order`,
      method: "put",
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const confirmOrderPaid = (orderId) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/order/${orderId}/paid`,
      method: "put",
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const confirmOrderSent = (orderId) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/order/${orderId}/send`,
      method: "put",
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const confirmOrderFInish = (orderId) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/order/${orderId}/finish`,
      method: "put",
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};
