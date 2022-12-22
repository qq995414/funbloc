import React, { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { StyledDate } from "../../manager/home/HomeStyle";
import { SingleDatePicker } from "../../component/datepicker/DatePicker";
import {
  PaginationWrapper,
  SearchIcon,
  SearchInput,
} from "../../component/StyledComponent";
import Table from "../../component/table/Table";
import Pagination from "../../manager/components/pagination/Pagination";
import { Tr } from "../../component/table/TableStyle";
import {
  fetchFunblocs,
  fetchPayStatus,
  updatePayStatus,
} from "../../api/funbloc/Funbloc";
import { funblocConditionType } from "../../manager/funbloc/Funbloc";
import { numberWithThousandCommas } from "../../helper/Helper";
import Loading from "../../manager/components/loading/Loading";
import {
  CloseButton,
  EnterButton,
  PaymentModal,
  PaymentStatusButton,
  StyledSelect,
  StyledTd,
} from "./IngStyle";
import Dialog, { CancelledDialog } from "../../component/dialog/Dialog";
import { DialogContentWrapper } from "../../component/dialog/DialogStyle";
import { StyledFlexBox } from "../../styles/Shared.styles";

const modalHasPaymentInfo = "has-payment-info";
const modalNoPaymentInfo = "has-not-payment-info";

const PAY_TYPE_OPTION = [{ value: "ATM匯款" }, { value: "現金" }];
const PAY_STATUS_OPTION_ATM = [{ value: "未匯款" }, { value: "已匯款" }];
const PAY_STATUS_OPTION_CASH = [{ value: "未付款" }, { value: "已付款" }];
const Ing = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);
  const [startDate, setStartDate] = useState(moment().subtract(11, 'month').valueOf());
  const [endDate, setEndDate] = useState(moment().add(1, "month").startOf("month").valueOf());


  const [inputKeyword, setInputKeyword] = useState("");
  const [keyword, setKeyword] = useState("");

  const [pageObject, setPageObject] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const [ings, setIngs] = useState([]);

  const [payStatus, setPayStatus] = useState([]);
  const [currentEditIngId, setcurrentEditIngId] = useState("");

  const ths = [
    "開團日期",
    "小販團編號",
    "開團名稱",
    "總銷售金額",
    "總訂購人數",
    "達成條件/成團條件",
    "已付款/總人數",
    "操作",
  ];

  const getPayStatus = (ingId) => {
    fetchPayStatus(ingId)
      .then((res) => {
        if (res?.data?.length > 0) {
          setPayStatus(res.data);
          setModal(modalHasPaymentInfo);
        } else {
          setModal(modalNoPaymentInfo);
        }

        setShouldOpenModal(true);
      })
      .catch((error) => console.error(error));
  };



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
      stats: 1,
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
    <div className="container-fluid pb-5 px-5">
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
        <StyledFlexBox className="position-relative" mt={[12, 0]}>
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
          ings.map((ing) => {
            const reachCondition =
              ing.condition_type === 0
                ? ing.condition_amount * 1
                : ing.totalSalesFigures * 1;

            return (
              <Tr key={ing.id}>
                <StyledTd>{ing.createAt}</StyledTd>
                <StyledTd>{ing.num}</StyledTd>
                <StyledTd>{ing.funblocName}</StyledTd>
                <StyledTd>{ing.totalSalesFigures}</StyledTd>
                <StyledTd>{ing.totalPeople}</StyledTd>
                <StyledTd>
                  <div>{funblocConditionType[ing.condition_type]}</div>
                  <div>
                    <span
                      className={`${reachCondition >= ing.condition_number
                        ? ""
                        : "text-danger"
                        }`}
                    >
                      {numberWithThousandCommas(reachCondition)}
                    </span>
                    /{numberWithThousandCommas(ing.condition_number)}
                  </div>
                </StyledTd>
                <StyledTd>
                  <span className="text-danger">{ing.payPeople}</span>/
                  {ing.totalPeople}
                </StyledTd>
                <StyledTd>
                  <div className="mb-2">
                    <EnterButton onClick={() => navigate(`/ing/${ing.id}`)}>
                      進入販團
                    </EnterButton>
                  </div>
                  <div>
                    <PaymentStatusButton
                      onClick={() => {
                        getPayStatus(ing.id);
                        setcurrentEditIngId(ing.id);
                      }}
                    >
                      付款狀態
                    </PaymentStatusButton>
                  </div>
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

      {modal === modalNoPaymentInfo && shouldOpenModal && (
        <CancelledDialog
          text={"尚未輸入訂購"}
          closeModal={() => setShouldOpenModal(false)}
        />
      )}

      {modal === modalHasPaymentInfo && shouldOpenModal && (
        <Dialog onClose={() => setShouldOpenModal(false)}>
          <DialogContentWrapper width={735}>
            <PaymentModal p={["40px 16px", "42px 100px"]}>
              <CloseButton
                type="button"
                onClick={() => setShouldOpenModal(false)}
              ></CloseButton>
              <StyledFlexBox
                className="title text-center"
                display={["none", "none", "block"]}
              >
                購買人付款狀態
              </StyledFlexBox>
              <StyledFlexBox className="mb-3">
                <div className="col head text-center text-primary">姓名</div>
                <div className="col head text-center text-primary">總金額</div>
                <StyledFlexBox
                  className="col head text-center text-primary"
                  px={[0, 10]}
                  justifyContent="center"
                >
                  付款狀態
                </StyledFlexBox>
                <StyledFlexBox
                  className="col head text-center text-primary"
                  px={[0, 10]}
                  justifyContent="center"
                >
                  匯款狀態
                </StyledFlexBox>
              </StyledFlexBox>
              <StyledFlexBox className="h-300" flexDirection="column">
                {payStatus.length > 0 &&
                  payStatus.map((status) => (
                    <StyledFlexBox
                      className="align-items-center mb-3"
                      key={status.id}
                    >
                      <div className="col text text-center">
                        {status.orderName}
                      </div>
                      <div className="col text text-center">
                        ${status.myPriceTotal}
                      </div>
                      <StyledFlexBox className="col" px={[0, 10]}>
                        <StyledSelect
                          defaultValue={status.payType}
                          onChange={(e) => {
                            let tmp = payStatus;
                            const findIndex = tmp.findIndex(
                              (item) => item.id === status.id
                            );
                            tmp[findIndex].payType = e.target.value;
                            if (e.target.value === "現金") {

                              if (status.payStatus === "未付款" || status.payStatus === "未匯款") {
                                tmp[findIndex].payStatus =
                                  PAY_STATUS_OPTION_CASH[0].value;

                              } else {
                                tmp[findIndex].payStatus =
                                  PAY_STATUS_OPTION_CASH[1].value;
                              }
                            } else {
                              if (status.payStatus === "未付款" || status.payStatus === "未匯款") {
                                tmp[findIndex].payStatus =
                                  PAY_STATUS_OPTION_ATM[0].value;

                              } else {
                                tmp[findIndex].payStatus =
                                  PAY_STATUS_OPTION_ATM[1].value;

                              }

                            }
                            updatePayStatus({
                              ingId: currentEditIngId,
                              data: tmp,
                            });
                            getPayStatus(currentEditIngId);

                          }}
                        >
                          {PAY_TYPE_OPTION.map((item) => (
                            <option value={item.value} key={item.value}>
                              {item.value}
                            </option>
                          ))}
                        </StyledSelect>
                      </StyledFlexBox>
                      <StyledFlexBox className="col" px={[0, 10]}>
                        <StyledSelect
                          defaultValue={status.payStatus}

                          onChange={(e) => {
                            let tmp = payStatus;
                            const findIndex = tmp.findIndex(
                              (item) => item.id === status.id
                            );
                            tmp[findIndex].payStatus = e.target.value;
                            updatePayStatus({
                              ingId: currentEditIngId,
                              data: tmp,
                            });
                            getPayStatus(currentEditIngId);

                          }}
                        >
                          {status.payType === "現金" && status.payStatus === "已付款"
                            ?
                            <><option value="已付款" key="已付款">
                              已付款
                            </option><option value="未付款" key="未付款">
                                未付款
                              </option></>

                            : ""
                          }
                          {status.payType === "現金" && status.payStatus === "未付款"
                            ?
                            <><option value="未付款" key="未付款">
                              未付款
                            </option><option value="已付款" key="已付款">
                                已付款
                              </option></>

                            : ""
                          }
                          {status.payType === "ATM匯款" && status.payStatus === "已匯款"
                            ?
                            <><option value="已匯款" key="已匯款">
                              已匯款
                            </option><option value="未匯款" key="未匯款">
                                未匯款
                              </option></>

                            : ""
                          }
                          {status.payType === "ATM匯款" && status.payStatus === "未匯款"
                            ?
                            <><option value="未匯款" key="未匯款">
                              未匯款
                            </option><option value="已匯款" key="已匯款">
                                已匯款
                              </option></>

                            : ""
                          }
                          {/*status.payType === "現金"
                            ? PAY_STATUS_OPTION_CASH.map((item) => (
                              <option value={item.value} key={item.value}>
                                {item.value}

                              </option>
                            ))
                            : PAY_STATUS_OPTION_ATM.map((item) => (
                              <option value={item.value} key={item.value}>
                                {item.value}
                              </option>
                            ))*/}
                        </StyledSelect>
                      </StyledFlexBox>
                    </StyledFlexBox>
                  ))}
              </StyledFlexBox>
            </PaymentModal>
          </DialogContentWrapper>
        </Dialog>
      )}
    </div>
  );
};

export default Ing;
