import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  PaginationWrapper,
  SearchIcon,
  SearchInput,
} from "../../component/StyledComponent";
import Pagination from "../../manager/components/pagination/Pagination";
import { StyledDate } from "../../manager/home/HomeStyle";
import { SingleDatePicker } from "../../component/datepicker/DatePicker";
import Table from "../../component/table/Table";
import { Tr } from "../../component/table/TableStyle";
import { CheckDetailButton, StyledTd } from "../ing/IngStyle";
import Loading from "../../manager/components/loading/Loading";
import { fetchFunblocs } from "../../api/funbloc/Funbloc";
import { numberWithThousandCommas } from "../../helper/Helper";
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

const defaultImg = "/images/front-end/upload_file.png";

const End = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);

  const [startDate, setStartDate] = useState(moment().subtract(11, 'month').valueOf());
  const [endDate, setEndDate] = useState(moment().add(1, "month").startOf("month").valueOf());


  const [inputKeyword, setInputKeyword] = useState("");
  const [keyword, setKeyword] = useState("");

  const [pageObject, setPageObject] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const [ings, setIngs] = useState([]);

  const [payStatus, setPayStatus] = useState([]);

  const ths = [
    "結團日期",
    "小販團編號",
    "開團名稱",
    "總銷售金額",
    "總訂購人數",
    "狀態",
    "操作",
  ];

  useEffect(() => {
    const formattedStartDate = moment(startDate).format("YYYY/MM/DD");
    const formattedEndDate = moment(endDate).format("YYYY/MM/DD");

    if (
      formattedStartDate === "Invalid date" ||
      formattedEndDate === "Invalid date"
    )
      return;

    setIsLoading(true);
    fetchFunblocs({
      stats: "0,2,3,4,5,6",
      page: currentPage,
      keyword,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    })
      .then((res) => {
        setIngs(res.data);
        setPageObject(res.meta);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentPage, keyword, startDate, endDate]);

  return (
    <StyledFlexBox
      className="container-fluid pb-5"
      flexDirection="column"
      px={["12px", "12px", 50]}
    >
      <StyledFlexBox
        className="align-items-center mt-5 mb-4"
        flexDirection={["column", "row"]}
        justifyContent={["unset", "space-between"]}
      >
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
        <StyledFlexBox
          className="position-relative"
          mt={[12, 0]}
          width={["100%", "unset"]}
        >
          <SearchInput
            type="text"
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            placeholder="關鍵字搜尋..."
          />
          <SearchIcon onClick={() => setKeyword(inputKeyword)}>
            <i className="bi bi-search" />
          </SearchIcon>
        </StyledFlexBox>
      </StyledFlexBox>
      <Table ths={ths} wrapperStyle={{ overflow: "auto" }}>
        {ings.length > 0 ? (
          ings.map((end) => {
            const status =
              end.stats === 2 && !end.isPaymentDate
                ? "未匯款"
                : orderStatsMap[end.stats].text;

            return (
              <Tr key={end.id}>
                <StyledTd>{end.checkoutDate?.slice(0, 16)}</StyledTd>
                <StyledTd>{end.num}</StyledTd>
                <StyledTd>{end.funblocName}</StyledTd>
                <StyledTd>
                  {numberWithThousandCommas(end.totalSalesFigures * 1)}
                </StyledTd>
                <StyledTd>
                  {numberWithThousandCommas(end.totalPeople * 1)}
                </StyledTd>
                <StyledTd
                  className={`${status === "未匯款" ? "text-danger" : ""}`}
                >
                  {status}
                </StyledTd>
                <StyledTd>
                  <CheckDetailButton onClick={() => navigate(`/end/${end.id}`)}>
                    查看
                  </CheckDetailButton>
                </StyledTd>
              </Tr>
            );
          })
        ) : (
          <Tr>
            <StyledTd colSpan={ths.length}>
              {isLoading ? <Loading /> : "無資料"}
            </StyledTd>
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
    </StyledFlexBox>
  );
};

export default End;
