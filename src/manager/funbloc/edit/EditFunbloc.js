import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";
import BackBtn from "../../components/general/BackBtn";
import {
  CheckButton,
  ContentWrapper,
  NavRouteButton,
  OperateButton,
} from "../../../component/StyledComponent";
import {
  Divider,
  EditTitle,
  FormWrapper,
  Label,
  ProductCol,
  ProductRow,
  ProductTitle,
  ProductWrapper,
  SaveButton,
  StyledInput,
  StyledSelect,
  SubTitle,
} from "./EditFunblocStyle";
import {
  changeFunblocStats,
  editFunbloc,
  fetchFunbloc,
  fetchFunblocHistory,
  fetchFunblocTypes,
  fetchLatestFunblocOrders,
} from "../../../api/funbloc/ManagerFunbloc";
import { funblocConditionType } from "../Funbloc";
import Dialog, {
  CancelledDialog,
  DoneDialog,
} from "../../../component/dialog/Dialog";
import { SingleDatePicker } from "../../../component/datepicker/DatePicker";
import { StyledDate, StyledTextarea } from "../../hawker/new/NewHawkerStyle";
import moment from "moment";
import {
  DialogButton,
  DialogContentWrapper,
  DialogTitle,
} from "../../../component/dialog/DialogStyle";
import {
  changeProducts,
  fetchProducts,
  fetchProductTypes,
} from "../../../api/Product";
import Table from "../../../component/table/Table";
import { Tr } from "../../../component/table/TableStyle";
import {
  HistoryLabelRow,
  PillBadge,
} from "../../product/edit/EditProductStyle";
import { deliveryWays, FunblocPickProduct } from "../new/NewFunbloc";
import Loading from "../../components/loading/Loading";
import { numberWithThousandCommas } from "../../../helper/Helper";
import { fetchCompanies } from "../../../api/Company";
import { StyledFlexBox, StyledImage } from "../../../styles/Shared.styles";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const activateFunbloc = "activateFunbloc";
const inactivateFunbloc = "inactivateFunbloc";
const checkEdit = "edit";
const edited = "edited";
const modalProduct = "product";

const historyBadgeMap = {
  1: {
    bgColor: "bg-secondary",
    text: "新品上架",
  },
  2: {
    bgColor: "bg-info",
    text: "商品暫停",
  },
  3: {
    bgColor: "bg-warning",
    text: "進價異動",
  },
  4: {
    bgColor: "bg-danger",
    text: "售價異動",
  },
};

const funblocStatsMap = {
  0: {
    stats: 0,
    text: "已下架",
    icon: <i className="bi bi-slash-circle" />,
    color: "#FE868E",
    modalStats: "inactivate",
  },
  1: {
    stats: 1,
    text: "上架中",
    icon: <i className="bi bi-check-lg" />,
    color: "#26B7BC",
    modalStats: "activate",
  },
  2: {
    stats: 2,
    text: "垃圾桶",
    icon: <i className="bi bi-trash" />,
    color: "#747474",
    modalStats: "delete",
  },
};

