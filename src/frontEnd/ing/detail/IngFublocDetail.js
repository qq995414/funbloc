import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ContentWrapper } from "../../../component/StyledComponent";
import {
  AddNewOrderButton,
  ArrowButton,
  CancelButton,
  DeliveryWrapper,
  DetailTitleWrapper,
  DetailWrapper,
  Divider,
  EndFunblocButton,
  InfoWrapper,
  Order,
  OrderDetailWrapper,
  OrderWrapper,
} from "./FublocDetailStyle";
import { useNavigate, useParams } from "react-router-dom";
import { DefaultImgWrapper, OpenImgWrapper } from "../../open/OpenStyle";
import { numberWithThousandCommas } from "../../../helper/Helper";
import { funblocConditionType } from "../../../manager/funbloc/Funbloc";
import { fetchOrderDetail, fetchOrders } from "../../../api/order/Order";
import {
  cancelFunbloc,
  checkoutFunbloc,
  fetchFunbloc,
} from "../../../api/funbloc/Funbloc";
import {
  fetchCommonAddresses,
  fetchFamiliarHawkers,
} from "../../../api/hawker/Hawker";
import SubViewEditBuyerLayout, { PAYMENT, PAY_STATUS } from "./edit/EditBuyer";
import SubViewBuyerLayout from "./create/CreateNewBuyer";
import BeforeCheckoutDialog from "../../components/beforeCheckoutDialog/BeforeCheckoutDialog";
import {
  DialogButton,
  DialogContentWrapper,
  DialogTitle,
} from "../../../component/dialog/DialogStyle";
import Dialog from "../../../component/dialog/Dialog";
import {
  StyledButton,
  StyledFlexBox,
  StyledImage,
} from "../../../styles/Shared.styles";
import { StyledTextarea } from "../../../manager/hawker/new/NewHawkerStyle";

const defaultImg = "/images/front-end/upload_file.png";

const subViewDetail = "detail";
const subViewNewBuyer = "new";
const subViewEditBuyer = "edit";
const modalCheckout = "checkout-modal";
const modalCancel = "cancel";

