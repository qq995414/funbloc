import { ajaxManager } from "../Api";

export const fetchFunblocs = ({ page, keyword, stats, type, perPage = 10 }) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: "/funbloc",
      params: {
        page,
        keyword: keyword,
        stats: stats,
        type: type,
        perPage: perPage,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const fetchFunbloc = (funblocId) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/funbloc/${funblocId}`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const changeFunblocStats = (stats, ids) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/funbloc/stats`,
      method: "put",
      data: {
        value: stats,
        ids,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const createFunbloc = ({
  name,
  type,
  subType,
  conditionType,
  conditionNumber,
  conditionUnit,
  delivery,
  deliveryTime,
  startDate,
  endDate,
  note,
  products,
}) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/funbloc`,
      method: "post",
      data: {
        name,
        type,
        subType,
        condition_type: conditionType,
        condition_number: conditionNumber,
        condition_unit: conditionUnit,
        delivery,
        delivery_time: deliveryTime,
        start_date: startDate,
        end_date: endDate,
        note,
        products,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const editFunbloc = (
  funblocId,
  {
    name,
    type,
    subType,
    conditionType,
    conditionNumber,
    conditionUnit,
    delivery,
    deliveryTime,
    startDate,
    endDate,
    note,
    products,
    deliveryInfo,
  }
) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/funbloc/${funblocId}`,
      method: "put",
      data: {
        name,
        type,
        subType,
        condition_type: conditionType,
        condition_number: conditionNumber,
        condition_unit: conditionUnit,
        delivery,
        delivery_time: deliveryTime,
        start_date: startDate,
        end_date: endDate,
        note,
        products,
        delivery_info: deliveryInfo,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const fetchFunblocHistory = (
  funblocId,
  { page = 1, perPage = 100, type } = {}
) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/funbloc/${funblocId}/logs`,
      params: {
        page,
        perPage,
        type,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

// funbloc types
export const fetchFunblocTypes = ({
  page = 1,
  perPage = 100,
  keyword = "",
} = {}) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: "/types/funbloc",
      params: {
        page,
        perPage,
        keyword,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const fetchFunblocTypeDetail = (funblocId) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/types/funbloc/${funblocId}`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const createFunblocType = (num, name, note) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: "/types/funbloc",
      method: "post",
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

export const editFunblocType = (subType) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/types/funbloc/${subType.id}`,
      method: "put",
      data: {
        name:subType.name,
        num:subType.num

      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const editSubFunblocType = (subType) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/types/subFunbloc/${subType.id}`,
      method: "put",
      data: {
        name:subType.name,
        num:subType.num
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};


export const deleteFunblocType = (companyId) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/types/funbloc/${companyId}`,
      method: "delete",
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const sortFunblocType = (ids) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: "/types/funbloc/sort",
      method: "put",
      data: ids,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};
export const sortIdFunblocType = (funblocId,ids) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/types/funbloc/${funblocId}/sort`,
      method: "put",
      data: ids,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};
export const fetchLatestFunblocOrders = (funblocId) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/funbloc/${funblocId}/orders`,
      params: {
        stats: 2,
        perPage: 10,
        page: 1,
      },
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};
export const createFunblocSubType = (funblocTypeId, subType) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/types/funbloc/${funblocTypeId}`,
      method: "post",
      data: subType,

    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};
export const deleteFunblocSubType = (subTypeId) => {
  return new Promise((resolve, reject) => {
    ajaxManager({
      url: `/types/subFunbloc/${subTypeId}`,
      method: "delete",
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};
