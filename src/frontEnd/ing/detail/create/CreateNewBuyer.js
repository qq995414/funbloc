import React, { useCallback, useEffect, useState } from "react";
import { createNewBuyer } from "../../../../api/funbloc/Funbloc";
import {
  DashedButton,
  NewBuyerWrapper,
  ReceiveInput,
  StyledInput,
} from "../FublocDetailStyle";
import Table from "../../../../component/table/Table";
import { Tr } from "../../../../component/table/TableStyle";
import { numberWithThousandCommas } from "../../../../helper/Helper";
import { StyledTextarea } from "../../../../manager/hawker/new/NewHawkerStyle";
import { Offcanvas } from "react-bootstrap";
import {
  OffsetCanvasCard,
  OffsetCanvasCreateCard,
} from "../../../../manager/home/HomeStyle";
import {
  createCommonAddresses,
  createFamiliarHawker,
  deleteCommonAddresses,
  editCommonAddresses,
  fetchCommonAddresses,
  fetchFamiliarHawkers,
  editFamiliarHawker as updateFamiliarHawker,
  deleteFamiliarHawker,
} from "../../../../api/hawker/Hawker";
import { fetchMe } from "../../../../api/admin/Admin";
import { PAY_STATUS, PAYMENT } from "../edit/EditBuyer";
import { StyledFlexBox, StyledImage } from "../../../../styles/Shared.styles";
import { DialogButton } from "../../../../component/dialog/DialogStyle";