const IngFublocDetail = () => {
  const navigate = useNavigate();
  const { funblocId } = useParams();

  const [modal, setModal] = useState(null);
  const [shouldModalOpen, setShouldModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [subView, setSubView] = useState(subViewDetail);

  const [detail, setDetail] = useState({});
  const [orderBuyers, setOrderBuyers] = useState([]);
  const [orderListTotal, setOrderListTotal] = useState({});
  const [orderCondition, setOrderCondition] = useState([]);
  const [orderDetail, setOrderDetail] = useState({});
  const [familiarHawkers, setFamiliarHawkers] = useState([]);
  const [commonAddresses, setCommonAddresses] = useState([]);

  const [cancelReason, setCancelReason] = useState("");

  const [editBuyerObject, setEditBuyerObject] = useState({});

  const closeModal = () => {
    setModal(null);
    setShouldModalOpen(false);
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

  const checkout = ({ data, openFiveModal = false }) => {
    const payload = { funblocId, data };
    checkoutFunbloc(payload)
      .then((res) => {
        const state = {
          ...res.data,
          funblocId,
          total: detail.totalCost,
          condition: `${orderCondition.condition_amount} /
          ${orderCondition.condition_number}(
            ${orderCondition.condition_unit})`,
          deliveryInfo: detail.delivery_info,
          ...(openFiveModal && { modal: "five", shouldModalOpen: true }),
        };
        navigate(`/ing/checkout`, { state: state });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const cancel = () => {
    cancelFunbloc({ funblocId, reason: cancelReason })
      .then(() => {
        navigate(`/ing `, { replace: true });
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
      .then(
        ([detail, orders, orderDetail, familiarHawkers, commonAddresses]) => {
          setDetail(detail.data);
          setOrderBuyers(
            orders.data.buyer.map((buyer) => ({ ...buyer, isOpen: false }))
          );
          setOrderListTotal(orders.data.listTotal);
          setOrderCondition(orders.data.condition);
          setOrderDetail(orderDetail.data);
          setFamiliarHawkers(familiarHawkers.data);
          setCommonAddresses(commonAddresses.data);
        }
      )
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [funblocId]);

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
            <StyledFlexBox
              alignItems="center"
              flexDirection={["column", "row"]}
              mb={[15, 0]}
            >
              <StyledFlexBox flexDirection="column" width={["100%"]}>
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
                        onClick={() => navigate(`/ing`)}
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
                      width={[150, 150, 300]}
                      fontWeight={500}
                      flexDirection={["column", "column", "row"]}
                    >
                      <StyledFlexBox fontSize={12} color="#747474">
                        開團日期 {detail.createAt?.slice(0, 10)}
                      </StyledFlexBox>
                      <StyledFlexBox
                        fontSize={12}
                        color="#747474"
                        display={["none", "none", "flex"]}
                      >
                        ｜
                      </StyledFlexBox>
                      <StyledFlexBox fontSize={12} color="#747474">
                        團購截止時間 {detail.end_date?.slice(0, 10)}
                      </StyledFlexBox>
                    </StyledFlexBox>
                  </StyledFlexBox>
                </DetailTitleWrapper>
              </StyledFlexBox>
            </StyledFlexBox>
            <StyledFlexBox
              flexDirection={["column", "column", "row"]}
              justifyContent={["center", "center", "space-around"]}
            >
              <StyledFlexBox
                flexDirection={["column", "row"]}
                width={["100%", "100%", "70%"]}
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
              <StyledFlexBox
                display={["none", "none", "block"]}
                width="1px"
                height={149}
                bg="#26b7bc"
              />
              <StyledFlexBox className="d-flex flex-column justify-content-evenly">
                <InfoWrapper flexDirection="column" width={["100%", 232, 189]}>
                  <EndFunblocButton
                    color="#fff"
                    disabled={isLoading || orderBuyers.length < 1}
                    style={{
                      ...((isLoading || orderBuyers.length < 1) && {
                        background: "#e6e6e6",
                        color: "#fff",
                      }),
                    }}
                    onClick={() => {
                      setModal(modalCheckout);
                      setShouldModalOpen(true);
                    }}
                  >
                    立即結團
                  </EndFunblocButton>
                  <CancelButton
                    disabled={isLoading}
                    onClick={() => {
                      setModal("cancel");
                      setShouldModalOpen(true);
                    }}
                  >
                    取消團購
                  </CancelButton>
                  <StyledFlexBox
                    color={reachedGoal.isReached ? "#48C97C" : "#747474"}
                    fontSize={15}
                    fontWeight={700}
                    justifyContent="center"
                  >
                    成團條件：{orderCondition.condition_type === 0 ? orderCondition.condition_amount:orderListTotal.totalSalesFigures}/
                    {orderCondition.condition_number}(
                    {orderCondition.condition_unit})
                    {reachedGoal.isReached && (
                      <StyledImage
                        src="/images/front-end/icon_open_reach.svg"
                        ml="4px"
                      />
                    )}
                  </StyledFlexBox>
                </InfoWrapper>
              </StyledFlexBox>
            </StyledFlexBox>
          </StyledFlexBox>

          <Divider />
          <OrderWrapper px={[20, 40]}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              {subView === subViewDetail && (
                <>
                  <AddNewOrderButton
                    disabled={isLoading}
                    onClick={() => setSubView(subViewNewBuyer)}
                  >
                    <i className="bi bi-plus-circle-fill me-2" />
                    <span>新增購買人</span>
                  </AddNewOrderButton>
                  <button
                    className="btn btn-outline-primary px-4"
                    onClick={() =>
                      openBuyerDetail(orderBuyers.map((buyer) => buyer.id))
                    }
                  >
                    全部展開
                  </button>
                </>
              )}
            </div>
            {subView === subViewDetail &&
              orderBuyers.length > 0 &&
              orderBuyers.map((buyer) => {
                return (
                  <Order
                    key={buyer.id}
                    justifyContent="space-around"
                    flexDirection={["column", "column", "column"]}
                    alignItems={["initial", "initial", "center"]}
                    px={[20, 24]}
                  >
                    <StyledFlexBox
                      flexDirection={["column", "column", "row"]}
                      justifyContent="space-around"
                      width="100%"
                    >
                      <StyledFlexBox
                        justifyContent="space-between"
                        width={["100%", 185, 210]}
                        alignItems="center"
                      >
                        <div>
                          <button
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
                          </button>
                        </div>
                        <div>
                          <div className="name">購買人：{buyer.orderName}</div>
                        </div>
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
                            <span className="label text-primary">
                              {buyer.payType === "現金" ? "付款" : "匯款"}狀態
                            </span>
                            <span className="ms-2">
                              {buyer.payStatus === PAY_STATUS.paid ||
                              buyer.payStatus === PAYMENT.cash.paid ? (
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
                            justifyContent="center"
                          >
                            進價總額
                          </StyledFlexBox>
                          <StyledFlexBox
                            className="col text-primary"
                            justifyContent="center"
                          >
                            我的售價總額
                          </StyledFlexBox>
                        </div>
                        {orderDetail?.list[buyer.id].orderProducts.length >
                        0 ? (
                          orderDetail?.list[buyer.id].orderProducts
                            .filter((product) => product.amount > 0)
                            .map((product) => {
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
                            })
                        ) : (
                          <div className="row py-2 body">
                            <div>無資料</div>
                          </div>
                        )}
                        <Divider />
                        <DeliveryWrapper>
                          <StyledFlexBox flexDirection={["column", "row"]}>
                            <StyledFlexBox
                              className="ps-4 label text-primary"
                              width={["100%", "20%"]}
                            >
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

            {subView === subViewNewBuyer && (
              <SubViewBuyerLayout
                funblocId={funblocId}
                onBuyerCreated={() => {
                  setSubView(subViewDetail);
                  getData();
                }}
                products={detail.products}
                commonAddresses={commonAddresses}
                cancelEdit={() => setSubView(subViewDetail)}
              />
            )}

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
                cancelEdit={() => setSubView(subViewDetail)}
              />
            )}
          </OrderWrapper>
        </DetailWrapper>
      </ContentWrapper>

      {modal === modalCheckout && shouldModalOpen && (
        <BeforeCheckoutDialog
          name={detail.funblocName}
          num={detail.num}
          totalCost={detail.totalCost}
          onConfirm={checkout}
          onCancel={closeModal}
          deliveryInfo={detail.delivery_info}
          condition={detail.condition_type ===0 ?`${detail.condition_amount} / ${detail.condition_number}(${detail.condition_unit})` :`${detail.totalSalesFigures} / ${detail.condition_number}(${detail.condition_unit})`}
        />
      )}

      {modal === modalCancel && shouldModalOpen && (
        <Dialog onClose={closeModal}>
          <DialogContentWrapper className="p-3" width={488} height={535}>
            <DialogTitle className="mb-1">確定取消團購？</DialogTitle>
            <StyledFlexBox
              fontSize={15}
              color="#747474"
              justifyContent="center"
              mb={26}
            >
              取消團購需要自行向購買人退款
            </StyledFlexBox>
            <StyledTextarea
              width={401}
              height={201}
              type="text"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              mb={62}
              placeholder="在此輸入訂單取消的原因...."
            />
            <div>
              <DialogButton
                className="btn-secondary cancel"
                onClick={closeModal}
              >
                取消
              </DialogButton>
              <DialogButton
                className="btn-danger"
                disabled={isLoading}
                onClick={cancel}
              >
                確認
              </DialogButton>
            </div>
          </DialogContentWrapper>
        </Dialog>
      )}
    </div>
  );
};

export default IngFublocDetail;
