import { ajaxManager } from "./Api";

export const fetchProducts = ({
  page,
  keyword,
  stats,
  type,
  perPage = 10,
  supply = "",
  funblocId,
}) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/products`,
      params: {
        page,
        keyword: keyword,
        stats: stats,
        type: type,
        perPage,
        supply,
        funblocId,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const fetchProduct = (productId) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/products/${productId}`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const changeProductStats = (products, stats) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: "/products/stats",
      method: "put",
      data: {
        value: stats.toString(),
        ids: products,
      },
    })
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
};

export const editProduct = (productId, data) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      method: "post",
      url: `/products/${productId}`,
      data: data,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const createProduct = (formData) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      method: "post",
      url: `/products`,
      data: formData,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

// product history
export const fetchProductHistory = (productId) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/products/${productId}/logs`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

// product type
export const fetchProductTypes = ({
  page = 1,
  perPage = 100,
  keyword = "",
  stats = "",
  type = "",
} = {}) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/types/product`,
      params: {
        page,
        perPage,
        keyword,
        stats,
        type,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const fetchProductType = (typeId) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/types/product/${typeId}`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const createProductType = (num, name, subType, note) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: "/types/product",
      method: "post",
      data: {
        num,
        name,
        subType,
        note,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const editProductType = (typeId, num, name,  note) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/types/product/${typeId}`,
      method: "put",
      data: {
        num,
        name,
        note,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const deleteProductType = (typeId) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/types/product/${typeId}`,
      method: "delete",
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const sortProductType = (ids) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: "/types/product/sort",
      method: "put",
      data: ids,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const sortIdProductIdType = (productId,ids) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/types/product/${productId}/sort`,
      method: "put",
      data: ids,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

// product price

export const editProductPrice = (productId, quote, price, pageShow, groups) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      method: "put",
      url: `/products/${productId}/price`,
      data: {
        quote,
        price,
        pageShow,
        groups,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const fetchProductPrice = (productId) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/products/${productId}/price`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const createProductSubType = (productTypeId, subType) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/types/product/${productTypeId}`,
      method: "post",
      data: subType,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const editProductSubType = (subType) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/types/subProduct/${subType.id}`,
      method: "put",
      data: subType,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const deleteProductSubType = (subTypeId) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/types/subProduct/${subTypeId}`,
      method: "delete",
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const changeProducts = ({funblocId, products}) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/funbloc/${funblocId}/products`,
      method: "post",
      data: {
        products
      }
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};
