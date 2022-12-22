import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";
import { fetchOrderDetail } from "../../../api/order/Order";
import {
  BackButton,
  CloseButton,
  SummaryName,
  SummaryTable,
} from "./FunblocSummaryStyle";
import { MonthRangePicker } from "../../../component/datepicker/DatePicker";
import { StyledDate } from "../../../manager/hawker/new/NewHawkerStyle";
import moment from "moment";
import { SearchIcon, SearchInput } from "../../../component/StyledComponent";
import {
  TableWrapper,
  Th,
  TheadTr,
  Tr,
} from "../../../component/table/TableStyle";
import { numberWithThousandCommas } from "../../../helper/Helper";
import {
  StyledFlexBox,
  StyledImage,
  StyledText,
} from "../../../styles/Shared.styles";
import { DialogContentWrapper } from "../../../component/dialog/DialogStyle";
import Dialog from "../../../component/dialog/Dialog";

const LABELS = [
  { text: "成本總計", value: "totalCost" },
  { text: "銷售額總計", value: "totalMyPrice" },
  { text: "利潤總計", value: "totalProfit" },
];
const FunblocSummary = () => {
  const navigate = useNavigate();
  const { funblocId } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const [dateRange, setDateRange] = useState([
    moment().startOf("month").valueOf(),
    moment().add(1, "month").startOf("month").valueOf(),
  ]);

  const [inputKeyword, setInputKeyword] = useState("");

  const [orderDetail, setOrderDetail] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const onModalClose = () => {
    setModalOpen(false);
    setModalData({});
  };
  const onBuyerModalOpen = (detail) => {
    setModalOpen(true);
    setModalData(detail);
  };

  const getData = useCallback((startDate, endDate) => {
    setIsLoading(true);

    fetchOrderDetail(funblocId)
      .then((orderDetail) => {
        setOrderDetail({
          ...orderDetail.data,
          products: orderDetail.data.products.filter(
            (product) => product.myPrice > 0
          ), // my price <= 0 不顯示
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const [startDate, endDate] = dateRange;
    const formattedStartDate = moment(startDate).format("YYYY/MM/DD");
    const formattedEndDate = moment(endDate).format("YYYY/MM/DD");

    if (
      formattedStartDate !== "Invalid date" &&
      formattedEndDate !== "Invalid date"
    ) {
      getData(formattedStartDate, formattedEndDate);
    }
  }, [getData, dateRange]);

  if (orderDetail === null) return null;

  return (
    <StyledFlexBox
      className="container-fluid pt-3 pb-5"
      px={[10, 20]}
      flexDirection="column"
    >
      <StyledFlexBox alignItems="center" mb={13}>
        <StyledFlexBox
          width={[44, 64]}
          height={[32, 44]}
          borderRadius="7.8px"
          justifyContent="center"
          alignItems="center"
          bg="#26b7bc"
          mr="20px"
          position={["relative", "relative"]}
          left={["unset"]}
          onClick={() => navigate(-1)}
          cursor="pointer"
        >
          <StyledImage src="/images/front-end/arrow-back.svg" />
        </StyledFlexBox>
        <StyledFlexBox
          textAlign={["center", "start"]}
          color="#26b7bc"
          fontSize={25}
          fontWeight={600}
        >
          訂購總覽
        </StyledFlexBox>
      </StyledFlexBox>
      <StyledFlexBox
        flexDirection={["column", "row"]}
        mb={21}
        alignItems={["center", "unset", "flex-end"]}
        justifyContent={["unset", "unset", "space-between"]}
      >
        <StyledFlexBox>
          <StyledFlexBox
            width={[253, 495]}
            height={[308, 142]}
            alignItems="center"
            border="0.5px solid #26b7bc"
            borderRadius="9px"
            flexDirection={["column", "row"]}
            bg="#fff"
            justifyContent={["space-evenly"]}
          >
            {LABELS.map((item, index) => (
              <Fragment key={item.text}>
                {index !== 0 && (
                  <StyledFlexBox
                    width={[220, "1px"]}
                    height={["1px", 56]}
                    bg="#AEAEAE"
                  />
                )}
                <StyledFlexBox flexDirection="column" alignItems="center">
                  <StyledFlexBox alignItems="baseline" mb={9}>
                    <StyledFlexBox
                      color="#747474"
                      fontWeight={700}
                      fontSize={23.6}
                    >
                      {orderDetail.listTotal[item.value]}
                    </StyledFlexBox>
                    <StyledFlexBox
                      color="#747474"
                      fontWeight={700}
                      fontSize={14}
                    >
                      元
                    </StyledFlexBox>
                  </StyledFlexBox>
                  <StyledFlexBox
                    color="#26B7BC"
                    fontWeight={400}
                    fontSize={12.6}
                  >
                    {item.text}
                  </StyledFlexBox>
                </StyledFlexBox>
              </Fragment>
            ))}
          </StyledFlexBox>
          <StyledFlexBox
            width={[249, 129]}
            height={[92, 142]}
            alignItems="center"
            border="0.5px solid #26b7bc"
            borderRadius="9px"
            flexDirection={["column", "row"]}
            bg="#fff"
            justifyContent={["space-evenly"]}
            ml={[0, 20]}
            mt={[20, 0]}
          >
            <StyledFlexBox flexDirection="column" alignItems="center">
              <StyledFlexBox alignItems="baseline" mb={9}>
                <StyledFlexBox color="#747474" fontWeight={700} fontSize={23.6}>
                  {orderDetail.listTotal?.totalPeople}
                </StyledFlexBox>
                <StyledFlexBox color="#747474" fontWeight={700} fontSize={14}>
                  人
                </StyledFlexBox>
              </StyledFlexBox>
              <StyledFlexBox color="#26B7BC" fontWeight={400} fontSize={12.6}>
                買家數量
              </StyledFlexBox>
            </StyledFlexBox>
          </StyledFlexBox>
        </StyledFlexBox>
        <StyledFlexBox display={["none", "none", "flex"]} height={201}>
          <StyledImage src="/images/front-end/img_money.png" />
        </StyledFlexBox>
      </StyledFlexBox>
      <TableWrapper overflow="auto">
        <SummaryTable>
          <thead>
            <TheadTr className="text-primary">
              <Th className="border-bottom border-primary">
                <StyledFlexBox
                  color="#26B7BC"
                  minWidth={72}
                  justifyContent="center"
                >
                  買家
                </StyledFlexBox>
              </Th>
              <Th className="border-bottom border-primary">成本小計</Th>
              <Th className="border-bottom border-primary">銷售小計</Th>
              {orderDetail.products.map((product) => (
                <th
                  key={product.productId}
                  className="border-bottom border-primary"
                >
                  {product.name}
                </th>
              ))}
            </TheadTr>
            <Tr>
              <th
                className="fw-bolder border-bottom border-primary"
                style={{ background: "#E6E6E6" }}
              >
                商品進價(元)
              </th>
              <th
                className="fw-bolder border-bottom border-primary"
                style={{ background: "#E6E6E6" }}
              />
              <th
                className="fw-bolder border-bottom border-primary"
                style={{ background: "#E6E6E6" }}
              />
              <StyledFlexBox display="contents">
                {orderDetail.products.map((product) => (
                  <th
                    key={_.uniqueId("quote")}
                    className="border-bottom border-primary"
                  >
                    {numberWithThousandCommas(product.quote)}
                  </th>
                ))}
              </StyledFlexBox>
            </Tr>
            <Tr>
              <th
                className="fw-bolder border-bottom border-primary"
                style={{ background: "#E6E6E6" }}
              >
                我的售價(元)
              </th>
              <th
                className="fw-bolder border-bottom border-primary"
                style={{ background: "#E6E6E6" }}
              />
              <th
                className="fw-bolder border-bottom border-primary"
                style={{ background: "#E6E6E6" }}
              />
              {orderDetail.products.map((product) => (
                <th
                  key={_.uniqueId("my-price")}
                  className="border-bottom border-primary"
                >
                  {numberWithThousandCommas(product.myPrice)}
                </th>
              ))}
            </Tr>
          </thead>
          <tbody>
            {Object.entries(orderDetail.list).map(([funblocId, order]) => {
              return (
                <Tr key={_.uniqueId("list-order")}>
                  <td className="fw-bolder">{order.orderName}</td>
                  <td>
                    {numberWithThousandCommas(order.orderCount.countCost)}
                  </td>
                  <td>
                    {numberWithThousandCommas(order.orderCount.countMyPrice)}
                  </td>
                  {orderDetail.products.map((product) => {
                    const obj = _.find(
                      orderDetail.list[funblocId].orderProducts,
                      ["productId", product.productId]
                    );
                    return (
                      <td key={_.uniqueId("order")}>
                        {numberWithThousandCommas(obj?.amount || 0)}
                      </td>
                    );
                  })}
                </Tr>
              );
            })}
          </tbody>
        </SummaryTable>
      </TableWrapper>
    </StyledFlexBox>
  );
};

export default FunblocSummary;
