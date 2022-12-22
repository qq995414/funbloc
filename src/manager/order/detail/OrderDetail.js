import React, { useCallback, useEffect, useState } from "react";
import BackBtn from "../../components/general/BackBtn";
import {
  ContentWrapper,
  OperateButton,
} from "../../../component/StyledComponent";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BuyerDetailHead,
  BuyerTable,
  BuyerTd,
  BuyerTh,
  BuyerThead,
  ConfirmationStats,
  ConfirmationStatsWrapper,
  DeliveryTitle,
  DeliveryWrapper,
  DetailTitle,
  Dot,
  Line,
  OrderConfirmationBody,
  OrderDetailLabel,
  OrderDetailValue,
  StatsLabel,
  StatsNumber,
  StyledTextarea,
} from "./OrderDetailStyle";
import Dialog, {
  CancelledDialog,
  DoneDialog,
} from "../../../component/dialog/Dialog";
import {
  DialogButton,
  DialogContentWrapper,
  DialogTitle,
} from "../../../component/dialog/DialogStyle";
import {
  cancelOrder,
  confirmOrder,
  confirmOrderFInish,
  confirmOrderPaid,
  confirmOrderSent,
  confirmPayment,
  editOrder,
  fetchOrder,
} from "../../../api/order/ManagerOrder";
import { numberWithThousandCommas } from "../../../helper/Helper";
import DownloadOrderButton from "./DownloadOrderButton";
import { orderStatsMap } from "../Order";
import {
  StyledButton,
  StyledFlexBox,
  StyledImage,
} from "../../../styles/Shared.styles";
import { StyledInput } from "../../company/edit/EditCompanyStyle";
import ReceiveInfo from "./ReceiveInfo";
import Overview from "./Overview";

const modalConfirmPayment = "confirm-payment";
const modalConfirmedPayment = "confirmed-payment";
const modalConfirmOrder = "confirm-order";
const modalConfirmedOrder = "confirmed-order";

const modalCancelOrder = "cancel-order";
const modalCancelledOrder = "cancelled-order";
const modalFinishedOrder = "finished-order";
const modalPaidOrder = "paid-order";
const modalSentOrder = "sent-order";
const modalFinishOrder = "finish-order";