const SubViewBuyerLayout = ({
  funblocId,
  products,
  onBuyerCreated,
  cancelEdit,
}) => {
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [orderAddress, setOrderAddress] = useState("");

  const [receiverName, setReceiverName] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [note, setNote] = useState("");

  const [payType, setPayType] = useState("ATM匯款");
  const [payStatus, setPayStatus] = useState("未匯款");

  const [familiarHawkers, setFamiliarHawkers] = useState([]);
  const [isEditFamiliarHawker, setIsEditFamiliarHawker] = useState(false);
  const [editFamiliarHawkerId, setEditFamiliarHawkerId] = useState("");
  const [editFamiliarHawkerName, setEditFamiliarHawkerName] = useState("");
  const [editFamiliarHawkerPhone, setEditFamiliarHawkerPhone] = useState("");
  const [editFamiliarHawkerAddress, setEditFamiliarHawkerAddress] =
    useState("");

  const [commonAddresses, setCommonAddresses] = useState([]);
  const [isEditCommonAddresses, setIsEditCommonAddresses] = useState(false);
  const [editCommonAddressesName, setEditCommonAddressesName] = useState("");
  const [editCommonAddressesPhone, setEditCommonAddressesPhone] = useState("");
  const [editCommonAddressesAddress, setEditCommonAddressesAddress] =
    useState("");

  const [productIdsAndAmounts, setProductIdsAndAmounts] = useState(
    products.map((product) => ({
      ...product,
      amount: 0,
    }))
  );

  const [showFamiliarHawker, setShowFamiliarHawker] = useState(false);
  const [showFamiliarAddress, setShowFamiliarAddress] = useState(false);

  const [editFamiliarHawker, setEditFamiliarHawker] = useState(false);
  const [deleteFamiliarHawkerModal, deleteFamiliarHawkerModalOpen] =
    useState(false);

  const [me, setMe] = useState({});

  const hideFamiliarHawkerOffsetCanvas = () => {
    setShowFamiliarHawker(false);
    setIsEditFamiliarHawker(false);
    setEditFamiliarHawkerName("");
    setEditFamiliarHawkerPhone("");
    setEditFamiliarHawkerAddress("");
  };
  const showFamiliarHawkerOffsetCanvas = () => setShowFamiliarHawker(true);

  const hideFamiliarAddressOffsetCanvas = () => {
    setShowFamiliarAddress(false);
    setIsEditCommonAddresses(false);
    setEditCommonAddressesName("");
    setEditCommonAddressesPhone("");
    setEditCommonAddressesAddress("");
  };
  const showFamiliarAddressOffsetCanvas = () => setShowFamiliarAddress(true);

  const getFamiliarHawkers = useCallback(() => {
    fetchFamiliarHawkers({ page: 1, perPage: 1000 })
      .then((res) => {
        setFamiliarHawkers(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const getCommonAddress = useCallback(() => {
    fetchCommonAddresses({ page: 1, perPage: 1000 })
      .then((res) => {
        setCommonAddresses(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const create = () => {
    createNewBuyer(funblocId, {
      orderName,
      orderPhone,
      orderAddress,
      receiverName,
      receiverPhone,
      receiverAddress,
      note,
      payType,
      payStatus,
      products: productIdsAndAmounts.map((product) => ({
        id: product.id,
        amount: product.amount,
      })),
    })
      .then(() => {
        onBuyerCreated();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const newFamiliarHawker = () => {
    createFamiliarHawker({
      name: editFamiliarHawkerName,
      phone: editFamiliarHawkerPhone,
      address: editFamiliarHawkerAddress,
    })
      .then(() => {
        getFamiliarHawkers();
        setIsEditFamiliarHawker(false);
        setEditFamiliarHawkerName("");
        setEditFamiliarHawkerPhone("");
        setEditFamiliarHawkerAddress("");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const newCommonAddresses = () => {
    createCommonAddresses({
      name: editCommonAddressesName,
      phone: editCommonAddressesPhone,
      address: editCommonAddressesAddress,
    })
      .then(() => {
        getCommonAddress();
        setIsEditCommonAddresses(false);
        setEditCommonAddressesName("");
        setEditCommonAddressesPhone("");
        setEditCommonAddressesAddress("");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const [openModal, setOpenModal] = useState(null);
  const [editCommonInfo, setEditCommonInfo] = useState({});

  const onModalClose = () => setOpenModal(null);

  const onEditFamiliarHawker = ({ id, name, phone, address }) => {
    updateFamiliarHawker(id, {
      name,
      phone,
      address,
    })
      .then(() => {
        getFamiliarHawkers();
        setIsEditFamiliarHawker(false);
        setEditFamiliarHawkerId("");
        setEditFamiliarHawkerName("");
        setEditFamiliarHawkerPhone("");
        setEditFamiliarHawkerAddress("");
        setEditFamiliarHawker(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getFamiliarHawkers();
    getCommonAddress();

    fetchMe()
      .then((res) => {
        console.log(res.data);
        setMe(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [getFamiliarHawkers, getCommonAddress]);

  return (
    <>
      <NewBuyerWrapper>
        <StyledFlexBox
          width={30}
          height={30}
          borderRadius="50%"
          bg="#40bec2"
          justifyContent="center"
          alignItems="center"
          cursor="pointer"
          mb={[12, 0]}
          onClick={cancelEdit}
        >
          <StyledImage
            src="/images/front-end/icon_arrow_left.svg"
            height={14}
          />
        </StyledFlexBox>
        <div className="d-flex justify-content-center mb-3 position-relative">
          <div className="title text-primary">訂購人</div>
        </div>
        <StyledFlexBox p={0} width="100%">
          <StyledFlexBox
            className="new-order border border-primary"
            width="100%"
            justifyContent="space-between"
            alignItems={["center", "initial", "center"]}
            flexDirection={["column", "row"]}
          >
            <StyledFlexBox
              mb={[20, 0]}
              justifyContent="center"
              width={123}
              height={24}
              alignItems="center"
            >
              <button
                className="btn btn-outline-primary rounded-pill bg-white"
                style={{ fontSize: "12px", width: 123, height: 24, padding: 0 }}
                onClick={showFamiliarHawkerOffsetCanvas}
              >
                帶入熟販友
              </button>
            </StyledFlexBox>
            <StyledFlexBox
              flexDirection={["column", "column", "row"]}
              width={["100%", "80%"]}
              justifyContent="space-around"
            >
              <StyledFlexBox
                mb={[12, 24, 0]}
                flexDirection={["column", "row"]}
                alignItems={["initial", "center"]}
                width={["100%"]}
                justifyContent={["initial", "space-evenly"]}
              >
                <div className="label text-primary">姓名</div>
                <StyledInput
                  width={["100%", "80%"]}
                  ml={[0, 0, 15]}
                  type="text"
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                />
              </StyledFlexBox>
              <StyledFlexBox
                mb={[12, 24, 0]}
                flexDirection={["column", "row"]}
                alignItems={["initial", "center"]}
                width={["100%"]}
                justifyContent={["initial", "space-evenly"]}
              >
                <div className="label text-primary">電話</div>
                <StyledInput
                  width={["100%", "80%"]}
                  ml={[0, 0, 15]}
                  type="text"
                  value={orderPhone}
                  onChange={(e) =>
                    setOrderPhone(e.target.value.replace(/\D+/g, ""))
                  }
                />
              </StyledFlexBox>
              <StyledFlexBox
                flexDirection={["column", "row"]}
                alignItems={["initial", "center"]}
                width={["100%"]}
                justifyContent={["initial", "space-evenly"]}
              >
                <div className="label text-primary">地址</div>
                <StyledInput
                  width={["100%", "80%"]}
                  ml={[0, 0, 15]}
                  type="text"
                  value={orderAddress}
                  onChange={(e) => setOrderAddress(e.target.value)}
                />
              </StyledFlexBox>
            </StyledFlexBox>
          </StyledFlexBox>
        </StyledFlexBox>

        <div className="d-flex justify-content-center my-4">
          <div className="title text-primary">商品資訊</div>
        </div>
        <Table
          ths={[
            "商品名稱",
            "數量",
            "進價",
            "我的售價",
            "官方售價",
            "進價總額",
            "我的售價總額",
          ]}
        >
          {productIdsAndAmounts
            .filter((product) => product.myPrice !== 0)
            .map((product) => {
              return (
                <Tr key={product.id}>
                  <td>{product.name}</td>
                  <td style={{ width: "8%", fontSize: "12px" }}>
                    <StyledInput
                      type="text w-100"
                      disabled={product.myPrice === 0}
                      value={product.amount}
                      onChange={(e) => {
                        setProductIdsAndAmounts((prev) =>
                          prev.map((_product) => {
                            if (_product.id === product.id) {
                              return {
                                ...product,
                                amount: e.target.value.replace(/\D+/g, ""),
                              };
                            }
                            return _product;
                          })
                        );
                      }}
                    />
                  </td>
                  <td>{numberWithThousandCommas(product.quote)}</td>
                  <td>{numberWithThousandCommas(product.myPrice)}</td>
                  <td>{numberWithThousandCommas(product.price)}</td>
                  <td>
                    {numberWithThousandCommas(product.amount * product.quote)}
                  </td>
                  <td>
                    {numberWithThousandCommas(product.amount * product.myPrice)}
                  </td>
                </Tr>
              );
            })}
        </Table>

        <div className="d-flex justify-content-center my-4">
          <div className="title text-primary">送貨資訊</div>
        </div>
        <div className="new-order border border-primary">
          <StyledFlexBox className="mb-2" display={["none", "flex"]}>
            <button
              className="btn btn-outline-primary bg-white rounded-pill px-3  me-2"
              onClick={() => {
                setReceiverName(orderName);
                setReceiverPhone(orderPhone);
                setReceiverAddress(orderAddress);
              }}
            >
              同購買人
            </button>
            <button
              className="btn btn-outline-primary bg-white rounded-pill px-3 me-2"
              onClick={() => {
                setReceiverName(me.name);
                setReceiverPhone(me.phone);
                setReceiverAddress(me.address);
              }}
            >
              預設地址
            </button>
            <button
              className="btn btn-outline-primary bg-white rounded-pill px-3"
              onClick={showFamiliarAddressOffsetCanvas}
            >
              帶入常用地址
            </button>
          </StyledFlexBox>
          <StyledFlexBox
            className="py-1 pe-3"
            flexDirection={["column", "row"]}
            alignItems={["initial", "center"]}
          >
            <StyledFlexBox className="text-primary" width={68} mr={18}>
              收貨人姓名
            </StyledFlexBox>
            <div className="col">
              <ReceiveInput
                type="text"
                width={["100%", "unset"]}
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
              />
            </div>
          </StyledFlexBox>
          <StyledFlexBox
            className="py-1 pe-3"
            flexDirection={["column", "row"]}
            alignItems={["initial", "center"]}
          >
            <StyledFlexBox className="text-primary" width={68} mr={18}>
              收貨人地址
            </StyledFlexBox>
            <div className="col">
              <ReceiveInput
                type="text"
                width={["100%", "unset"]}
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
              />
            </div>
          </StyledFlexBox>
          <StyledFlexBox
            className="py-1 pe-3"
            flexDirection={["column", "row"]}
            alignItems={["initial", "center"]}
          >
            <StyledFlexBox
              className="text-primary"
              width={68}
              mr={18}
              textAlign={["start", "end", "end"]}
            >
              收貨人電話
            </StyledFlexBox>
            <div className="col">
              <ReceiveInput
                type="text"
                width={["100%", "unset"]}
                value={receiverPhone}
                onChange={(e) =>
                  setReceiverPhone(e.target.value.replace(/\D+/g, ""))
                }
              />
            </div>
          </StyledFlexBox>
          <StyledFlexBox
            className="py-1 pe-3 align-items-start"
            flexDirection={["column", "row"]}
            alignItems={["initial", "center"]}
          >
            <StyledFlexBox
              className="text-primary"
              textAlign={["start", "end", "end"]}
              width={68}
              mr={18}
              justifyContent={["initial", "flex-end"]}
            >
              備註
            </StyledFlexBox>
            <StyledFlexBox className="col" width={["100%", "unset"]}>
              <StyledTextarea
                rows={8}
                width={["100%", "unset"]}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </StyledFlexBox>
          </StyledFlexBox>
        </div>
        <div className="d-flex justify-content-center align-items-center mt-5">
          <div className="d-flex align-items-center mx-2 w-25">
            <div className="label text-primary me-1 w-25">付款方式：</div>
            <select
              className="form-select border-primary w-75"
              value={payType}
              onChange={(e) => setPayType(e.target.value)}
            >
              <option value={PAYMENT.atm.value}>{PAYMENT.atm.value}</option>
              <option value={PAYMENT.cash.value}>{PAYMENT.cash.value}</option>
            </select>
          </div>
          <div className="d-flex align-items-center mx-2 w-25">
            <div className="label text-primary me-1 w-25">匯款狀態：</div>
            <select
              className="form-select border-primary w-75"
              value={payStatus}
              onChange={(e) => setPayStatus(e.target.value)}
            >
              <option
                value={
                  payType === PAYMENT.atm.value
                    ? PAYMENT.atm.unpaid
                    : PAYMENT.cash.unpaid
                }
              >
                {payType === PAYMENT.atm.value
                  ? PAYMENT.atm.unpaid
                  : PAYMENT.cash.unpaid}
              </option>
              <option
                value={
                  payType === PAYMENT.atm.value
                    ? PAYMENT.atm.paid
                    : PAYMENT.cash.paid
                }
              >
                {payType === PAYMENT.atm.value
                  ? PAYMENT.atm.paid
                  : PAYMENT.cash.paid}
              </option>
            </select>
          </div>
        </div>
        <div className="text-center mt-5">
          <button
            className="btn btn-primary text-white save-btn"
            onClick={create}
          >
            儲存
          </button>
        </div>
      </NewBuyerWrapper>

      <Offcanvas
        show={showFamiliarHawker}
        onHide={hideFamiliarHawkerOffsetCanvas}
        placement="end"
      >
        <Offcanvas.Body className="py-5 px-4">
          <div className="position-relative mb-3">
            <div className="text-center text-primary">選擇熟販友</div>
          </div>
          <div>
            {familiarHawkers.map((hawker) => {
              return (
                <div className="d-flex align-items-center mb-3" key={hawker.id}>
                  <OffsetCanvasCard
                    className="w-100 ms-0"
                    onClick={() => {
                      setOrderName(hawker.name);
                      setOrderPhone(hawker.phone);
                      setOrderAddress(hawker.address);
                      hideFamiliarHawkerOffsetCanvas();
                    }}
                  >
                    <div className="name">
                      {hawker.name}
                      <span>{hawker.num}</span>
                    </div>
                    <StyledFlexBox position="absolute" top={25} right={25}>
                      <StyledImage
                        src="/images/front-end/address_delete.svg"
                        width={20}
                        height={20}
                        cursor="pointer"
                        mr={16}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFamiliarHawkerModalOpen(true);
                          setEditFamiliarHawkerId(hawker.id);
                        }}
                      />
                      <StyledImage
                        src="/images/front-end/address_edit.svg"
                        width={20}
                        height={20}
                        cursor="pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditFamiliarHawkerId(hawker.id);
                          setEditFamiliarHawkerName(hawker.name);
                          setEditFamiliarHawkerPhone(hawker.phone);
                          setEditFamiliarHawkerAddress(hawker.address);
                          setEditFamiliarHawker(true);
                        }}
                      />
                    </StyledFlexBox>
                    <div className="name">{hawker.phone}</div>
                    <div className="address">{hawker.address}</div>
                  </OffsetCanvasCard>
                </div>
              );
            })}
          </div>
          {deleteFamiliarHawkerModal && (
            <StyledFlexBox
              position="fixed"
              width={400}
              right={0}
              top={0}
              height="100%"
              bg="white"
              pt={40}
              zIndex={3}
              flexDirection="column"
              alignItems="center"
              px={20}
            >
              <StyledFlexBox mb={30} fontSize={18}>
                確定是否立即刪除？
              </StyledFlexBox>
              <StyledFlexBox>
                <DialogButton
                  className="btn-secondary cancel"
                  onClick={() => deleteFamiliarHawkerModalOpen(false)}
                >
                  取消
                </DialogButton>
                <DialogButton
                  className="btn-danger"
                  onClick={async () => {
                    await deleteFamiliarHawker(editFamiliarHawkerId);
                    getFamiliarHawkers();
                    deleteFamiliarHawkerModalOpen(false);
                  }}
                >
                  確認
                </DialogButton>
              </StyledFlexBox>
            </StyledFlexBox>
          )}
          {editFamiliarHawker && (
            <StyledFlexBox
              position="fixed"
              width={400}
              right={0}
              top={0}
              height="100%"
              bg="white"
              pt={40}
              zIndex={3}
              flexDirection="column"
              alignItems="center"
              px={20}
            >
              <OffsetCanvasCreateCard>
                <div className="row align-items-center mb-2">
                  <div className="col-3 text-primary">姓名</div>
                  <div className="col">
                    <StyledInput
                      className="mx-0 w-100"
                      value={editFamiliarHawkerName}
                      onChange={(e) =>
                        setEditFamiliarHawkerName(e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="row align-items-center mb-2">
                  <div className="col-3 text-primary">電話</div>
                  <div className="col">
                    <StyledInput
                      className="mx-0 w-100"
                      value={editFamiliarHawkerPhone}
                      onChange={(e) =>
                        setEditFamiliarHawkerPhone(
                          e.target.value.replace(/\D+/g, "")
                        )
                      }
                    />
                  </div>
                </div>
                <div className="row align-items-center mb-2">
                  <div className="col-3 text-primary">地址</div>
                  <div className="col">
                    <StyledInput
                      className="mx-0 w-100"
                      value={editFamiliarHawkerAddress}
                      onChange={(e) =>
                        setEditFamiliarHawkerAddress(e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-primary text-white px-5"
                    onClick={() => {
                      if (!editFamiliarHawkerName) {
                        alert("請填入姓名");
                        return;
                      }
                      if (!editFamiliarHawkerPhone) {
                        alert("請填入電話");
                        return;
                      }
                      if (!editFamiliarHawkerAddress) {
                        alert("請填入地址");
                        return;
                      }
                      onEditFamiliarHawker({
                        id: editFamiliarHawkerId,
                        name: editFamiliarHawkerName,
                        phone: editFamiliarHawkerPhone,
                        address: editFamiliarHawkerAddress,
                      });
                    }}
                  >
                    儲存
                  </button>
                  <DialogButton
                    className="btn-secondary cancel"
                    onClick={() => setEditFamiliarHawker(false)}
                  >
                    取消
                  </DialogButton>
                </div>
              </OffsetCanvasCreateCard>
            </StyledFlexBox>
          )}
          {!isEditFamiliarHawker ? (
            <DashedButton onClick={() => setIsEditFamiliarHawker(true)}>
              <i className="bi bi-plus" />
            </DashedButton>
          ) : (
            <div>
              <OffsetCanvasCreateCard>
                <div className="row align-items-center mb-2">
                  <div className="col-3 text-primary">姓名</div>
                  <div className="col">
                    <StyledInput
                      className="mx-0 w-100"
                      value={editFamiliarHawkerName}
                      onChange={(e) =>
                        setEditFamiliarHawkerName(e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="row align-items-center mb-2">
                  <div className="col-3 text-primary">電話</div>
                  <div className="col">
                    <StyledInput
                      className="mx-0 w-100"
                      value={editFamiliarHawkerPhone}
                      onChange={(e) =>
                        setEditFamiliarHawkerPhone(
                          e.target.value.replace(/\D+/g, "")
                        )
                      }
                    />
                  </div>
                </div>
                <div className="row align-items-center mb-2">
                  <div className="col-3 text-primary">地址</div>
                  <div className="col">
                    <StyledInput
                      className="mx-0 w-100"
                      value={editFamiliarHawkerAddress}
                      onChange={(e) =>
                        setEditFamiliarHawkerAddress(e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-primary text-white px-5"
                    onClick={() => {
                      if (!editFamiliarHawkerName) {
                        alert("請填入姓名");
                        return;
                      }
                      if (!editFamiliarHawkerPhone) {
                        alert("請填入電話");
                        return;
                      }
                      if (!editFamiliarHawkerAddress) {
                        alert("請填入地址");
                        return;
                      }

                      newFamiliarHawker();
                    }}
                  >
                    儲存
                  </button>
                </div>
              </OffsetCanvasCreateCard>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas
        show={showFamiliarAddress}
        onHide={hideFamiliarAddressOffsetCanvas}
        placement="end"
      >
        <Offcanvas.Body className="py-5 px-4">
          {openModal === "edit" && (
            <StyledFlexBox
              position="fixed"
              width={400}
              right={0}
              top={0}
              height="100%"
              bg="white"
              pt={40}
              zIndex={3}
              flexDirection="column"
              alignItems="center"
              px={20}
            >
              <OffsetCanvasCreateCard>
                <div className="row align-items-center mb-2">
                  <div className="col-3 text-primary">姓名</div>
                  <div className="col">
                    <StyledInput
                      className="mx-0 w-100"
                      value={editCommonInfo.name}
                      onChange={(e) =>
                        setEditCommonInfo((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="row align-items-center mb-2">
                  <div className="col-3 text-primary">電話</div>
                  <div className="col">
                    <StyledInput
                      className="mx-0 w-100"
                      value={editCommonInfo.phone}
                      onChange={(e) =>
                        setEditCommonInfo((prev) => ({
                          ...prev,
                          phone: e.target.value.replace(/\D+/g, ""),
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="row align-items-center mb-2">
                  <div className="col-3 text-primary">地址</div>
                  <div className="col">
                    <StyledInput
                      className="mx-0 w-100"
                      value={editCommonInfo.address}
                      onChange={(e) =>
                        setEditCommonInfo((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-primary text-white px-5"
                    onClick={async () => {
                      if (!editCommonInfo.name) {
                        alert("請填入姓名");
                        return;
                      }
                      if (!editCommonInfo.phone) {
                        alert("請填入電話");
                        return;
                      }
                      if (!editCommonInfo.address) {
                        alert("請填入地址");
                        return;
                      }
                      await editCommonAddresses({
                        id: editCommonInfo.id,
                        name: editCommonInfo.name,
                        phone: editCommonInfo.phone,
                        address: editCommonInfo.address,
                      });
                      getCommonAddress();
                      onModalClose();
                    }}
                  >
                    儲存
                  </button>
                  <DialogButton
                    className="btn-secondary cancel"
                    onClick={onModalClose}
                  >
                    取消
                  </DialogButton>
                </div>
              </OffsetCanvasCreateCard>
            </StyledFlexBox>
          )}

          {openModal === "delete" && (
            <StyledFlexBox
              position="fixed"
              width={400}
              right={0}
              top={0}
              height="100%"
              bg="white"
              pt={40}
              zIndex={3}
              flexDirection="column"
              alignItems="center"
              px={20}
            >
              <StyledFlexBox mb={30} fontSize={18}>
                確定是否立即刪除？
              </StyledFlexBox>
              <StyledFlexBox>
                <DialogButton
                  className="btn-secondary cancel"
                  onClick={onModalClose}
                >
                  取消
                </DialogButton>
                <DialogButton
                  className="btn-danger"
                  onClick={() => {
                    deleteCommonAddresses(editCommonInfo.id);
                    getCommonAddress();
                    onModalClose();
                  }}
                >
                  確認
                </DialogButton>
              </StyledFlexBox>
            </StyledFlexBox>
          )}
          <div className="position-relative mb-3">
            <div className="text-center text-primary">選擇常用地址</div>
          </div>
          <div>
            {commonAddresses.map((commonAddress) => {
              return (
                <div
                  className="d-flex align-items-center mb-3"
                  key={commonAddress.id}
                >
                  <OffsetCanvasCard
                    className="w-100 ms-0"
                    onClick={() => {
                      setReceiverName(commonAddress.name);
                      setReceiverAddress(commonAddress.address);
                      setReceiverPhone(commonAddress.phone);
                      hideFamiliarAddressOffsetCanvas();
                    }}
                  >
                    <StyledFlexBox position="absolute" top={25} right={25}>
                      <StyledImage
                        src="/images/front-end/address_delete.svg"
                        width={20}
                        height={20}
                        cursor="pointer"
                        mr={16}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenModal("delete");
                          setEditCommonInfo({
                            id: commonAddress.id,
                            name: commonAddress.name,
                            phone: commonAddress.phone,
                            address: commonAddress.address,
                          });
                        }}
                      />
                      <StyledImage
                        src="/images/front-end/address_edit.svg"
                        width={20}
                        height={20}
                        cursor="pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenModal("edit");
                          setEditCommonInfo({
                            id: commonAddress.id,
                            name: commonAddress.name,
                            phone: commonAddress.phone,
                            address: commonAddress.address,
                          });
                        }}
                      />
                    </StyledFlexBox>
                    <div className="name">{commonAddress.name}</div>
                    <div className="name">{commonAddress.phone}</div>
                    <div className="address">{commonAddress.address}</div>
                  </OffsetCanvasCard>
                </div>
              );
            })}
            {!isEditCommonAddresses ? (
              <DashedButton onClick={() => setIsEditCommonAddresses(true)}>
                <i className="bi bi-plus" />
              </DashedButton>
            ) : (
              <div>
                <OffsetCanvasCreateCard>
                  <div className="row align-items-center mb-2">
                    <div className="col-3 text-primary">姓名</div>
                    <div className="col">
                      <StyledInput
                        className="mx-0 w-100"
                        value={editCommonAddressesName}
                        onChange={(e) =>
                          setEditCommonAddressesName(e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="row align-items-center mb-2">
                    <div className="col-3 text-primary">電話</div>
                    <div className="col">
                      <StyledInput
                        className="mx-0 w-100"
                        value={editCommonAddressesPhone}
                        onChange={(e) =>
                          setEditCommonAddressesPhone(
                            e.target.value.replace(/\D+/g, "")
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="row align-items-center mb-2">
                    <div className="col-3 text-primary">地址</div>
                    <div className="col">
                      <StyledInput
                        className="mx-0 w-100"
                        value={editCommonAddressesAddress}
                        onChange={(e) =>
                          setEditCommonAddressesAddress(e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-primary text-white px-5"
                      onClick={() => {
                        if (!editCommonAddressesName) {
                          alert("請填入姓名");
                          return;
                        }
                        if (!editCommonAddressesPhone) {
                          alert("請填入電話");
                          return;
                        }
                        if (!editCommonAddressesAddress) {
                          alert("請填入地址");
                          return;
                        }

                        newCommonAddresses();
                      }}
                    >
                      儲存
                    </button>
                  </div>
                </OffsetCanvasCreateCard>
              </div>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default SubViewBuyerLayout;
