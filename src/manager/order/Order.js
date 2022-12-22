import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import {
  CheckButton,
  NavButton,
  PaginationWrapper,
  SearchIcon,
  SearchInput,
} from "../../component/StyledComponent";
import { SingleDatePicker } from "../../component/datepicker/DatePicker";
import {
  ActionButton,
  ActionConfirmLabel,
  FastOrderContainer,
  FastOrderLabel,
  FastOrderModalCloseButton,
  StyledDate,
} from "./OrderStyle";
import Table from "../../component/table/Table";
import { Tr } from "../../component/table/TableStyle";
import Pagination from "../components/pagination/Pagination";
import Dialog from "../../component/dialog/Dialog";
import { DialogContentWrapper } from "../../component/dialog/DialogStyle";
import {
  confirmOrder,
  confirmPayment,
  fetchOrder,
  fetchOrders,
} from "../../api/order/ManagerOrder";
import { numberWithThousandCommas } from "../../helper/Helper";
import Loading from "../components/loading/Loading";
import { StyledFlexBox } from "../../styles/Shared.styles";
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
const Order = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [currentStats, setCurrentStats] = useState(orderStatsMap["4"].stats);
  const [pageObject, setPageObject] = useState({
    totalPage: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [shouldOpenModal, setShouldOpenModal] = useState(false);


  const [startDate, setStartDate] = useState(moment().subtract(11, 'month').valueOf());
  const [endDate, setEndDate] = useState(moment().add(1, "month").startOf("month").valueOf());

  const [inputKeyword, setInputKeyword] = useState("");
  const [keyword, setKeyword] = useState("");

  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetail, setOrderDetail] = useState({});

  const onStatsButtonClick = (stats) => {
    setCurrentStats(stats);
    setCurrentPage(1);
  };

  const closeModal = () => {
    setShouldOpenModal(false);
  };

  const ths = [
    "",
    "訂單編號",
    "結團日期",
    "小販名稱",
    "狀態",
    "販團名稱",
    "總金額",
    "查看",
  ];

  const getOrders = useCallback(
    (currentPage, currentStats, keyword, startDate, endDate) => {
      setIsLoading(true);
      setOrders([]);
      fetchOrders({
        pgae: currentPage,
        keyword,
        stats: currentStats,
        startDate,
        endDate,
      })
        .then((res) => {
          setOrders(res.data);
          setPageObject(res.meta);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    []
  );

  const getOrderDetail = useCallback(
    (orderId) => {
      fetchOrder(orderId)
        .then((res) => {
          setOrderDetail(res.data);
          setShouldOpenModal(true);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [setOrderDetail, setShouldOpenModal]
  );

  const setConfirmPayment = () => {
    if (!!orderDetail.isPaymentDate) return;

    setIsLoading(true);
    confirmPayment(selectedOrderId)
      .then(() => {
        const formattedStartDate = moment(startDate).format("YYYY/MM/DD");
        const formattedEndDate = moment(endDate).format("YYYY/MM/DD");

        if (
          formattedStartDate === "Invalid date" ||
          formattedEndDate === "Invalid date"
        )
          return;

        getOrders(
          currentPage,
          currentStats,
          keyword,
          formattedStartDate,
          formattedEndDate
        );
        closeModal();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  };

  const setConfirmOrder = () => {
    if (!!orderDetail.isOrderDate) return;

    setIsLoading(true);
    confirmOrder(selectedOrderId)
      .then(() => {
        const formattedStartDate = moment(startDate).format("YYYY/MM/DD");
        const formattedEndDate = moment(endDate).format("YYYY/MM/DD");

        if (
          formattedStartDate === "Invalid date" ||
          formattedEndDate === "Invalid date"
        )
          return;

        getOrders(
          currentPage,
          currentStats,
          keyword,
          formattedStartDate,
          formattedEndDate
        );
        closeModal();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const formattedStartDate = moment(startDate).format("YYYY/MM/DD");
    const formattedEndDate = moment(endDate).format("YYYY/MM/DD");

    if (
      formattedStartDate === "Invalid date" ||
      formattedEndDate === "Invalid date"
    )
      return;

    getOrders(
      currentPage,
      currentStats,
      keyword,
      formattedStartDate,
      formattedEndDate
    );
  }, [currentPage, currentStats, keyword, startDate, endDate]);

  useEffect(() => {
    if (selectedOrderId) {
      getOrderDetail(selectedOrderId);
    }
  }, [getOrderDetail, selectedOrderId]);

  return (
    <div className="container-fluid p-5">
      <div className="d-flex justify-content-between">
        <nav className="nav">
          <NavButton
            className={`nav-link ${currentStats === orderStatsMap["4"].stats ? "active" : ""
              }`}
            onClick={() => onStatsButtonClick(orderStatsMap["4"].stats)}
          >
            已匯款
          </NavButton>
          <NavButton
            className={`nav-link ${currentStats === orderStatsMap["5"].stats ? "active" : ""
              }`}
            onClick={() => onStatsButtonClick(orderStatsMap["5"].stats)}
          >
            已收款
          </NavButton>
          <NavButton
            className={`nav-link ${currentStats === orderStatsMap["6"].stats ? "active" : ""
              }`}
            onClick={() => onStatsButtonClick(orderStatsMap["6"].stats)}
          >
            已寄出
          </NavButton>
          <NavButton
            className={`nav-link ${currentStats === orderStatsMap["3"].stats ? "active" : ""
              }`}
            onClick={() => onStatsButtonClick(orderStatsMap["3"].stats)}
          >
            已完成
          </NavButton>
          <NavButton
            className={`nav-link ${currentStats === orderStatsMap["0"].stats ? "active" : ""
              }`}
            onClick={() => onStatsButtonClick(orderStatsMap["0"].stats)}
          >
            已取消
          </NavButton>
        </nav>
      </div>

      <div className="row mt-5 mb-4 align-items-center">
        <div className="col-2 d-flex align-items-center">
          <div className="my-4 d-flex">
            <StyledDate>
              <i className="bi bi-calendar text-primary" />
              <SingleDatePicker startDate={startDate} setStartDate={setStartDate} />
            </StyledDate>
            <StyledDate>
              <i className="bi bi-calendar text-primary" />
              <SingleDatePicker startDate={endDate} setStartDate={setEndDate} />
            </StyledDate>
          </div>
        </div>
        <div className="ms-auto col-2 position-relative">
          <SearchInput
            type="text"
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            placeholder="關鍵字搜尋..."
          />
          <SearchIcon onClick={() => setKeyword(inputKeyword)}>
            <i className="bi bi-search" />
          </SearchIcon>
        </div>
      </div>

      <Table ths={ths}>
        {orders.length > 0 ? (
          orders.map((order) => {
            return (
              <Tr key={order.id}>
                <td>
                  {order.isRead === 0 && (
                    <StyledFlexBox
                      bg="#db5f5f"
                      width="8px"
                      minWidth="8px"
                      height="8px"
                      borderRadius="50%"
                      mx="auto"
                    />
                  )}
                </td>
                <td>{order.num}</td>
                <td>{moment(order.checkoutDate).format("YYYY-MM-DD")}</td>
                <td>{order.hawkerName}</td>
                <td>
                  <div>{orderStatsMap[order.stats].text}</div>
                </td>
                <td>{order.funblocName}</td>
                {console.log(order)}
                <td>{numberWithThousandCommas(order.totalMoney)}</td>
                <td>
                  <CheckButton
                    className="btn btn-success rounded-pill border-0 px-4"
                    to={`/manager/order/detail/${order.id}`}
                  >
                    查看
                  </CheckButton>
                </td>
              </Tr>
            );
          })
        ) : (
          <Tr>
            <td colSpan={ths.length}>{isLoading ? <Loading /> : "無資料"}</td>
          </Tr>
        )}
      </Table>
      <PaginationWrapper>
        <Pagination
          pageObject={pageObject}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </PaginationWrapper>

      {shouldOpenModal && (
        <Dialog onClose={closeModal}>
          <DialogContentWrapper className="px-5" width={700} height={478}>
            <FastOrderContainer>
              <FastOrderModalCloseButton onClick={closeModal}>
                <i className="bi bi-x-lg" />
              </FastOrderModalCloseButton>
              <div className="row mb-3">
                <FastOrderLabel>訂單編號</FastOrderLabel>
                <div className="col">{orderDetail.num}</div>
              </div>
              <div className="row mb-3">
                <FastOrderLabel>小販名稱</FastOrderLabel>
                <div className="col">{orderDetail.hawkerName}</div>
              </div>
              <div className="row mb-3">
                <FastOrderLabel>販團名稱</FastOrderLabel>
                <div className="col">{orderDetail.funblocName}</div>
              </div>
              <div
                className="border rounded border-primary mt-4 py-4"
                style={{ backgroundColor: "#E9F8F8" }}
              >
                <div className="text-primary text-center mb-4">
                  匯款後五碼 : {orderDetail.fiveNumber}
                </div>
                <div className="d-flex justify-content-center">
                  <div className="mx-5">
                    <ActionConfirmLabel>帳務確認中</ActionConfirmLabel>
                    <div>
                      <ActionButton
                        confirmed={!!orderDetail.isPaymentDate}
                        onClick={setConfirmPayment}
                      >
                        帳務已確認
                      </ActionButton>
                    </div>
                  </div>
                  <div className="mx-5">
                    <ActionConfirmLabel className="text-center">
                      訂單確認中
                    </ActionConfirmLabel>
                    <div>
                      <ActionButton
                        confirmed={!!orderDetail.isOrderDate}
                        onClick={setConfirmOrder}
                      >
                        訂單已確認
                      </ActionButton>
                    </div>
                  </div>
                </div>
              </div>
            </FastOrderContainer>
          </DialogContentWrapper>
        </Dialog>
      )}
    </div>
  );
};

export default Order;