const OrderList = ({
  order,
  id,
  openBuyerDetail,
  orderBuyer,
  index,
  closeBuyerDetail,
}) => {
  return (
    <ContentWrapper>
      <BuyerDetailHead>
        <div className="title">{order.orderName}</div>
        <div className="d-flex align-items-center">
          <div className="d-flex mx-2">
            <div className="label text-primary mx-2">進貨總計</div>
            <div className="value mx-2">
              {numberWithThousandCommas(order.orderCount.countQuoteReal)}
            </div>
          </div>
          <div className="d-flex mx-2">
            <div className="label text-primary mx-2">團購主成本總計</div>
            <div className="value mx-2">
              {numberWithThousandCommas(order.orderCount.countCost)}
            </div>
          </div>
          <div className="d-flex mx-2">
            <div className="label text-primary mx-2">團購主售價總計</div>
            <div className="value mx-2">
              {numberWithThousandCommas(order.orderCount.countMyPrice)}
            </div>
          </div>
          {orderBuyer?.isOpen ? (
            <StyledButton
              className="btn"
              onClick={() => closeBuyerDetail([index])}
            >
              <i className="bi bi-arrow-up-circle-fill text-primary" />
            </StyledButton>
          ) : (
            <StyledButton
              className="btn"
              onClick={() => openBuyerDetail([index])}
            >
              <i className="bi bi-arrow-down-circle-fill text-primary" />
            </StyledButton>
          )}
        </div>
      </BuyerDetailHead>
      {orderBuyer?.isOpen && (
        <>
          <BuyerTable>
            <BuyerThead>
              <tr>
                <BuyerTh>商品名稱</BuyerTh>
                <BuyerTh>進價</BuyerTh>
                <BuyerTh>團購主成本</BuyerTh>
                <BuyerTh>團購主售價</BuyerTh>
                <BuyerTh>定價</BuyerTh>
                <BuyerTh>數量</BuyerTh>
                <BuyerTh>進價小計</BuyerTh>
                <BuyerTh>成本小計</BuyerTh>
                <BuyerTh>售價小計</BuyerTh>
              </tr>
            </BuyerThead>
            <tbody>
              {order.orderProducts.map((product) => {
                return (
                  <tr key={order.name + product.productId}>
                    <BuyerTd>{product.productName}</BuyerTd>
                    <BuyerTd>
                      {numberWithThousandCommas(product.quoteReal)}
                    </BuyerTd>
                    <BuyerTd>{numberWithThousandCommas(product.quote)}</BuyerTd>
                    <BuyerTd>
                      {numberWithThousandCommas(product.myPrice)}
                    </BuyerTd>
                    <BuyerTd>{numberWithThousandCommas(product.price)}</BuyerTd>
                    <BuyerTd>
                      {numberWithThousandCommas(product.amount)}
                    </BuyerTd>
                    <BuyerTd>
                      {numberWithThousandCommas(product.totalQuoteReal)}
                    </BuyerTd>
                    <BuyerTd>
                      {numberWithThousandCommas(product.totalQuote)}
                    </BuyerTd>
                    <BuyerTd>
                      {numberWithThousandCommas(product.totalMyPrice)}
                    </BuyerTd>
                  </tr>
                );
              })}
            </tbody>
          </BuyerTable>
          <DeliveryWrapper>
            <DeliveryTitle className="mb-3">配送資訊：</DeliveryTitle>
            <div className="row mb-3">
              <div className="col-2 text-end">收貨人姓名</div>
              <div className="col">{order.receiverName}</div>
            </div>
            <div className="row mb-3">
              <div className="col-2 text-end">收貨人地址</div>
              <div className="col">{order.receiverAddress}</div>
            </div>
            <div className="row mb-3">
              <div className="col-2 text-end">收貨人電話</div>
              <div className="col">{order.receiverPhone}</div>
            </div>
            <div className="row mb-3">
              <div className="col-2 text-end">備註</div>
              <div className="col">{order.note}</div>
            </div>
          </DeliveryWrapper>
        </>
      )}
    </ContentWrapper>
  );
};

