import React, { useEffect, useState } from "react";
import _ from "lodash";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import {
  ContentWrapper,
  NavRouteButton,
  PaginationWrapper,
} from "../../../component/StyledComponent";
import {
  ActivateButton,
  ClearButton,
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
} from "../edit/EditFunblocStyle";
import { funblocConditionType } from "../Funbloc";
import { ErrorMessage, StyledDate } from "../../hawker/new/NewHawkerStyle";
import { SingleDatePicker } from "../../../component/datepicker/DatePicker";
import BackBtn from "../../components/general/BackBtn";
import {
  changeFunblocStats,
  createFunbloc,
  fetchFunblocTypes,
} from "../../../api/funbloc/ManagerFunbloc";
import Dialog, { DoneDialog } from "../../../component/dialog/Dialog";
import {
  DialogButton,
  DialogContentWrapper,
  DialogTitle,
} from "../../../component/dialog/DialogStyle";
import { fetchProducts, fetchProductTypes } from "../../../api/Product";
import { fetchCompanies } from "../../../api/Company";
import Pagination from "../../components/pagination/Pagination";
import { StyledImage } from "../../../styles/Shared.styles";

const modalProduct = "product";
const modalCreate = "create";
const modalCreated = "created";
const modalCreateAndActivate = "createAndActivate";
const modalCreatedAndActivated = "createdAndActivated";

export const FunblocPickProduct = ({
  closeModal,
  inputKeyword,
  setInputKeyword,
  setKeyword,
  availableProducts,
  products,
  pickProduct,
  productIdToTypeName,
  productPicked,
  searchProductType,
  setSearchProductType,
  searchSupply,
  setSearchSupply,
  supplies,
  pageObject,
  setCurrentPage,
  currentPage,
}) => {
  const productIds = products.map((product) => product.id * 1);

  return (
    <Dialog onClose={closeModal} extend>
      <DialogContentWrapper width={780}>
        <DialogTitle className="text-primary my-3">新增商品</DialogTitle>
        <div className="w-75">
          <StyledInput
            className="w-100 mb-4"
            type="text"
            placeholder={"請搜尋商品/廠商/分類"}
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                setKeyword(inputKeyword);
              }
            }}
          />
          <div className="d-flex justify-content-between mb-3">
            <div>篩選商品</div>
            <div className="d-flex w-50">
              <StyledSelect
                className="mx-2"
                value={searchSupply}
                onChange={(e) => setSearchSupply(e.target.value)}
              >
                <option value="all">所有廠商</option>
                {supplies.map((supply) => {
                  return (
                    <option key={supply.id} value={supply.name}>
                      {supply.name}
                    </option>
                  );
                })}
              </StyledSelect>
              <StyledSelect
                className="mx-2"
                value={searchProductType}
                onChange={(e) => setSearchProductType(e.target.value)}
              >
                <option value="all">所有分類</option>
                {Object.entries(productIdToTypeName).map(([key, value]) => {
                  return (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  );
                })}
              </StyledSelect>
            </div>
          </div>

          {availableProducts.map((product) => {
            return (
              <ProductRow key={product.id}>
                <ProductCol>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={productIds.includes(product.id * 1)}
                    onChange={(e) => pickProduct(product, e.target.checked)}
                  />
                </ProductCol>
                <ProductCol className="col-3">
                  <img
                    src={product.photo}
                    alt="product photo"
                    className="w-100"
                  />
                </ProductCol>
                <ProductCol>{product.num}</ProductCol>
                <ProductCol>{product.name}</ProductCol>
                <ProductCol>{productIdToTypeName[product.type]}</ProductCol>
                <ProductCol>{product.model}</ProductCol>
              </ProductRow>
            );
          })}
          <PaginationWrapper>
            <Pagination
              pageObject={pageObject}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </PaginationWrapper>
        </div>
        <div className="p-3">
          <DialogButton className="btn-primary" onClick={productPicked}>
            新增
          </DialogButton>
        </div>
      </DialogContentWrapper>
    </Dialog>
  );
};

const initErrorMessage = () => ({
  name: "",
  type: "",
  subType: "",
  conditionNumber: "",
  conditionUnit: "",
  deliveryTime: "",
  note: "",
  products: "",
});

export const deliveryWays = [
  "常溫宅配",
  "低溫冷藏宅配",
  "冷凍宅配",
  "便利商店店到店",
];

