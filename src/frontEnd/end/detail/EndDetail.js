import { useCallback, useEffect, useMemo, useState, createRef, useRef } from "react";
import {
  AddNewOrderButton,
  ArrowButton,
  CancelledButton,
  DeliveryWrapper,
  DetailButton,
  DetailTitleWrapper,
  DetailWrapper,
  Divider,
  EndFunblocButton,
  InfoWrapper,
  Order,
  OrderDetailWrapper,
  OrderWrapper,
  StyledTextarea,
  StyledInput
} from "../../ing/detail/FublocDetailStyle";
import moment from "moment";
import { SingleDatePicker } from "../../../component/datepicker/DatePicker";

import {
  AccountLastFiveNumberWrapper,
  BackButton,
  CheckedButton,
  CheckedIcon,
  CheckoutText,
  CheckoutTitle,
  WarningText,
} from "../../ing/checkout/CheckoutStyle";
import { numberWithThousandCommas } from "../../../helper/Helper";
import { useNavigate, useParams } from "react-router-dom";
import { fetchFunbloc, finishFunbloc, cancelFunbloc, lastFiveNumber } from "../../../api/funbloc/Funbloc";
import { fetchOrderDetail, fetchOrders } from "../../../api/order/Order";
import { ContentWrapper } from "../../../component/StyledComponent";
import Dialog from "../../../component/dialog/Dialog";
import {
  DialogButton,
  DialogContentWrapper,
  DialogTitle,
} from "../../../component/dialog/DialogStyle";
import { CancelledReasonWrapper, ConfirmButton } from "./EndDetailStyle";
import SubViewEditBuyerLayout, {
  PAY_STATUS,
  PAYMENT
} from "../../ing/detail/edit/EditBuyer";
import BeforeCheckoutDialog from "../../components/beforeCheckoutDialog/BeforeCheckoutDialog";
import {
  StyledButton,
  StyledFlexBox,
  StyledImage,
} from "../../../styles/Shared.styles";
import {
  fetchCommonAddresses,
  fetchFamiliarHawkers,
} from "../../../api/hawker/Hawker";

const subViewEditBuyer = "edit";