const EditFunbloc = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [shouldOpenModal, setShouldOpenModal] = useState(false);
  const [modal, setModal] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { funblocId } = useParams();
  const [funblocDetail, setFunblocDetail] = useState({});
  const [funblocTypes, setFunblocTypes] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [productTypes, setProductTypes] = useState({});

  const [tempCheckedProducts, setTempCheckedProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [inputKeyword, setInputKeyword] = useState("");

  const [searchProductType, setSearchProductType] = useState("all");
  const [searchSupply, setSearchSupply] = useState("all");

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [stats, setStats] = useState("");
  const [supplies, setSupplies] = useState([]);
  const [subType, setSubType] = useState("-");
  const [conditionType, setConditionType] = useState(0);
  const [conditionNumber, setConditionNumber] = useState(0);
  const [conditionUnit, setConditionUnit] = useState("");
  const [delivery, setDelivery] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [note, setNote] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState([]);

  const [histories, setHistories] = useState([]);
  const [latestOrders, setLatestOrders] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageObject, setPageObject] = useState({});

  const closeModal = () => {
    setModal(null);
    setShouldOpenModal(false);
  };

  const getFunblocDetail = useCallback(() => {
    setIsLoading(true);
    fetchFunbloc(funblocId)
      .then((res) => {
        setFunblocDetail(res.data);
        setName(res.data.name);
        setType(res.data.type);
        setSubType(res.data.subType);
        setConditionType(res.data.condition_type);
        setConditionNumber(res.data.condition_number);
        setConditionUnit(res.data.condition_unit);
        setDelivery(res.data.delivery);
        setDeliveryTime(res.data.delivery_time);
        setNote(res.data.note);
        setStats(res.data.stats);
        setDeliveryInfo(res.data.delivery_info);

        setProducts(() => res.data?.products || []);
        setShowProducts(res.data?.products || []);

        setStartDate(() => {
          return moment(res.data.start_date, "YYYY-MM-DD hh:mm:ss").valueOf();
        });
        setStartTime(() => {
          return moment(res.data.start_date, "YYYY-MM-DD hh:mm:ss").format(
            "HH"
          );
        });
        setEndDate(() => {
          return moment(res.data.end_date, "YYYY-MM-DD hh:mm:ss").valueOf();
        });
        setEndTime(() => {
          return moment(res.data.end_date, "YYYY-MM-DD hh:mm:ss").format("HH");
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [funblocId]);

  const getFunblocHistories = useCallback(() => {
    fetchFunblocHistory(funblocId)
      .then((res) => {
        setHistories(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [funblocId]);

  const getLatestFunblocOrders = useCallback(() => {
    fetchLatestFunblocOrders(funblocId)
      .then((res) => {
        setLatestOrders(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [funblocId]);

  const pickProduct = (product, checked) => {
    if (checked) {
      setProducts((prev) => [...prev, product]);
    } else {
      setProducts((prev) =>
        prev.filter((_product) => _product.id !== product.id)
      );
    }
  };

  const productPicked = async () => {
    setShowProducts([...products]);
    await changeProducts({
      funblocId,
      products: products.map((item) => item.id),
    });
    closeModal();
  };

  const changeStats = (stats) => {
    changeFunblocStats(stats, [funblocId])
      .then(() => {
        getFunblocDetail();

        if (stats === 1) {
          setModal(activateFunbloc);
          setShouldOpenModal(true);
        } else {
          setModal(inactivateFunbloc);
          setShouldOpenModal(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const edit = () => {
    editFunbloc(funblocId, {
      name,
      type,
      subType,
      conditionType,
      conditionNumber,
      conditionUnit,
      delivery,
      deliveryTime,
      startDate: `${moment(startDate).format("YYYY/MM/DD")} ${startTime}:00`,
      endDate: `${moment(endDate).format("YYYY/MM/DD")} ${endTime}:00`,
      note,
      products: products.map((product) => product.id),
      deliveryInfo,
    })
      .then(() => {
        getFunblocDetail();
        setModal(edited);
        setShouldOpenModal(true);
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onProductDelete = async () => {
    const productIds = products
      .filter((item) => item.id !== deleteModalOpen)
      .map((item) => item.id);
    await changeProducts({ products: productIds, funblocId });
    setDeleteModalOpen(false);
    getFunblocDetail();
  };

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const grid = 2;

  const getItemStyle = (draggableStyle, isDragging) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const onDragEnd = async (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      showProducts,
      result.source.index,
      result.destination.index
    );
    setShowProducts(items);
    await changeProducts({
      funblocId,
      products: items.map((item) => item.id),
    });
    getFunblocDetail();
  };

  useEffect(() => {
    getFunblocDetail();
    getFunblocHistories();
    getLatestFunblocOrders();
  }, [getFunblocDetail, getFunblocHistories, getLatestFunblocOrders]);

  useEffect(() => {
    fetchFunblocTypes()
      .then((res) => {
        setFunblocTypes(res.data);
      })
      .catch((error) => {
        console.error(error);
      });

    fetchProductTypes()
      .then((res) => {
        setProductTypes(
          res.data.reduce((prev, current) => {
            return { ...prev, [current.id]: current.name };
          }, {})
        );
      })
      .catch((error) => {
        console.error(error);
      });

    fetchCompanies({ page: 1, perPage: 200 })
      .then((res) => {
        setSupplies(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    fetchProducts({
      page: currentPage,
      keyword,
      perPage: 4,
      type: searchProductType === "all" ? "" : searchProductType,
      supply: searchSupply === "all" ? "" : searchSupply,
      funblocId: funblocId,
    })
      .then((res) => {
        setAvailableProducts(res.data);
        setPageObject(res.meta);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [keyword, searchProductType, searchSupply, currentPage, shouldOpenModal]);

  useEffect(() => {
    if (type && funblocTypes.length > 0) {
      setSubTypes(
        () => funblocTypes.find((_type) => _type.id === type * 1)?.sub || []
      );
    }
  }, [funblocTypes, type]);

  return (
    <div className="container-fluid p-5 text-center">
      <div className="d-flex justify-content-between align-items-center">
        <BackBtn
          text={"回列表"}
          onClickCallback={() => navigate("/manager/funbloc")}
        />
        <div>
          {(funblocDetail.stats === 0 || funblocDetail.stats === 2) && (
            <OperateButton
              className="btn-primary text-white"
              onClick={() => changeStats(1)}
            >
              上架
            </OperateButton>
          )}

          {funblocDetail.stats === 1 && (
            <OperateButton
              className="btn-secondary"
              onClick={() => changeStats(0)}
            >
              下架
            </OperateButton>
          )}
          <SaveButton
            disabled={isLoading}
            onClick={() => {
              setModal(checkEdit);
              setShouldOpenModal(true);
            }}
          >
            儲存
          </SaveButton>
        </div>
      </div>
      <EditTitle>編輯販團</EditTitle>
      <ContentWrapper style={{ paddingTop: "50px", paddingBottom: "45px" }}>
        {deleteModalOpen && (
          <Dialog onClose={() => setDeleteModalOpen(false)}>
            <DialogContentWrapper>
              <DialogTitle className="mb-4"> 確定是否立即刪除？</DialogTitle>
              <div>
                <DialogButton
                  className="btn-secondary cancel"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  取消
                </DialogButton>
                <DialogButton className="btn-danger" onClick={onProductDelete}>
                  確認
                </DialogButton>
              </div>
            </DialogContentWrapper>
          </Dialog>
        )}
        <div className="container-fluid px-0" style={{ position: "relative" }}>
          <StyledFlexBox
            alignItems="center"
            position="absolute"
            top={"-32px"}
            right={32}
            color={funblocStatsMap[stats]?.color}
          >
            {funblocStatsMap[stats]?.icon}
            <StyledFlexBox ml="8px">
              {funblocStatsMap[stats]?.text}
            </StyledFlexBox>
          </StyledFlexBox>
          <div className="row align-items-center w-50 mx-auto mb-3">
            <div className="col-2">
              <Label>販團名稱</Label>
            </div>
            <div className="col">
              <StyledInput
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="row align-items-center w-50 mx-auto mb-3">
            <div className="col-2">
              <Label>主分類</Label>
            </div>
            <div className="col">
              <StyledSelect
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {funblocTypes.map((type) => {
                  return (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  );
                })}
              </StyledSelect>
            </div>
          </div>
          <div className="row align-items-center w-50 mx-auto mb-4">
            <div className="col-2">
              <Label>次分類</Label>
            </div>
            <div className="col">
              <StyledSelect
                value={subType}
                onChange={(e) => setSubType(e.target.value)}
              >
                <option value="-" disabled={true}>
                  請選擇
                </option>
                {subTypes.map((subType) => (
                  <option key={subType.id} value={subType.id}>
                    {subType.name}
                  </option>
                ))}
              </StyledSelect>
            </div>
          </div>
          <Divider />
          <FormWrapper>
            <div className="row align-items-center mb-5">
              <div className="col-1">
                <Label>成團條件</Label>
              </div>
              <div className="col d-flex">
                <StyledSelect
                  className="mx-1 w-25"
                  value={conditionType}
                  onChange={(e) => setConditionType(e.target.value)}
                >
                  {Object.entries(funblocConditionType).map(([key, value]) => {
                    return (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    );
                  })}
                </StyledSelect>
                <StyledInput
                  type="number"
                  className="w-50 mx-1 text-primary"
                  value={conditionNumber}
                  onChange={(e) =>
                    setConditionNumber(e.target.value.replace(/\D/g, ""))
                  }
                />
                <StyledInput
                  type="text"
                  className="mx-1 w-25"
                  value={conditionUnit}
                  onChange={(e) => setConditionUnit(e.target.value)}
                />
              </div>
              <div className="col-1">
                <Label>運送方式</Label>
              </div>
              <div className="col">
                <StyledSelect
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                >
                  {deliveryWays.map((delivery) => (
                    <option key={delivery} value={delivery}>
                      {delivery}
                    </option>
                  ))}
                </StyledSelect>
              </div>
            </div>
            <div className="row align-items-center mb-5">
              <div className="col-1">
                <Label>出貨時間</Label>
              </div>
              <div className="col">
                <StyledInput
                  type="text"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                />
              </div>
            </div>
            <div className="row align-items-center mb-5">
              <div className="col-1">
                <Label>開始時間</Label>
              </div>
              <div className="col d-flex">
                <StyledDate className="w-50" style={{ fontSize: "12px" }}>
                  <i className="bi bi-calendar text-primary" />
                  <SingleDatePicker
                    startDate={startDate}
                    setStartDate={setStartDate}
                  />
                </StyledDate>
                <StyledSelect
                  className="ms-2 w-25"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                >
                  {Array.from(Array(24).keys()).map((hour) => {
                    const _hour = hour.toString().padStart(2, "0");
                    return (
                      <option key={_.uniqueId("start-")} value={_hour}>
                        {_hour}:00
                      </option>
                    );
                  })}
                </StyledSelect>
              </div>
              <div className="col-1">
                <Label>結束時間</Label>
              </div>
              <div className="col d-flex">
                <StyledDate className="w-50" style={{ fontSize: "12px" }}>
                  <i className="bi bi-calendar text-primary" />
                  <SingleDatePicker
                    startDate={endDate}
                    setStartDate={setEndDate}
                  />
                </StyledDate>
                <StyledSelect
                  className="ms-2 w-25"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                >
                  {Array.from(Array(24).keys()).map((hour) => {
                    const _hour = hour.toString().padStart(2, "0");
                    return (
                      <option key={_.uniqueId("end-")} value={_hour}>
                        {_hour}:00
                      </option>
                    );
                  })}
                </StyledSelect>
              </div>
            </div>
            <div className="row align-items-center mb-4">
              <div className="col-1">
                <Label>配送資訊</Label>
              </div>
              <div className="col">
                <StyledInput
                  type="text"
                  value={deliveryInfo}
                  onChange={(e) => setDeliveryInfo(e.target.value)}
                />
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-1">
                <Label>備註</Label>
              </div>
              <div className="col">
                <StyledTextarea
                  type="text"
                  value={note}
                  style={{ height: 80 }}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
          </FormWrapper>
          <Divider />
          <ProductWrapper>
            <NavRouteButton
              className="btn btn-primary rounded-pill d-flex text-white align-items-center ms-auto"
              onClick={() => {
                setModal(modalProduct);
                setShouldOpenModal(true);
              }}
            >
              <svg
                width="15"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.875 7.5H8.5V5.125C8.5 5.05625 8.44375 5 8.375 5H7.625C7.55625 5 7.5 5.05625 7.5 5.125V7.5H5.125C5.05625 7.5 5 7.55625 5 7.625V8.375C5 8.44375 5.05625 8.5 5.125 8.5H7.5V10.875C7.5 10.9437 7.55625 11 7.625 11H8.375C8.44375 11 8.5 10.9437 8.5 10.875V8.5H10.875C10.9437 8.5 11 8.44375 11 8.375V7.625C11 7.55625 10.9437 7.5 10.875 7.5Z"
                  fill="white"
                />
                <path
                  d="M8 1C4.13438 1 1 4.13438 1 8C1 11.8656 4.13438 15 8 15C11.8656 15 15 11.8656 15 8C15 4.13438 11.8656 1 8 1ZM8 13.8125C4.79063 13.8125 2.1875 11.2094 2.1875 8C2.1875 4.79063 4.79063 2.1875 8 2.1875C11.2094 2.1875 13.8125 4.79063 13.8125 8C13.8125 11.2094 11.2094 13.8125 8 13.8125Z"
                  fill="white"
                />
              </svg>
              <div className="ms-2">新增商品</div>
            </NavRouteButton>

            <div className="row mt-5 mb-3 text-primary">
              <ProductTitle className="col-1"></ProductTitle>
              <ProductTitle className="col-2">照片</ProductTitle>
              <ProductTitle className="col-1">廠商名稱</ProductTitle>
              <ProductTitle className="col-2">品名</ProductTitle>
              <ProductTitle className="col-1">類別</ProductTitle>
              <ProductTitle className="col-1">型號/口味</ProductTitle>
              <ProductTitle className="col-1">保存期限</ProductTitle>
              <ProductTitle className="col-1">成本進價</ProductTitle>
              <ProductTitle className="col-1">官方售價</ProductTitle>
              <ProductTitle className="col-1"></ProductTitle>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    // style={getListStyle(snapshot.isDraggingOver)}
                    {...provided.droppableProps}
                  >
                    {showProducts.length > 0 &&
                      showProducts.map((product, index) => {
                        return (
                          <Draggable
                            key={product.id.toString()}
                            draggableId={product.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div>
                                <div
                                  ref={provided.innerRef}
                                  {...provided.dragHandleProps}
                                  {...provided.draggableProps}
                                  style={getItemStyle(
                                    provided.draggableProps.style,
                                    snapshot.isDragging
                                  )}
                                >
                                  <ProductRow key={product.id.toString()}>
                                    <ProductCol className="col-1">
                                      <StyledImage src="/images/manager/menu-hamburger.svg" />
                                    </ProductCol>
                                    <ProductCol className="col-2">
                                      <img
                                        src={product.photo}
                                        className="w-100"
                                        alt=""
                                      />
                                    </ProductCol>
                                    <ProductCol className="col-1">
                                      {product.supply}
                                    </ProductCol>
                                    <ProductCol className="col-2">
                                      {product.name}
                                    </ProductCol>
                                    <ProductCol className="col-1">
                                      {productTypes[product.type]}
                                    </ProductCol>
                                    <ProductCol className="col-1">
                                      {product.model}
                                    </ProductCol>
                                    <ProductCol className="col-1">
                                      {product.expire}
                                    </ProductCol>
                                    <ProductCol className="col-1">
                                      {product.quote}
                                    </ProductCol>
                                    <ProductCol className="col-1">
                                      {product.price}
                                    </ProductCol>
                                    <ProductCol className="col-1">
                                      <StyledImage
                                        src="/images/manager/red_trash.svg"
                                        cursor="pointer"
                                        onClick={() =>
                                          setDeleteModalOpen(product.id)
                                        }
                                      />
                                    </ProductCol>
                                  </ProductRow>
                                </div>
                                {provided.placeholder}
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </ProductWrapper>
        </div>
      </ContentWrapper>

      <SubTitle>
        <span>最新訂單</span>
        <NavRouteButton
          className="btn btn-primary rounded-pill d-flex text-white align-items-center ms-auto"
          onClick={() => navigate("/manager/order")}
        >
          <svg
            width="15"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.875 7.5H8.5V5.125C8.5 5.05625 8.44375 5 8.375 5H7.625C7.55625 5 7.5 5.05625 7.5 5.125V7.5H5.125C5.05625 7.5 5 7.55625 5 7.625V8.375C5 8.44375 5.05625 8.5 5.125 8.5H7.5V10.875C7.5 10.9437 7.55625 11 7.625 11H8.375C8.44375 11 8.5 10.9437 8.5 10.875V8.5H10.875C10.9437 8.5 11 8.44375 11 8.375V7.625C11 7.55625 10.9437 7.5 10.875 7.5Z"
              fill="white"
            />
            <path
              d="M8 1C4.13438 1 1 4.13438 1 8C1 11.8656 4.13438 15 8 15C11.8656 15 15 11.8656 15 8C15 4.13438 11.8656 1 8 1ZM8 13.8125C4.79063 13.8125 2.1875 11.2094 2.1875 8C2.1875 4.79063 4.79063 2.1875 8 2.1875C11.2094 2.1875 13.8125 4.79063 13.8125 8C13.8125 11.2094 11.2094 13.8125 8 13.8125Z"
              fill="white"
            />
          </svg>
          <div className="ms-2">更多訂單</div>
        </NavRouteButton>
      </SubTitle>
      <Table
        ths={[
          "訂單編號",
          "結團日期",
          "小販名稱",
          "狀態",
          "販團名稱",
          "總金額",
          "查看",
        ]}
        theadTrBgColor={" #F5FEFF"}
      >
        {latestOrders.length > 0 ? (
          latestOrders.map((order) => (
            <Tr key={order.id}>
              <td>{order.num}</td>
              <td>{order.checkoutDate}</td>
              <td>{order.hawkerName}</td>
              <td>
                <div>
                  帳務
                  {order.isPaymentDate ? (
                    <i className="bi bi-check-circle-fill ms-1 text-success-light" />
                  ) : (
                    <i className="bi bi-x-circle-fill ms-1 text-danger" />
                  )}
                </div>
                <div>
                  訂單
                  {order.isOrderDate ? (
                    <i className="bi bi-check-circle-fill ms-1 text-success-light" />
                  ) : (
                    <i className="bi bi-x-circle-fill ms-1 text-danger" />
                  )}
                </div>
              </td>
              <td>{order.funblocName}</td>
              <td>{numberWithThousandCommas(order.totalMyPrice)}</td>
              <td>
                <CheckButton
                  className="btn btn-success rounded-pill border-0 px-4"
                  to={`/manager/order/detail/${order.id}`}
                >
                  查看
                </CheckButton>
              </td>
            </Tr>
          ))
        ) : (
          <Tr>
            <td colSpan={7}>{isLoading ? <Loading /> : "無資料"}</td>
          </Tr>
        )}
      </Table>

      <SubTitle>
        <span>販團資訊歷史紀錄</span>
      </SubTitle>
      <ContentWrapper>
        <div className="container-fluid px-5 py-3">
          {histories.map((history) => {
            return (
              <HistoryLabelRow
                key={history.id}
                className="d-flex align-items-center"
              >
                <PillBadge
                  className={`badge rounded-pill ${
                    historyBadgeMap[history.type].bgColor
                  }`}
                >
                  {historyBadgeMap[history.type].text}
                </PillBadge>
                <span>
                  {history.created_at} {history.msg} 由{history.created_name}
                  執行
                </span>
              </HistoryLabelRow>
            );
          })}
        </div>
      </ContentWrapper>

      {modal === modalProduct && shouldOpenModal && (
        <FunblocPickProduct
          closeModal={closeModal}
          availableProducts={availableProducts}
          products={products}
          pickProduct={pickProduct}
          productIdToTypeName={productTypes}
          productPicked={productPicked}
          inputKeyword={inputKeyword}
          setKeyword={setKeyword}
          setInputKeyword={setInputKeyword}
          searchProductType={searchProductType}
          setSearchProductType={setSearchProductType}
          searchSupply={searchSupply}
          setSearchSupply={setSearchSupply}
          supplies={supplies}
          pageObject={pageObject}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      )}

      {modal === activateFunbloc && shouldOpenModal && (
        <DoneDialog closeModal={closeModal} text={"已上架"} />
      )}

      {modal === inactivateFunbloc && shouldOpenModal && (
        <CancelledDialog closeModal={closeModal} text={"已下架"} />
      )}

      {modal === checkEdit && shouldOpenModal && (
        <Dialog onClose={closeModal}>
          <DialogContentWrapper width={488} height={248}>
            <DialogTitle className="mb-5">是否修改此販團資訊？</DialogTitle>
            <div>
              <DialogButton
                className="btn-secondary cancel"
                onClick={closeModal}
              >
                取消
              </DialogButton>
              <DialogButton className="btn-primary" onClick={edit}>
                確認
              </DialogButton>
            </div>
          </DialogContentWrapper>
        </Dialog>
      )}

      {modal === edited && shouldOpenModal && (
        <DoneDialog closeModal={closeModal} text={"已更新資訊"} />
      )}
    </div>
  );
};

export default EditFunbloc;