const NewFunbloc = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [shouldOpenModal, setShouldOpenModal] = useState(false);
  const [modal, setModal] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState("-");
  const [subType, setSubType] = useState("-");
  const [conditionType, setConditionType] = useState(0);
  const [conditionNumber, setConditionNumber] = useState(0);
  const [conditionUnit, setConditionUnit] = useState("");
  const [delivery, setDelivery] = useState("一般宅配");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [note, setNote] = useState("");
  const [startDate, setStartDate] = useState(moment().valueOf());
  const [startTime, setStartTime] = useState("00:00");
  const [endDate, setEndDate] = useState(moment().valueOf());
  const [endTime, setEndTime] = useState("00:00");
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [subTypes, setSubTypes] = useState([]);

  const [availableProducts, setAvailableProducts] = useState([]);
  const [productIdToTypeName, setProductIdToTypeName] = useState({});
  const [keyword, setKeyword] = useState("");
  const [inputKeyword, setInputKeyword] = useState("");

  const [searchProductType, setSearchProductType] = useState("all");
  const [searchSupply, setSearchSupply] = useState("all");

  const [showProducts, setShowProducts] = useState([]);

  const [errorMessages, setErrorMessages] = useState(initErrorMessage());

  const [currentPage, setCurrentPage] = useState(1);
  const [pageObject, setPageObject] = useState({});

  const closeModal = () => {
    setModal(null);
    setShouldOpenModal(false);
    setKeyword("");
    setInputKeyword("");
  };

  const canProceed = () => {
    let flag = true;
    let text = "此欄位必填";

    if (name === "") {
      flag = false;
      setErrorMessages((prev) => ({ ...prev, name: text }));
    }
    if (type === "-") {
      flag = false;
      setErrorMessages((prev) => ({ ...prev, type: text }));
    }
    if (conditionNumber === 0) {
      flag = false;
      setErrorMessages((prev) => ({ ...prev, conditionNumber: text }));
    }
    if (conditionUnit === "") {
      flag = false;
      setErrorMessages((prev) => ({ ...prev, conditionUnit: text }));
    }
    if (deliveryTime === "") {
      flag = false;
      setErrorMessages((prev) => ({ ...prev, deliveryTime: text }));
    }
    if (products.length === 0) {
      flag = false;
      setErrorMessages((prev) => ({ ...prev, products: "請選擇產品" }));
    }

    if (isLoading) {
      flag = false;
    }

    return flag;
  };

  const reset = () => {
    setName("");
    setConditionType(0);
    setConditionNumber(0);
    setConditionUnit("");
    setDelivery("一般宅配");
    setDeliveryTime("");
    setNote("");
    setStartDate(moment().valueOf());
    setStartTime("00:00");
    setEndDate(moment().valueOf());
    setEndTime("00:00");
    setProducts([]);
    setShowProducts([]);
  };

  const pickProduct = (product, checked) => {
    if (checked) {
      setProducts((prev) => [...prev, product]);
    } else {
      setProducts((prev) =>
        prev.filter((_product) => _product.id !== product.id)
      );
    }
  };

  const productPicked = () => {
    setShowProducts([...products]);
    closeModal();
  };

  const create = () => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      createFunbloc({
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
      })
        .then((res) => {
          setIsLoading(false);
          resolve(res.data);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
          reject(error);
        });
    });
  };

  const createAndActivate = async () => {
    try {
      const { id } = await create();
      await changeFunblocStats(1, [id]);
      setModal(modalCreatedAndActivated);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const onProductDelete = async () => {
    const selectedProduct = products.filter(
      (item) => item.id !== deleteModalOpen
    );
    setShowProducts(selectedProduct);
    setProducts(selectedProduct);
    setDeleteModalOpen(false);
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
    setProducts(items);
  };

  useEffect(() => {
    if (type !== "-") {
      setSubTypes(() => types.find((_type) => _type.id === type * 1).sub);
    }
  }, [types, type]);

  useEffect(() => {
    if (subTypes.length === 0) {
      setSubType("-");
    }
  }, [subTypes]);

  useEffect(() => {
    fetchProductTypes()
      .then((res) => {
        setProductIdToTypeName(
          res.data.reduce((prev, current) => {
            return { ...prev, [current.id]: current.name };
          }, {})
        );
      })
      .catch((error) => {
        console.error(error);
      });

    fetchFunblocTypes({})
      .then((res) => {
        setTypes(res.data);
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
    })
      .then((res) => {
        setAvailableProducts(res.data);
        setPageObject(res.meta);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [keyword, searchProductType, searchSupply, currentPage, shouldOpenModal]);

  return (
    <div className="container-fluid p-5 text-center">
      <div className="d-flex justify-content-between align-items-center">
        <BackBtn
          text={"回列表"}
          onClickCallback={() => navigate("/manager/funbloc")}
        />
      </div>
      <EditTitle>新增販團</EditTitle>

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
        <div className="container-fluid px-0">
          <div className="row align-items-center w-50 mx-auto mb-3">
            <div className="col-2">
              <Label>販團名稱</Label>
            </div>
            <div className="col">
              <StyledInput
                type="text"
                error={errorMessages.name}
                value={name}
                onChange={(e) => {
                  setErrorMessages(initErrorMessage());
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="col-2">
              <ErrorMessage>{errorMessages.name}</ErrorMessage>
            </div>
          </div>
          <div className="row align-items-center w-50 mx-auto mb-3">
            <div className="col-2">
              <Label>主分類</Label>
            </div>
            <div className="col">
              <StyledSelect
                value={type}
                error={errorMessages.type}
                onChange={(e) => {
                  setErrorMessages(initErrorMessage());
                  setType(e.target.value);
                }}
              >
                <option value="-" disabled={true}>
                  請選擇
                </option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </StyledSelect>
            </div>
            <div className="col-2">
              <ErrorMessage>{errorMessages.type}</ErrorMessage>
            </div>
          </div>
          <div className="row align-items-center w-50 mx-auto mb-4">
            <div className="col-2">
              <Label>次分類</Label>
            </div>
            <div className="col-8">
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
                  error={errorMessages.conditionNumber}
                  value={conditionNumber}
                  onChange={(e) => {
                    setErrorMessages(initErrorMessage());
                    setConditionNumber(e.target.value.replace(/\D/g, ""));
                  }}
                />
                <StyledInput
                  type="text"
                  className="mx-1 w-25"
                  error={errorMessages.conditionUnit}
                  value={conditionUnit}
                  onChange={(e) => {
                    setErrorMessages(initErrorMessage());
                    setConditionUnit(e.target.value);
                  }}
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
                  error={errorMessages.deliveryTime}
                  value={deliveryTime}
                  onChange={(e) => {
                    setErrorMessages(initErrorMessage());
                    setDeliveryTime(e.target.value);
                  }}
                />
              </div>
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
            <div className="row align-items-center">
              <div className="col-1">
                <Label>備註</Label>
              </div>
              <div className="col">
                <StyledInput
                  type="text"
                  error={errorMessages.note}
                  value={note}
                  onChange={(e) => {
                    setErrorMessages(initErrorMessage());
                    setNote(e.target.value);
                  }}
                />
              </div>
            </div>
          </FormWrapper>
          <Divider />
          <ProductWrapper>
            <div className="d-flex align-items-center">
              <ErrorMessage className="ms-auto">
                {errorMessages.products}
              </ErrorMessage>
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
            </div>

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
                                      {productIdToTypeName[product.type]}
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
          <ClearButton disabled={isLoading} onClick={reset}>
            清除資訊
          </ClearButton>
          <ActivateButton
            disabled={isLoading}
            onClick={() => {
              if (!canProceed()) return;

              setModal(modalCreateAndActivate);
              setShouldOpenModal(true);
            }}
          >
            立即上架
          </ActivateButton>

          <SaveButton
            disabled={isLoading}
            onClick={() => {
              if (!canProceed()) return;

              setModal(modalCreate);
              setShouldOpenModal(true);
            }}
          >
            建立商品
          </SaveButton>
        </div>
      </ContentWrapper>

      {modal === modalProduct && shouldOpenModal && (
        <FunblocPickProduct
          closeModal={closeModal}
          availableProducts={availableProducts}
          products={products}
          pickProduct={pickProduct}
          productIdToTypeName={productIdToTypeName}
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

      {modal === modalCreate && shouldOpenModal && (
        <Dialog onClose={closeModal}>
          <DialogContentWrapper width={488} height={248}>
            <DialogTitle className="mb-5">是否建立商品？</DialogTitle>
            <div>
              <DialogButton
                className="btn-secondary cancel"
                onClick={closeModal}
              >
                取消
              </DialogButton>
              <DialogButton
                className="btn-primary"
                onClick={async () => {
                  await create();
                  setModal(modalCreated);
                }}
              >
                確認
              </DialogButton>
            </div>
          </DialogContentWrapper>
        </Dialog>
      )}

      {modal === modalCreated && shouldOpenModal && (
        <DoneDialog
          closeModal={() => {
            closeModal();
            navigate("/manager/funbloc");
          }}
          text={"已建立商品"}
        />
      )}

      {modal === modalCreateAndActivate && shouldOpenModal && (
        <Dialog onClose={closeModal}>
          <DialogContentWrapper width={488} height={248}>
            <DialogTitle className="mb-5">是否建立並上架商品？</DialogTitle>
            <div>
              <DialogButton
                className="btn-secondary cancel"
                onClick={closeModal}
              >
                取消
              </DialogButton>
              <DialogButton className="btn-primary" onClick={createAndActivate}>
                確認
              </DialogButton>
            </div>
          </DialogContentWrapper>
        </Dialog>
      )}

      {modal === modalCreatedAndActivated && shouldOpenModal && (
        <DoneDialog
          closeModal={() => {
            closeModal();
            navigate("/manager/funbloc");
          }}
          text={"已上架商品"}
        />
      )}
    </div>
  );
};

export default NewFunbloc;