const OrderDetail = () => {
  const lineWidth = () => {
    if (orderDetail.isFinishDate) {
      return `calc(100% - 6rem - 25px)`;
    } else if (orderDetail.isSendDate) {
      return `calc(67% - 3rem - 25px)`;
    } else if (orderDetail.isPaymentDate) {
      return `calc(33% - 25px)`;
    } else {
      return 0;
    }
  };

  const navigate = useNavigate();
  const { orderId } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const [modal, setModal] = useState(null);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);

  const [orderDetail, setOrderDetail] = useState({});
  const [cancelReason, setCancelReason] = useState("");

  const [editFeeModalOpen, setEditFeeModalOpen] = useState(false);
  const [editedFee, setEditedFee] = useState("");
  const [editRemarkModalOpen, setEditRemarkOpen] = useState(false);
  const [editedRemark, setEditedRemark] = useState("");

  const [setPaidModal, setPaidModalOpen] = useState(false);
  const [setSentModal, setSentModalOpen] = useState(false);
  const [setFinishModal, setFinishModalOpen] = useState(false);

  const onFeeEdit = async () => {
    await editOrder({ orderId, data: { delivery_fee: editedFee } });
    getOrderDetail();
    setEditFeeModalOpen(false);
  };
  const onRemarkEdit = async () => {
    await editOrder({ orderId, data: { remark: editedRemark } });
    getOrderDetail();
    setEditRemarkOpen(false);
  };

  const closeModal = () => {
    setModal(null);
    setShouldOpenModal(false);
    setCancelReason("");
    setEditFeeModalOpen(false);
  };

  const getOrderDetail = useCallback(() => {
    setIsLoading(true);
    fetchOrder(orderId)
      .then((res) => {
        setOrderDetail(res.data);
        setEditedFee(res.data.delivery_fee);
        setShouldOpenModal(true);
        if (res.data.list) {
          setOrderBuyers(
            Object.values(res.data.list).map((buyer) => ({
              ...buyer,
              isOpen: false,
            }))
          );
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [setIsLoading, setOrderDetail, setShouldOpenModal]);

  const setOrderPaid = () => {
    setIsLoading(true);
    confirmOrderPaid(orderId)
      .then((res) => {
        setPaidModalOpen(false);
        setModal(modalPaidOrder);
        setShouldOpenModal(true);
        getOrderDetail();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  };

  const setOrderSent = () => {
    setIsLoading(true);
    confirmOrderSent(orderId)
      .then((res) => {
        setSentModalOpen(false);
        setModal(modalPaidOrder);
        setShouldOpenModal(true);
        getOrderDetail();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  };

  const setOrderFinish = () => {
    setFinishModalOpen(false);
    setIsLoading(true);
    confirmOrderFInish(orderId)
      .then((res) => {
        setModal(modalFinishOrder);
        setShouldOpenModal(true);
        getOrderDetail();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  };

  const setOrderCancelled = () => {
    setIsLoading(true);
    cancelOrder(orderId, cancelReason)
      .then(() => {
        setModal(modalCancelledOrder);
        setShouldOpenModal(true);
        getOrderDetail();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  };

  const setConfirmPayment = () => {
    setIsLoading(true);
    confirmPayment(orderId)
      .then((res) => {
        getOrderDetail();
        setModal(modalConfirmedPayment);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  };

  const setConfirmOrder = () => {
    setIsLoading(true);
    confirmOrder(orderId)
      .then((res) => {
        getOrderDetail();
        setModal(modalConfirmedOrder);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  };

  const [orderBuyers, setOrderBuyers] = useState([]);

  const openBuyerDetail = (idArr) => {
    setOrderBuyers((prevArr) => {
      return prevArr.map((buyer, arrIdx) => {
        if (idArr.includes(arrIdx)) {
          return { ...buyer, isOpen: true };
        }
        return buyer;
      });
    });
  };

  const closeBuyerDetail = (idArr) => {
    setOrderBuyers((prevArr) => {
      return prevArr.map((buyer, arrIdx) => {
        if (idArr.includes(arrIdx)) {
          return { ...buyer, isOpen: false };
        }
        return buyer;
      });
    });
  };

  useEffect(() => {
    getOrderDetail();
  }, [getOrderDetail]);

  useEffect(() => {
    let timer;
    const noticeModals = [
      modalConfirmedPayment,
      modalConfirmedOrder,
      modalFinishOrder,
      modalCancelledOrder,
      modalSentOrder,
      modalPaidOrder,
      modalFinishedOrder,
    ];
    if (noticeModals.includes(modal)) {
      getOrderDetail();
      timer = setTimeout(() => setModal(null), 2000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [modal, getOrderDetail]);

  return (
    <div className="container-fluid p-5">
      <div className="d-flex justify-content-between align-items-center">
        <BackBtn
          text={"回列表"}
          onClickCallback={() => navigate("/manager/order")}
        />
        <div>
          {!isLoading && orderDetail.stats === 4 && !!orderDetail.payDate && (
            <OperateButton
              className="btn-primary text-white mx-2"
              onClick={() => setPaidModalOpen(true)}
            >
              <i className="bi bi-check-lg" /> 收款確認
            </OperateButton>
          )}
          {!isLoading && orderDetail.stats === 5 && (
            <OperateButton
              className="btn-primary text-white mx-2"
              onClick={() => setSentModalOpen(true)}
            >
              <i className="bi bi-check-lg" /> 出貨確認
            </OperateButton>
          )}
          {!isLoading && orderDetail.stats === 6 && (
            <OperateButton
              className="btn-primary text-white mx-2"
              onClick={() => setFinishModalOpen(true)}
            >
              <i className="bi bi-check-lg" /> 訂單完成
            </OperateButton>
          )}
          {/* {!isLoading &&
            ![orderStatsMap["3"].stats, orderStatsMap["0"].stats].includes(
              orderDetail.stats
            ) && (
              <OperateButton
                className="btn-primary text-white mx-2"
                onClick={setOrderFinished}
              >
                <i className="bi bi-check-lg" /> 已完成訂單
              </OperateButton>
            )} */}
          {!isLoading &&
            ![orderStatsMap["0"].stats].includes(orderDetail.stats) && (
              <OperateButton
                className="btn-danger text-white mx-2"
                onClick={() => {
                  setModal(modalCancelOrder);
                  setShouldOpenModal(true);
                }}
              >
                <i className="bi bi-trash3" /> 取消訂購單
              </OperateButton>
            )}
        </div>
      </div>
      <div className="row align-items-center mt-5 mb-4">
        <div>
          <div className="row mb-2">
            <div>
              <StyledFlexBox fontSize={20} fontWeight={600}>
                訂單編號 {orderDetail.num}
                <StyledFlexBox color="#26b7bc">
                  （{orderStatsMap[orderDetail.stats]?.text}）
                </StyledFlexBox>
              </StyledFlexBox>
            </div>
          </div>
          <StyledFlexBox>
            <div style={{ width: "50%" }}>
              <div className="row mb-2">
                <div className="col-3">
                  <OrderDetailLabel>結團日期</OrderDetailLabel>
                </div>

                <div className="col">
                  <OrderDetailValue>
                    {orderDetail.checkoutDate?.slice(0, 10)}
                  </OrderDetailValue>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-3">
                  <OrderDetailLabel>小販名稱</OrderDetailLabel>
                </div>
                <div className="col">
                  <OrderDetailValue>
                    {orderDetail.hawkerName}
                    <Link
                      className="ms-4"
                      to={`/manager/hawker/edit/${orderDetail.hawkerId}`}
                    >
                      查看小販
                    </Link>
                  </OrderDetailValue>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-3">
                  <OrderDetailLabel>販團名稱</OrderDetailLabel>
                </div>
                <div className="col-7">
                  <OrderDetailValue>{orderDetail.funblocName}</OrderDetailValue>
                </div>
              </div>
              {orderDetail.cancelReason && (
                <div className="row mb-2">
                  <div className="col-3">
                    <OrderDetailLabel>取消原因</OrderDetailLabel>
                  </div>
                  <div className="col-7">
                    <OrderDetailValue>
                      {orderDetail.cancelReason}
                    </OrderDetailValue>
                  </div>
                </div>
              )}
              <div className="row mb-2">
                <div className="col-3">
                  <OrderDetailLabel>平台備註</OrderDetailLabel>
                </div>
                <StyledFlexBox className="col-7" alignItems="center">
                  <OrderDetailValue className="col-10">{orderDetail.remark}</OrderDetailValue>
                  <StyledFlexBox
                    cursor="pointer"
                    width={52}
                    height={20}
                    border="0.5px solid #26b7bc"
                    bg="#fff"
                    borderRadius="4px"
                    justifyContent="center"
                    alignItems="center"
                    fontSize={11}
                    fontWeight={500}
                    color="#26b7bc"
                    ml="9px"
                    onClick={() => setEditRemarkOpen(true)}
                  >
                    <StyledImage src="/images/manager/carbon_pen.svg" />
                    編輯
                  </StyledFlexBox>
                </StyledFlexBox>
              </div>
            </div>
            <div style={{ width: "50%" }}>
              <div className="row mb-2">
                <div className="col-3">
                  <OrderDetailLabel>成團條件</OrderDetailLabel>
                </div>
                <div className="col-7">
                  {console.log(orderDetail)}
                  {orderDetail.condition_type === 0 ?
                    <OrderDetailValue>
                      {orderDetail.condition_amount}/
                      {orderDetail.condition_number} {orderDetail.condition_unit}
                    </OrderDetailValue> :
                    <OrderDetailValue>
                      {orderDetail.payAmount}/
                      {orderDetail.condition_number} {orderDetail.condition_unit}
                    </OrderDetailValue>
                  }

                </div>
              </div>
              {orderDetail.delivery_info && (
                <div className="row mb-2">
                  <div className="col-3">
                    <OrderDetailLabel>配送資訊</OrderDetailLabel>
                  </div>
                  <div className="col-7">
                    <OrderDetailValue>
                      {orderDetail.delivery_info}
                    </OrderDetailValue>
                  </div>
                </div>
              )}
              <StyledFlexBox className="mb-2" alignItems="center">
                <div className="col-3">
                  <OrderDetailLabel>運費</OrderDetailLabel>
                </div>
                <div className="col-7">
                  <OrderDetailValue>
                    <StyledFlexBox>
                      {orderDetail.delivery_fee}
                      <StyledFlexBox
                        cursor="pointer"
                        width={52}
                        height={20}
                        border="0.5px solid #26b7bc"
                        bg="#fff"
                        borderRadius="4px"
                        justifyContent="center"
                        alignItems="center"
                        fontSize={11}
                        fontWeight={500}
                        color="#26b7bc"
                        ml="9px"
                        onClick={() => setEditFeeModalOpen(true)}
                      >
                        <StyledImage src="/images/manager/carbon_pen.svg" />
                        編輯
                      </StyledFlexBox>
                    </StyledFlexBox>
                  </OrderDetailValue>
                </div>
              </StyledFlexBox>
            </div>
          </StyledFlexBox>
        </div>
      </div>
      {editFeeModalOpen && (
        <Dialog onClose={closeModal}>
          <DialogContentWrapper className="px-5 py-4 justify-content-between">
            <DialogTitle className="text-primary">編輯運費</DialogTitle>
            <div className="w-75 mb-5 row">
              <div className="col-3">
                <div>運費</div>
              </div>
              <div className="col">
                <StyledInput
                  type="text"
                  className="form-control border-primary"
                  value={editedFee}
                  onChange={(e) =>
                    setEditedFee(e.target.value.replace(/\D+/g, ""))
                  }
                />
              </div>
            </div>
            <div className="mb-3">
              <DialogButton
                className="btn-secondary cancel"
                onClick={closeModal}
              >
                取消
              </DialogButton>
              <DialogButton
                className="btn-primary"
                //  disabled={selectedCompany === '-'}
                onClick={onFeeEdit}
              >
                確認
              </DialogButton>
            </div>
          </DialogContentWrapper>
        </Dialog>
      )}
      {editRemarkModalOpen && (
        <Dialog onClose={closeModal}>
          <DialogContentWrapper className="px-5 py-4 justify-content-between">
            <DialogTitle className="text-primary">編輯平台備註</DialogTitle>
            <div className="w-75 mb-5 row">
              <div className="col-3">
                <div>備註</div>
              </div>
              <div className="col">
                <StyledInput
                  type="textarea"
                  className="form-control border-primary"
                  value={editedRemark}
                  onChange={(e) => setEditedRemark(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3">
              <DialogButton
                className="btn-secondary cancel"
                onClick={() => setEditRemarkOpen(false)}
              >
                取消
              </DialogButton>
              <DialogButton className="btn-primary" onClick={onRemarkEdit}>
                確認
              </DialogButton>
            </div>
          </DialogContentWrapper>
        </Dialog>
      )}
      <StyledFlexBox
        width="100%"
        height="1px"
        border="1px dashed #9b9b9b"
        mb={20}
      />
      <ReceiveInfo
        data={orderDetail.recipient}
        getOrderDetail={getOrderDetail}
      />
      <ContentWrapper>
        <StyledFlexBox
          p="20px 40px"
          justifyContent="space-between"
          bg="#E9F8F8"
        >
          <StyledFlexBox fontWeight={700} fontSize={17} color="#747474">
            訂單狀態
          </StyledFlexBox>
          <StyledFlexBox width={540} justifyContent="space-between">
            <StyledFlexBox>
              <OrderDetailLabel className="fw-bold me-2">
                匯款金額
              </OrderDetailLabel>
              <OrderDetailValue className="fw-bold">
                {numberWithThousandCommas(orderDetail.payAmount)}
              </OrderDetailValue>
            </StyledFlexBox>
            <StyledFlexBox>
              <OrderDetailLabel className="fw-bold me-2">
                匯款後五碼
              </OrderDetailLabel>
              <OrderDetailValue className="fw-bold">
                {orderDetail.fiveNumber}
              </OrderDetailValue>
            </StyledFlexBox>
            <StyledFlexBox>
              <OrderDetailLabel className="fw-bold me-2">
                匯款日期
              </OrderDetailLabel>
              <OrderDetailValue className="fw-bold">
                {orderDetail.payDate?.slice(0, 10)}
              </OrderDetailValue>
            </StyledFlexBox>
          </StyledFlexBox>
        </StyledFlexBox>
        <OrderConfirmationBody>
          <div className="w-100 mx-3">
            <div className="position-relative d-flex justify-content-between align-items-center px-5 mb-3">
              <Dot active={!!orderDetail.payDate} />
              <Line active width={lineWidth()} zIndex={1} />
              <Line width={`calc(100% - 6rem - 25px)`} />
              <Dot active={!!orderDetail.isPaymentDate} />
              <Dot active={!!orderDetail.isSendDate} />
              <Dot active={!!orderDetail.isFinishDate} />
            </div>
            <StyledFlexBox
              className="d-flex justify-content-between align-items-center"
              fontSize={15}
              fontWeight={600}
              color="#747474"
              mb="4px"
            >
              <div>訂單已匯款</div>
              <div>已確認收款</div>
              <div>訂單已寄出</div>
              <div>訂單已完成</div>
            </StyledFlexBox>
            <StyledFlexBox
              className="d-flex justify-content-between align-items-center"
              fontSize={15}
              fontWeight={600}
              color="#747474"
              mb="4px"
            >
              <div style={{ minWidth: 130 }}>
                {orderDetail.payDate?.slice(0, 16)}
              </div>
              <div style={{ minWidth: 130 }}>
                {orderDetail.isPaymentDate?.slice(0, 16)}
              </div>
              <div style={{ minWidth: 130 }}>
                {orderDetail.isSendDate?.slice(0, 16)}
              </div>
              <div style={{ minWidth: 130 }}>
                {orderDetail.isFinishDate?.slice(0, 16)}
              </div>
            </StyledFlexBox>
          </div>
        </OrderConfirmationBody>
      </ContentWrapper>
      <StyledFlexBox className="row">
        <div className="col-6">
          <DetailTitle>公司資訊</DetailTitle>
          <ContentWrapper>
            <ConfirmationStatsWrapper>
              <ConfirmationStats>
                <StatsNumber>
                  {numberWithThousandCommas(
                    orderDetail?.companyCount?.countCost || 0
                  )}
                </StatsNumber>
                <StatsLabel>進價總計</StatsLabel>
              </ConfirmationStats>
              <ConfirmationStats>
                <StatsNumber>
                  {numberWithThousandCommas(
                    orderDetail?.companyCount?.countMyPrice || 0
                  )}
                </StatsNumber>
                <StatsLabel>團購主成本總計</StatsLabel>
              </ConfirmationStats>
              <ConfirmationStats>
                <StatsNumber>
                  {numberWithThousandCommas(
                    orderDetail?.companyCount?.countProfit || 0
                  )}
                </StatsNumber>
                <StatsLabel>利潤總計</StatsLabel>
              </ConfirmationStats>
            </ConfirmationStatsWrapper>
          </ContentWrapper>
        </div>
        <div className="col-6">
          <DetailTitle>小販團資訊</DetailTitle>
          <ContentWrapper>
            <ConfirmationStatsWrapper>
              <ConfirmationStats>
                <StatsNumber>
                  {numberWithThousandCommas(
                    orderDetail?.hawkerFunblocCount?.countCost || 0
                  )}
                </StatsNumber>
                <StatsLabel>成本總計</StatsLabel>
              </ConfirmationStats>
              <ConfirmationStats>
                <StatsNumber>
                  {numberWithThousandCommas(
                    orderDetail?.hawkerFunblocCount?.countMyPrice || 0
                  )}
                </StatsNumber>
                <StatsLabel>總銷售總計</StatsLabel>
              </ConfirmationStats>
              <ConfirmationStats>
                <StatsNumber>
                  {numberWithThousandCommas(
                    orderDetail?.hawkerFunblocCount?.countProfit || 0
                  )}
                </StatsNumber>
                <StatsLabel>利潤總計</StatsLabel>
              </ConfirmationStats>
            </ConfirmationStatsWrapper>
          </ContentWrapper>
        </div>
      </StyledFlexBox>
      <Overview orders={orderDetail.orders} />
      <StyledFlexBox
        fontWeight={600}
        fontSize={15.6}
        color="#26b7bc"
        ml={20}
        mb={12}
      >
        購買人
      </StyledFlexBox>
      {orderDetail.list &&
        Object.entries(orderDetail.list).map(([key, value], index) => (
          <OrderList
            key={key}
            order={value}
            id={key}
            openBuyerDetail={openBuyerDetail}
            orderBuyer={orderBuyers[index]}
            index={index}
            closeBuyerDetail={closeBuyerDetail}
          />
        ))}
      <DownloadOrderButton order={orderDetail} />
      {modal === modalConfirmPayment && shouldOpenModal && (
        <Dialog onClose={closeModal}>
          <DialogContentWrapper>
            <div className="my-5 text-black">
              <div className="fw-bold text-center">即將發送訊息給小販</div>
              <div className="fw-bold text-center">
                請確認確實收到款項再做變更
              </div>
            </div>
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
                onClick={setConfirmPayment}
              >
                確認
              </DialogButton>
            </div>
          </DialogContentWrapper>
        </Dialog>
      )}
      {modal === modalConfirmOrder && shouldOpenModal && (
        <Dialog onClose={closeModal}>
          <DialogContentWrapper>
            <div className="my-5 text-black">
              <div className="fw-bold text-center">
                請確實將訂單提供給廠商再按下確認按鍵
              </div>
            </div>
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
                onClick={setConfirmOrder}
              >
                確認
              </DialogButton>
            </div>
          </DialogContentWrapper>
        </Dialog>
      )}
      {modal === modalCancelOrder && shouldOpenModal && (
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
      )}
      {modal === modalFinishedOrder && shouldOpenModal && (
        <DoneDialog
          closeModal={() => {
            closeModal();
          }}
          text={"訂單已完成"}
        />
      )}
      {modal === modalPaidOrder && shouldOpenModal && (
        <DoneDialog
          closeModal={() => {
            closeModal();
          }}
          text={
            <>
              【訂單編號{orderDetail.num}】
              <br />
              變更為「已收款」
            </>
          }
        />
      )}
      {modal === modalSentOrder && shouldOpenModal && (
        <DoneDialog
          closeModal={() => {
            closeModal();
          }}
          text={
            <>
              【訂單編號{orderDetail.num}】
              <br />
              變更為「已寄出」
            </>
          }
        />
      )}
      {modal === modalCancelledOrder && shouldOpenModal && (
        <CancelledDialog
          closeModal={() => {
            closeModal();
          }}
          text={`【${orderDetail.num}】 已被取消`}
        />
      )}

      {modal === modalFinishOrder && shouldOpenModal && (
        <DoneDialog
          closeModal={() => {
            closeModal();
          }}
          text={
            <>
              【訂單編號{orderDetail.num}】
              <br />
              變更為「已完成」
            </>
          }
        />
      )}
      {modal === modalConfirmedPayment && shouldOpenModal && (
        <DoneDialog closeModal={closeModal} text={"帳務已確認"} />
      )}
      {modal === modalConfirmedOrder && shouldOpenModal && (
        <DoneDialog closeModal={closeModal} text={"訂單已確認"} />
      )}
      {setPaidModal && (
        <Dialog onClose={() => setPaidModalOpen(false)}>
          <DialogContentWrapper>
            <div className="my-3 text-black">
              <div className="fw-bold text-center">訂單確認收款</div>
            </div>
            <StyledFlexBox
              width="70%"
              fontSize={17}
              color="#747474"
              lineHeight="32px"
              mb="8px"
            >
              <StyledFlexBox color="#26b7bc" width={100}>
                匯款金額
              </StyledFlexBox>
              {numberWithThousandCommas(orderDetail.payAmount)}
            </StyledFlexBox>
            <StyledFlexBox
              width="70%"
              fontSize={17}
              color="#747474"
              lineHeight="32px"
              mb="8px"
            >
              <StyledFlexBox color="#26b7bc" width={100}>
                匯款後五碼
              </StyledFlexBox>
              {orderDetail.fiveNumber}
            </StyledFlexBox>
            <StyledFlexBox
              width="70%"
              fontSize={17}
              color="#747474"
              lineHeight="32px"
              mb="42px"
            >
              <StyledFlexBox color="#26b7bc" width={100}>
                匯款日期
              </StyledFlexBox>
              {orderDetail.payDate?.slice(0, 16)}
            </StyledFlexBox>
            <div>
              <DialogButton
                className="btn-secondary cancel"
                onClick={() => setPaidModalOpen(false)}
              >
                取消
              </DialogButton>
              <DialogButton
                className="btn-primary"
                disabled={isLoading}
                onClick={setOrderPaid}
              >
                收款確認
              </DialogButton>
            </div>
          </DialogContentWrapper>
        </Dialog>
      )}
      {setSentModal && (
        <Dialog onClose={() => setSentModalOpen(false)}>
          <DialogContentWrapper>
            <div className="my-3 text-black">
              <div className="fw-bold text-center">訂單出貨確認</div>
            </div>
            <StyledFlexBox
              color="#747474"
              fontSize={15}
              lineHeight="45px"
              textAlign="center"
            >
              廠商已經出貨訂單商品嗎？
            </StyledFlexBox>
            <div>
              <DialogButton
                className="btn-secondary cancel"
                onClick={() => setSentModalOpen(false)}
              >
                取消
              </DialogButton>
              <DialogButton
                className="btn-primary"
                disabled={isLoading}
                onClick={setOrderSent}
              >
                出貨確認
              </DialogButton>
            </div>
          </DialogContentWrapper>
        </Dialog>
      )}
      {setFinishModal && (
        <Dialog onClose={() => setFinishModalOpen(false)}>
          <DialogContentWrapper>
            <div className="my-3 text-black">
              <div className="fw-bold text-center">訂單完成確認</div>
            </div>
            <StyledFlexBox
              color="#747474"
              fontSize={15}
              lineHeight="45px"
              textAlign="center"
            >
              團購主已收到所有訂單商品嗎？
            </StyledFlexBox>
            <div>
              <DialogButton
                className="btn-secondary cancel"
                onClick={() => setSentModalOpen(false)}
              >
                取消
              </DialogButton>
              <DialogButton
                className="btn-primary"
                disabled={isLoading}
                onClick={setOrderFinish}
              >
                訂單完成
              </DialogButton>
            </div>
          </DialogContentWrapper>
        </Dialog>
      )}
    </div>
  );
};

export default OrderDetail;