const subViewDetail = "detail";
const subViewNewBuyer = "new";
const modalLastFiveNumber = "five";
const modalCancelOrder = "cancel-order";
const modalReason = "modalReason";
const modalCheckout = "checkout-modal";
export const orderStatsMap = {
  0: {
    stats: 0,
    text: "已取消",
    icon: <i className="bi bi-slash-circle" />,
    color: "#FE868E",
  },
  1: {
    stats: 1,
    text: "開團中",
    icon: null,
    color: "#FE868E ",
  },
  2: {
    stats: 2,
    text: "未匯款",
    icon: null,
    color: "#747474 ",
  },
  3: {
    stats: 3,
    text: "已完成",
    icon: <i className="bi bi-slash-circle" />,
    color: "#FE868E",
  },
  4: {
    stats: 4,
    text: "已匯款",
    icon: <i className="bi bi-slash-circle" />,
    color: "#FE868E",
  },
  5: {
    stats: 5,
    text: "已收款",
    icon: <i className="bi bi-slash-circle" />,
    color: "#FE868E",
  },
  6: {
    stats: 6,
    text: "已寄出",
    icon: <i className="bi bi-slash-circle" />,
    color: "#FE868E",
  },
};
const IngFublocDetail = () => {
  const navigate = useNavigate();
  const [keyUpLocker, setLocker] = useState(false);
  const { funblocId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [shouldModalOpen, setShouldModalOpen] = useState(false);
  const [subView, setSubView] = useState(subViewDetail);
  const [cancelReason, setCancelReason] = useState("");
  const [payAmount, setPayAmount] = useState("");

  const [detail, setDetail] = useState({});
  const [orderBuyers, setOrderBuyers] = useState([]);
  const [orderListTotal, setOrderListTotal] = useState({});
  const [orderCondition, setOrderCondition] = useState([]);
  const [orderDetail, setOrderDetail] = useState({});

  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [finishModal, setFinishModal] = useState(false);
  const [payDate, setPayDate] = useState(moment().valueOf());

  const [editBuyerObject, setEditBuyerObject] = useState({});
  const [familiarHawkers, setFamiliarHawkers] = useState([]);
  const [commonAddresses, setCommonAddresses] = useState([]);
  const numerOfInputs = 5;
  const [currentIndex, setCurrentIndex] = useState(0);

  const [inputRefsArray] = useState(() =>
    Array.from({ length: numerOfInputs }, () => createRef())
  );
  const [letters, setLetters] = useState(() =>
    Array.from({ length: numerOfInputs }, () => "")
  );

  const sendLastFiveNumber = () => {
    const fiveNumber = letters.join("");

    if (fiveNumber.length < 5) return;

    setIsLoading(true);
    lastFiveNumber(
      detail.id,
      fiveNumber,
      moment(payDate).format("yyyy/MM/DD"),
      payAmount
    )
      .then((res) => {
        console.log(res);
        closeModal();
        getData();
        setShouldModalOpen(true);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });

  };
  const closeModal = () => {
    setModal(null);
    setShouldModalOpen(false);
    setInfoModalOpen(false);
  };
  const fiveModal = () => {
    setModal(modalLastFiveNumber);
  };
  const setOrderCancelled = () => {
    setIsLoading(true);
    cancelFunbloc(detail.id, cancelReason)
      .then(() => {
        setModal(modalReason);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  };
  const reachedGoal = useMemo(() => {
    if (orderCondition.condition_type === 0) {
      return {
        isReached:
          orderCondition.condition_amount * 1 >=
          orderCondition.condition_number,
        conditionReached: orderCondition.condition_amount,
      };
    } else {
      return {
        isReached:
          orderCondition.totalSalesFigures >= orderCondition.condition_number,
        conditionReached: orderCondition.condition_price,
      };
    }
  }, [orderCondition]);

  const openBuyerDetail = (idArr) => {
    setOrderBuyers((prevArr) => {
      return prevArr.map((buyer) => {
        if (idArr.includes(buyer.id)) {
          return { ...buyer, isOpen: true };
        }
        return buyer;
      });
    });
  };

  const closeBuyerDetail = (idArr) => {
    setOrderBuyers((prevArr) => {
      return prevArr.map((buyer) => {
        if (idArr.includes(buyer.id)) {
          return { ...buyer, isOpen: false };
        }
        return buyer;
      });
    });
  };

  const getData = useCallback(() => {
    setIsLoading(true);
    Promise.all([
      fetchFunbloc(funblocId),
      fetchOrders(funblocId, { page: 1, perPage: 100 }),
      fetchOrderDetail(funblocId),
      fetchFamiliarHawkers(),
      fetchCommonAddresses(),
    ])
      .then(([detail, orders, orderDetail, _payStatus]) => {
        setDetail(detail.data);
        setOrderBuyers(
          orders.data.buyer.map((buyer) => ({ ...buyer, isOpen: false }))
        );
        setOrderListTotal(orders.data.listTotal);
        setOrderCondition(orders.data.condition);
        setOrderDetail(orderDetail.data);
        setFamiliarHawkers(familiarHawkers.data);
        setCommonAddresses(commonAddresses.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const onOrderFinish = () => {
    finishFunbloc(funblocId)
      .then(() => {
        setFinishModal(false);
        getData();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="container-fluid py-5">
      <ContentWrapper>
        <DetailWrapper>
          <StyledFlexBox
            px={[20, 40]}
            justifyContent="space-between"
            pb={24}
            flexDirection={["column"]}
          >
            <StyledFlexBox flexDirection="column">
              <DetailTitleWrapper mb={[12, 16]}>
                <StyledFlexBox
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                  flexDirection={["column", "row"]}
                >
                  <StyledFlexBox
                    alignItems="center"
                    flexDirection={["column", "row"]}
                    mb={[15, 0]}
                  >
                    <StyledFlexBox
                      width={[44, 64]}
                      height={[32, 44]}
                      borderRadius="7.8px"
                      justifyContent="center"
                      alignItems="center"
                      bg="#26b7bc"
                      mr="20px"
                      position={["absolute", "relative"]}
                      left={["-60px", "unset"]}
                      onClick={() => navigate(`/end`)}
                      cursor="pointer"
                    >
                      <StyledImage src="/images/front-end/arrow-back.svg" />
                    </StyledFlexBox>
                    <div className="num text-primary">{detail.num}</div>
                    <div className="name">{detail.funblocName}</div>
                  </StyledFlexBox>
                  <StyledFlexBox
                    justifyContent="space-around"
                    alignItems={["center", "flex-end", "center"]}
                    width={[155, 155, 224]}
                    flexDirection={["column", "column", "row"]}
                  >
                    <StyledFlexBox fontWeight={700} fontSize={12}>
                      結團時間：{detail.checkoutDate?.slice(0, 10)}
                    </StyledFlexBox>
                    <StyledFlexBox
                      color={
                        detail.stats === 2 && !detail.isPaymentDate
                          ? "#FE868E"
                          : "#747474"
                      }
                      fontWeight={700}
                      fontSize={12}
                    >
                      {detail.stats === 2 && !detail.isPaymentDate
                        ? "未匯款"
                        : orderStatsMap[detail.stats]?.text}
                    </StyledFlexBox>
                  </StyledFlexBox>
                </StyledFlexBox>
              </DetailTitleWrapper>
            </StyledFlexBox>
            <StyledFlexBox
              flexDirection={["column", "column", "row"]}
              justifyContent={["center", "center", "space-around"]}
            >
              <StyledFlexBox
                flexDirection={["column", "row"]}
                width={["100%", "100%", detail.stats !== 3 ? "70%" : "100%"]}
                borderRadius="9px"
                bg="rgba(196, 196, 196, 0.12)"
                border="0.5px solid #cceff0"
                alignItems={["center", "inital"]}
                justifyContent={["initial", "space-around", "space-around"]}
                pt={[31, 31, 29]}
                pb={[26, 31]}
                mb={[28, 28, 31]}
              >
                <StyledFlexBox
                  flexDirection={["column", "column", "row"]}
                  alignItems={["initial", "initial", "center"]}
                  justifyContent={["initial", "initial", "space-around"]}
                  width={["unset", "unset", "60%"]}
                >
                  <StyledFlexBox
                    flexDirection="column"
                    fontSize={12}
                    fontWeight={500}
                    color="#747474"
                  >
                    <div>
                      銷售額總計：
                      {numberWithThousandCommas(
                        orderListTotal.totalSalesFigures
                      )}
                    </div>
                    <div>
                      進貨成本總計：
                      {numberWithThousandCommas(orderListTotal.totalCost)}
                    </div>
                  </StyledFlexBox>
                  <StyledFlexBox flexDirection={["row", "row", "column"]}>
                    <StyledFlexBox
                      fontSize={14}
                      fontWeight={700}
                      color="#26b7bc"
                      mb={[0, 0, 13]}
                      mr={["12px", "12px", 0]}
                      alignItems="center"
                    >
                      利潤總計
                    </StyledFlexBox>
                    <StyledFlexBox
                      fontSize={24}
                      fontWeight={700}
                      color="#747474"
                    >
                      NT${numberWithThousandCommas(orderListTotal.totalProfit)}
                      元
                    </StyledFlexBox>
                  </StyledFlexBox>
                </StyledFlexBox>

                <StyledFlexBox
                  flexDirection={["row", "column"]}
                  width={[246, 118]}
                  mt={[24, 0]}
                  justifyContent={["space-around", "initial"]}
                >
                  <StyledButton
                    className="btn btn-primary text-white"
                    mb={[0, 16]}
                    onClick={() => navigate(`/open/${detail.funblocId}`)}
                  >
                    團購資訊
                  </StyledButton>
                  <StyledButton
                    className="btn btn btn-outline-primary"
                    onClick={() => navigate(`/ing/summary/${funblocId}`)}
                  >
                    訂購總覽
                  </StyledButton>
                </StyledFlexBox>
              </StyledFlexBox>
              {detail.stats !== 3 && (
                <StyledFlexBox
                  display={["none", "none", "block"]}
                  width="1px"
                  height={149}
                  bg="#26b7bc"
                />
              )}

              {detail.stats !== 3 && (
                <StyledFlexBox
                  className="d-flex flex-column justify-content-evenly"
                  alignItems={["center"]}
                >
                  <InfoWrapper
                    flexDirection="column"
                    width={["100%", 232, 189]}
                  >
                    {detail.stats === 0 && (
                      <CancelledButton
                        disabled={isLoading}
                        onClick={() => {
                          setModal(modalReason);
                          setShouldModalOpen(true);
                        }}
                      >
                        查看取消原因
                      </CancelledButton>
                    )}
                    {detail.payDate && detail.stats !== 6 && detail.stats !== 0 && (
                      <EndFunblocButton
                        disabled
                        style={{ background: "#e6e6e6", color: "#fff" }}
                      >
                        完成訂單
                      </EndFunblocButton>
                    )}
                    {!detail.payDate && detail.stats !== 6 && detail.stats !== 0 && (
                      <EndFunblocButton
                        color="#fff"
                        disabled={isLoading}
                        onClick={() => {
                          setModal(modalCheckout);
                          setShouldModalOpen(true);
                        }}
                      >
                        我已匯款
                      </EndFunblocButton>
                    )}

                    {detail.stats === 6 && detail.stats !== 0 && (
                      <EndFunblocButton
                        onClick={() => setFinishModal(true)}
                        color="#fff"
                      >
                        完成訂單
                      </EndFunblocButton>
                    )}

                    <DetailButton
                      disabled={isLoading}
                      onClick={() => setInfoModalOpen(true)}
                    >
                      收件資訊
                    </DetailButton>
                    {!detail.payDate && detail.stats !== 6 && detail.stats !== 0 && (
                      <DetailButton
                        disabled={isLoading}

                        onClick={() => {
                          setModal(modalCancelOrder);
                        }}
                      >
                        取消團購
                      </DetailButton>
                    )}
                  </InfoWrapper>
                </StyledFlexBox>
              )}
            </StyledFlexBox>
          </StyledFlexBox>
          <Divider />
          <OrderWrapper px={[20, 40]}>
            <div className="d-flex justify-content-end align-items-center mb-3">
              {subView === subViewDetail && (
                <button
                  className="btn btn-outline-primary px-4"
                  onClick={() =>
                    openBuyerDetail(orderBuyers.map((buyer) => buyer.id))
                  }
                >
                  全部展開
                </button>
              )}
              {subView === subViewNewBuyer && (
                <AddNewOrderButton onClick={() => setSubView(subViewDetail)}>
                  <i className="bi bi-arrow-left-circle-fill"></i>
                </AddNewOrderButton>
              )}
            </div>
            {subView === subViewDetail &&
              orderBuyers.length > 0 &&
              orderBuyers.map((buyer) => {
                return (
                  <Order
                    key={buyer.id}
                    flexDirection={["column", "column", "column"]}
                    alignItems={["initial", "initial", "center"]}
                    px={[20, 24]}
                  >
                    <StyledFlexBox
                      flexDirection={["column", "column", "row"]}
                      justifyContent="space-around"
                      width="100%"
                      alignItems={["unset", "unset", "center"]}
                    >
                      <StyledButton
                        height={20}
                        width={62}
                        bg="#fff"
                        p={0}
                        className="btn btn-outline-primary"
                        onClick={() => {
                          setEditBuyerObject({
                            ...buyer,
                            amountMap: orderDetail?.list[
                              buyer.id
                            ].orderProducts.reduce(
                              (prev, current) => ({
                                ...prev,
                                [current.productId]: current.amount,
                              }),
                              {}
                            ),
                          });
                          setSubView(subViewEditBuyer);
                        }}
                      >
                        <i className="bi bi-pen me-2" />
                        編輯
                      </StyledButton>
                      <StyledFlexBox alignItems="center">
                        <div className="name">購買人：{buyer.orderName}</div>
                      </StyledFlexBox>
                      <StyledFlexBox
                        alignItems={["flex-end", "center"]}
                        justifyContent={["space-between", "initial"]}
                        width={["87%", "unset"]}
                      >
                        <StyledFlexBox
                          flexDirection={["column", "row"]}
                          width={[118, 572]}
                          justifyContent={[
                            "space-between",
                            "space-between",
                            "space-around",
                          ]}
                          alignItems={["initial", "center"]}
                        >
                          <div>
                            <span className="label text-primary">進貨總價</span>
                            <span className="value ms-2">
                              {buyer.totalQuote}
                            </span>
                          </div>
                          <div>
                            <span className="label text-primary">售價總價</span>
                            <span className="value ms-2">
                              {buyer.totalSalesFigures}
                            </span>
                          </div>
                          <div>
                            <span className="label text-primary">付款方式</span>
                            <span className="value ms-2">{buyer.payType}</span>
                          </div>
                          <div>
                            <span className="label text-primary">匯款狀態</span>
                            <span className="ms-2">
                              {buyer.payStatus === PAYMENT.atm.paid || buyer.payStatus === PAYMENT.cash.paid ? (
                                <i className="bi bi-check-circle-fill text-success-light" />
                              ) : (
                                <i className="bi bi-x-circle-fill text-danger" />
                              )}
                            </span>
                          </div>
                        </StyledFlexBox>
                        <div className="col-1 text-end">
                          {buyer.isOpen ? (
                            <ArrowButton
                              onClick={() => closeBuyerDetail([buyer.id])}
                            >
                              <i className="bi bi-arrow-up-circle-fill text-primary" />
                            </ArrowButton>
                          ) : (
                            <ArrowButton
                              onClick={() => openBuyerDetail([buyer.id])}
                            >
                              <i className="bi bi-arrow-down-circle-fill text-primary" />
                            </ArrowButton>
                          )}
                        </div>
                      </StyledFlexBox>
                    </StyledFlexBox>

                    {buyer.isOpen && (
                      <OrderDetailWrapper>
                        <div className="row py-2 header">
                          <div className="col text-primary">商品名稱</div>
                          <div className="col text-primary">數量</div>
                          <div className="col text-primary">進價</div>
                          <div className="col text-primary">我的售價</div>
                          <StyledFlexBox
                            className="col text-primary"
                            display={["none", "flex", "none"]}
                            justifyContent="center"
                          >
                            進價總額
                          </StyledFlexBox>
                          <StyledFlexBox
                            className="col text-primary"
                            display={["none", "flex", "none"]}
                            justifyContent="center"
                          >
                            售價總額
                          </StyledFlexBox>
                          <StyledFlexBox
                            className="col text-primary"
                            display={["none", "none", "flex"]}
                            justifyContent="center"
                          >
                            我的售價總額
                          </StyledFlexBox>
                        </div>
                        {orderDetail?.list[buyer.id].orderProducts.length >
                          0 ? (
                          orderDetail?.list[buyer.id].orderProducts.map(
                            (product) => {
                              return (
                                <div
                                  className="row py-2 body"
                                  key={product.productId}
                                >
                                  <div className="col">
                                    {product.productName}
                                  </div>
                                  <div className="col">{product.amount}</div>
                                  <div className="col">{product.quote}</div>
                                  <div className="col">{product.myPrice}</div>
                                  <StyledFlexBox
                                    className="col"
                                    display={["none", "flex", "flex"]}
                                    justifyContent="center"
                                  >
                                    {numberWithThousandCommas(
                                      product.amount * product.quote
                                    )}
                                  </StyledFlexBox>
                                  <StyledFlexBox
                                    className="col"
                                    display={["none", "flex", "flex"]}
                                    justifyContent="center"
                                  >
                                    {numberWithThousandCommas(
                                      product.amount * product.myPrice
                                    )}
                                  </StyledFlexBox>
                                </div>
                              );
                            }
                          )
                        ) : (
                          <div className="row py-2 body">
                            <div className="col">無資料</div>
                          </div>
                        )}
                        <Divider />
                        <DeliveryWrapper>
                          <StyledFlexBox flexDirection={["column", "row"]}>
                            <StyledFlexBox
                              className="ps-4 label text-primary"
                              width={["100%", "20%"]}
                            >
                              {" "}
                              配送資訊：
                            </StyledFlexBox>
                            <div className="col text-start ps-4 value-wrapper">
                              <div className="value">
                                收貨人姓名：
                                {orderDetail?.list[buyer.id].receiverName}
                              </div>
                              <div className="value">
                                收貨人地址：
                                {orderDetail?.list[buyer.id].receiverAddress}
                              </div>
                              <div className="value">
                                收貨人電話：
                                {orderDetail?.list[buyer.id].receiverPhone}
                              </div>
                              <div className="value">
                                備註：{orderDetail?.list[buyer.id].note}
                              </div>
                            </div>
                          </StyledFlexBox>
                        </DeliveryWrapper>
                      </OrderDetailWrapper>
                    )}
                  </Order>
                );
              })}

            {subView === subViewEditBuyer && (
              <SubViewEditBuyerLayout
                funblocId={funblocId}
                buyerObject={editBuyerObject}
                onBuyerEdited={() => {
                  setSubView(subViewDetail);
                  getData();
                }}
                products={detail.products}
                familiarHawkers={familiarHawkers}
                commonAddresses={commonAddresses}
                isEndDetail
                cancelEdit={() => setSubView(subViewDetail)}
              />
            )}
          </OrderWrapper>
        </DetailWrapper>
      </ContentWrapper>

      {
        modal === modalCheckout && shouldModalOpen && (
          <BeforeCheckoutDialog
            name={detail.funblocName}
            num={detail.num}
            totalCost={detail.totalCost}
            onCancel={closeModal}
            five={fiveModal}
            deliveryInfo={detail.delivery_info}
            condition={detail.condition_type === 0 ? `${detail.condition_amount} / ${detail.condition_number}(${detail.condition_unit})` : `${detail.totalSalesFigures} / ${detail.condition_number}(${detail.condition_unit})`}
            isEndDetail
          />
        )
      }

      {
        modal === modalReason && shouldModalOpen && (
          <Dialog onClose={closeModal}>
            <DialogContentWrapper width={[311, 688, 715]} height={545}>
              <CancelledReasonWrapper>
                <div className="title text-center text-primary mb-3">說明</div>
                <div className="content mb-3">{detail.cancelReason}</div>
                <div className="text-center">
                  <ConfirmButton onClick={closeModal}>確認</ConfirmButton>
                </div>
              </CancelledReasonWrapper>
            </DialogContentWrapper>
          </Dialog>
        )
      }
      {
        infoModalOpen && (
          <Dialog onClose={closeModal}>
            <DialogContentWrapper width={[311, 688, 715]} height={[406, 369]}>
              <StyledFlexBox
                position="absolute"
                top={16}
                right={16}
                cursor="pointer"
                onClick={closeModal}
              >
                <StyledImage src="/images/front-end/icon_close.svg" />
              </StyledFlexBox>
              <StyledFlexBox
                color="#515151"
                fontSize={17}
                fontWeight={600}
                mb={40}
                justifyContent="center"
              >
                團購主收件資訊
              </StyledFlexBox>
              {[
                { text: "收件人", value: "recipientName" },
                { text: "收件地址", value: "recipientAddress" },
                { text: "聯絡電話", value: "recipientPhone" },
                { text: "備註", value: "recipientRemark" },
              ].map((item) => (
                <StyledFlexBox
                  flexDirection="column"
                  px={[20, 70]}
                  width="100%"
                  key={item.value}
                >
                  <StyledFlexBox
                    mb={12}
                    width="100%"
                    flexDirection={["column", "row"]}
                  >
                    <StyledFlexBox color="#26b7bc" fontSize={17} width={91}>
                      {item.text}
                    </StyledFlexBox>
                    <StyledFlexBox
                      color="#747474"
                      fontSize={17}
                      width="calc(90% - 91px)"
                    >
                      {detail[item.value]}
                    </StyledFlexBox>
                  </StyledFlexBox>
                </StyledFlexBox>
              ))}
            </DialogContentWrapper>
          </Dialog>
        )
      }
      {
        finishModal && (
          <Dialog onClose={() => setFinishModal(false)}>
            <DialogContentWrapper>
              <DialogTitle className="mb-4">確定立即完成訂單？</DialogTitle>
              <div>
                <DialogButton
                  className="btn-secondary cancel"
                  onClick={() => setFinishModal(false)}
                >
                  取消
                </DialogButton>
                <DialogButton className="btn-danger" onClick={onOrderFinish}>
                  確認
                </DialogButton>
              </div>
            </DialogContentWrapper>
          </Dialog>
        )
      }
      {
        modal === modalCancelOrder && (
          <Dialog onClose={closeModal}>
            <DialogContentWrapper className="py-4 px-5" width={488} height={500}>
              <div className="text-black">
                <div className="fw-bold text-center">
                  【{orderDetail.num}】即將被取消
                </div>
                <div className="fw-bold text-center">請確認後再取消訂單</div>
              </div>
              <StyledTextarea
                rows={12}
                placeholder="在此輸入訂單取消的原因...."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
              <div>
                <DialogButton
                  className="btn-secondary cancel"
                  onClick={closeModal}
                >
                  取消
                </DialogButton>
                <DialogButton
                  className="btn-primary"
                  disabled={isLoading}
                  onClick={setOrderCancelled}
                >
                  確認
                </DialogButton>
              </div>
            </DialogContentWrapper>
          </Dialog>
        )
      }
      {modal === modalLastFiveNumber && shouldModalOpen && (
        <Dialog onClose={closeModal}>
          <DialogContentWrapper
            width={[311, 688, 715]}
            height={550}
            position="relative"
          >
            <StyledFlexBox
              position="absolute"
              top={16}
              right={16}
              cursor="pointer"
              onClick={closeModal}
            >
              <StyledImage src="/images/front-end/icon_close.svg" />
            </StyledFlexBox>
            <AccountLastFiveNumberWrapper>
              <div className="title text-center mb-3">請輸入匯款帳號後五碼</div>
              <div className="d-flex">
                {inputRefsArray.map((ref, index) => {
                  return (
                    <input
                      ref={ref}
                      type="text"
                      id={`box${index}-1`}
                      maxLength="1"
                      onInput={(e) => {
                        const { value } = e.target;

                        setLetters((letters) =>
                          letters.map((letter, letterIndex) =>
                            letterIndex === index
                              ? value.replace(/\D+/g, "")
                              : letter
                          )
                        );

                        setCurrentIndex((prevIndex) => {
                          const nextIndex = prevIndex < numerOfInputs - 1 ? prevIndex + 1 : 0;
                          const nextInput = inputRefsArray?.[nextIndex]?.current;
                          nextInput.select();
                          return nextIndex;
                        });
                      }}
                      onClick={(e) => {
                        setCurrentIndex(index);
                        e.target.select();
                      }}
                      value={letters[index]}
                      max={"1"}
                      className="form-control"
                    />
                  );
                })}
              </div>
              <div className="d-flex align-items-center mt-5">
                <div className="label w-25">匯款日期</div>
                <div className="w-75 date-wrapper position-relative">
                  <StyledFlexBox
                    position="absolute"
                    left={190}
                    top="12px"
                    zIndex={2}
                  >
                    <StyledImage src="/images/front-end/icon_date.svg" />
                  </StyledFlexBox>
                  <SingleDatePicker
                    startDate={payDate}
                    setStartDate={setPayDate}
                    dateFormat={"yyyy/MM/dd"}
                  />
                </div>
              </div>
              <div className="d-flex align-items-center mt-5">
                <div className="label w-25">匯款金額</div>
                <div className="w-75 date-wrapper position-relative">
                  <StyledInput
                    style={{ fontSize: "inherit" }}
                    id="payment"
                    className="w-75 ms-0"
                    height={46}
                    m={0}
                    type="text"
                    value={payAmount}
                    onChange={(e) =>
                      setPayAmount(e.target.value.replace(/\D+/g, ""))
                    }
                  />
                </div>
              </div>
              <StyledFlexBox
                className="button-wrapper text-center"
                justifyContent="center"
              >
                <StyledButton
                  px={30}
                  className="btn btn-outline-primary mx-3"
                  onClick={() => {
                    setModal(modalCheckout);
                    setShouldModalOpen(true);
                  }}                >
                  回上一步
                </StyledButton>
                <CheckedButton
                  disabled={isLoading}
                  
                  onClick={sendLastFiveNumber}
                  
                >
                  確認
                </CheckedButton>
              </StyledFlexBox>
            </AccountLastFiveNumberWrapper>
          </DialogContentWrapper>
        </Dialog>
      )}
    </div >
  );
};

export default IngFublocDetail;
