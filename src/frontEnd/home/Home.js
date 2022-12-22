import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  CheckDetailButton,
  CheckoutButton,
  HomeTitle,
  LinkButton,
  Message,
  MessageButtonWrapper,
  MessageContent,
  MessageTime,
  MessageTitle,
  MessageWrapper,
  MoreButton,
  OpenButton,
  QuickSummaryTitle,
  QuickSummaryValue,
  QuickSummaryWrapper,
  StyledTd,
} from "./HomeStyle";
import { StyledDate } from "../../manager/home/HomeStyle";
import {  SingleDatePicker } from "../../component/datepicker/DatePicker";
import { ContentWrapper } from "../../component/StyledComponent";
import Table from "../../component/table/Table";
import { Tr } from "../../component/table/TableStyle";
import { fetchDashboard } from "../../api/dashboard/Dashboard";
import { numberWithThousandCommas } from "../../helper/Helper";
import Loading from "../../manager/components/loading/Loading";
import { fetchMessages } from "../../api/message/Message";
import { titleToClass } from "../message/Message";
import _ from "lodash";
import { StyledFlexBox } from "../../styles/Shared.styles";

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  /* const [dateRange, setDateRange] = useState([
     moment().startOf("month").valueOf(),
     moment().add(1, "month").startOf("month").valueOf(),
   ]);*/

  const [startDate, setStartDate] = useState(moment().subtract(11, 'month').valueOf());
  const [endDate, setEndDate] = useState(moment().add(1, "month").startOf("month").valueOf());


  const [dashboard, setDashboard] = useState({});
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const formattedStartDate = moment(startDate).format("YYYY/MM/DD");
    const formattedEndDate = moment(endDate).format("YYYY/MM/DD");

    if (
      formattedStartDate === "Invalid date" ||
      formattedEndDate === "Invalid date"
    )
      return;

    setIsLoading(true);

    Promise.all([
      fetchDashboard(formattedStartDate, formattedEndDate),
      fetchMessages({ page: 1 }),
    ])
      .then(([_dashboard, _messages]) => {
        setDashboard(_dashboard.data);
        setMessages(_messages.data.slice(0, 5));
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [startDate, endDate]);

  if (isLoading)
    return (
      <div className="text-center mt-5 mx-auto">
        <Loading />
      </div>
    );

  return (
    <StyledFlexBox
      flexDirection="column"
      ml={["48px", "48px", 36]}
      width="100%"
      pt={[40, "unset"]}
    >
      <HomeTitle>一起揪團賺外快</HomeTitle>
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
      <StyledFlexBox width={["100%", "100%", 1148]}>
        <StyledFlexBox flexDirection="column" width="100%">
          <ContentWrapper className="mb-3">
            <QuickSummaryWrapper height={[84, 135, 195]}>
              <StyledFlexBox
                flexDirection={["column", "column", "row"]}
                alignItems={["initial", "initial", "center"]}
              >
                <QuickSummaryTitle fontSize={[]}>營業額</QuickSummaryTitle>
                <QuickSummaryValue fontSize={[20, 34]}>
                  ${numberWithThousandCommas(dashboard.count.quoteTotal)}
                </QuickSummaryValue>
              </StyledFlexBox>
              <StyledFlexBox
                flexDirection={["column", "column", "row"]}
                alignItems={["initial", "initial", "center"]}
              >
                <QuickSummaryTitle>商品收入(利潤)</QuickSummaryTitle>
                <QuickSummaryValue fontSize={[20, 34]}>
                  ${numberWithThousandCommas(dashboard.count.totalProfit)}
                </QuickSummaryValue>
              </StyledFlexBox>
            </QuickSummaryWrapper>
          </ContentWrapper>

          <HomeTitle>開團中</HomeTitle>
          <Table
            ths={[
              "開團日期",
              "小販團編號",
              "名稱",
              "應付總額",
              "我的總銷售額",
              "我賺取的差額",
              "查看狀態",
            ]}
            wrapperStyle={{ overflowX: ["scroll", "scroll", "initial"] }}
          >
            {dashboard.topOpen.map((open) => (
              <Tr key={open.id}>
                <StyledTd px={10}>{open.createAt}</StyledTd>
                <StyledTd>{open.num}</StyledTd>
                <StyledTd>{open.funblocName}</StyledTd>
                <StyledTd>{numberWithThousandCommas(open.quoteTotal)}</StyledTd>
                <StyledTd>
                  {numberWithThousandCommas(open.myPriceTotal)}
                </StyledTd>
                <StyledTd>
                  {numberWithThousandCommas(
                    open.myPriceTotal - open.quoteTotal
                  )}
                </StyledTd>
                <StyledTd>
                  <CheckDetailButton
                    onClick={() => navigate(`/ing/${open.id}`)}
                  >
                    查看
                  </CheckDetailButton>
                </StyledTd>
              </Tr>
            ))}
          </Table>

          <br />

          <HomeTitle>近期結團</HomeTitle>
          <Table
            ths={[
              "開團日期",
              "小販團編號",
              "名稱",
              "應付總額",
              "我的總銷售額",
              "我賺取的差額",
              "再次開團",
            ]}
            wrapperStyle={{ overflowX: ["scroll", "scroll", "initial"] }}
          >
            {dashboard.topCheckout.map((checkout) => (
              <Tr key={checkout.id}>
                <StyledTd>{checkout.createAt}</StyledTd>
                <StyledTd>{checkout.num}</StyledTd>
                <StyledTd>{checkout.funblocName}</StyledTd>
                <StyledTd>
                  {numberWithThousandCommas(checkout.quoteTotal)}
                </StyledTd>
                <StyledTd>
                  {numberWithThousandCommas(checkout.myPriceTotal)}
                </StyledTd>
                <StyledTd>
                  {numberWithThousandCommas(
                    checkout.myPriceTotal - checkout.quoteTotal
                  )}
                </StyledTd>
                <StyledTd>
                  <CheckoutButton
                    onClick={() => navigate(`/open/${checkout.funblocId}`)}
                  >
                    <i className="bi bi-cart" />
                  </CheckoutButton>
                </StyledTd>
              </Tr>
            ))}
          </Table>
        </StyledFlexBox>
        <StyledFlexBox
          className="col-4"
          display={["none", "none", "block"]}
          ml={23}
        >
          <ContentWrapper>
            <MessageWrapper>
              {messages.map((message) => {
                const findTitleObject = _.find(
                  Object.values(titleToClass),
                  function (title) {
                    return title.text === message.title;
                  }
                );

                return (
                  <Message key={message.id}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <MessageTitle className={findTitleObject?.color}>
                        {message.title}
                      </MessageTitle>
                      <MessageTime>{message.showTime}</MessageTime>
                    </div>
                    <MessageContent
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                  </Message>
                );
              })}
            </MessageWrapper>
            <MessageButtonWrapper>
              <LinkButton to="/message">前往通知頁面瀏覽更多訊息 >></LinkButton>
            </MessageButtonWrapper>
          </ContentWrapper>
        </StyledFlexBox>
      </StyledFlexBox>
    </StyledFlexBox>
  );
};

export default Home;
