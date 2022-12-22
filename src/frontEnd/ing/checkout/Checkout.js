import React, { createRef, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import {
  AccountLastFiveNumberWrapper,
  BackButton,
  CheckedButton,
  CheckedIcon,
  CheckoutText,
  CheckoutTitle,
  WarningText,
} from "./CheckoutStyle";
import Dialog from "../../../component/dialog/Dialog";
import { DialogContentWrapper } from "../../../component/dialog/DialogStyle";
import { SingleDatePicker } from "../../../component/datepicker/DatePicker";
import { lastFiveNumber } from "../../../api/funbloc/Funbloc";
import { numberWithThousandCommas } from "../../../helper/Helper";
import {
  StyledButton,
  StyledFlexBox,
  StyledImage,
} from "../../../styles/Shared.styles";
import { StyledInput } from "../detail/FublocDetailStyle";

const modalLastFiveNumber = "five";
const modalConfirm = "done";

const Checkout = () => {
  const numerOfInputs = 5;

  const [inputRefsArray] = useState(() =>
    Array.from({ length: numerOfInputs }, () => createRef())
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [letters, setLetters] = useState(() =>
    Array.from({ length: numerOfInputs }, () => "")
  );
  const navigate = useNavigate();
  const { state = {} } = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(state?.modal || "");
  const [shouldModalOpen, setShouldModalOpen] = useState(
    state?.shouldModalOpen || false
  );

  const [payDate, setPayDate] = useState(moment().valueOf());
  const [payAmount, setPayAmount] = useState("");

  const close = () => {
    setShouldModalOpen(false);
  };

  const sendLastFiveNumber = () => {
    const fiveNumber = letters.join("");

    if (fiveNumber.length < 5) return;

    setIsLoading(true);
    lastFiveNumber(
      state.funblocId,
      fiveNumber,
      moment(payDate).format("yyyy/MM/DD"),
      payAmount
    )
      .then((res) => {
        console.log(res);

        setModal(modalConfirm);
        setShouldModalOpen(true);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleKeyPress = (event) => {
    let key = event.keyCode || event.charCode;
    if (window.document.activeElement.id !== "payment") {
      if (key == 8) {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex === 0 ? 0 : prevIndex - 1;
          const nextInput = inputRefsArray?.[nextIndex]?.current;
          nextInput?.focus();
          nextInput?.select();
          return nextIndex;
        });
        //backspace pressed
      } else {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex < numerOfInputs - 1 ? prevIndex + 1 : 0;
          const nextInput = inputRefsArray?.[nextIndex]?.current;
          nextInput?.focus();
          nextInput?.select();
          return nextIndex;
        });
      }
    }
  };

  useEffect(() => {
    if (inputRefsArray?.[0]?.current) {
      inputRefsArray?.[0]?.current?.focus();
    }
    window.addEventListener("keyup", handleKeyPress, false);
    return () => {
      window.removeEventListener("keyup", handleKeyPress);
    };
  }, []);
  

  return (
    <div className="container-fluid py-5">
      <CheckedIcon className="mt-1">
        <i className="bi bi-check-circle" />
      </CheckedIcon>
      <CheckoutTitle>揪團成功</CheckoutTitle>
      <CheckoutText
        className="mt-3 text-center"
        width={["unset", 547]}
        mx="auto"
      >
        請將揪團總金額(需自行計算運費)匯至以下帳戶後，並於訂單更新已匯款的帳戶後五碼，已結團訂單未更新匯款後五碼，我們將無法知道匯款金額是哪筆訂單。
      </CheckoutText>
      <StyledFlexBox
        mx="auto"
        width={["100%", 565]}
        height="0.5px"
        bg="#26b7bc"
        mt={28}
      />
      <StyledFlexBox
        mx="auto"
        width={[272, 566]}
        flexDirection="column"
        mt={27}
      >
        <StyledFlexBox color="#26b7bc" fontSize={17} mb="8px">
          團購資料
        </StyledFlexBox>
        <StyledFlexBox fontSize={15} color="#747474" mb={24}>
          成團名稱：{state?.funblocName} <br />
          成團編號：{state?.num} <br />
          成團條件：{state.condition_type === 0
            ? state.condition_amount * 1
            : state.totalSalesFigures * 1}
          <br />
        </StyledFlexBox>
      </StyledFlexBox>
      <StyledFlexBox
        width={[272, 566]}
        mx="auto"
        height={[216, 248]}
        borderRadius="4px"
        border="0.5px solid #26b7bc"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        px={[14, 0]}
        bg="#fff"
        boxShadow="0px 4px 4px rgba(202, 202, 202, 0.25)"
      >
        <StyledFlexBox
          mb={16}
          width="100%"
          justifyContent="center"
          flexDirection={["column", "row"]}
        >
          <StyledFlexBox color="#26b7bc" fontSize={17} width={91}>
            銀行帳戶
          </StyledFlexBox>
          <StyledFlexBox color="#747474" fontSize={17} width="calc(90% - 91px)">
            {process.env.REACT_APP_BANK_NAME}
            {process.env.REACT_APP_BANK_CODE} <br />
            {process.env.REACT_APP_BANK_ACCOUNT}
          </StyledFlexBox>
        </StyledFlexBox>
        <StyledFlexBox
          mb={16}
          width="100%"
          justifyContent="center"
          flexDirection={["column", "row"]}
        >
          <StyledFlexBox color="#26b7bc" fontSize={17} width={91}>
            配送資訊
          </StyledFlexBox>
          <StyledFlexBox color="#747474" fontSize={17} width="calc(90% - 91px)">
            {state?.deliveryInfo}
          </StyledFlexBox>
        </StyledFlexBox>
        <StyledFlexBox
          width={["100%", "90%"]}
          bg="#eef4f3"
          border="0.5px dashed #26b7bc"
          borderRadius="6px"
          justifyContent={["flex-start", "center"]}
          height={53}
          px={[12, "unset"]}
          alignItems="center"
          fontSize={[14, 17]}
          color="#747474"
          mb={12}
        >
          實際應付總額 ={" "}
          <StyledFlexBox display={["contents", "none"]}>
            <br />
          </StyledFlexBox>
          團購總額 {numberWithThousandCommas(state?.total * 1)}元 (+運費)
        </StyledFlexBox>
      </StyledFlexBox>
      <StyledFlexBox
        width={[272, 566]}
        mx="auto"
        mt={27}
        color="#fe868e"
        fontSize={15}
      >
        實際應付總額：團購總額+配送資訊對應的運費門檻。付款不足者，補齊款項後，商品才會出貨。
      </StyledFlexBox>
      <StyledFlexBox className="text-center" justifyContent="center" mt={40}>
        <BackButton
          onClick={() => navigate("/end")}
          width={[148, 168]}
          height={45}
          p={0}
        >
          前往已結團
        </BackButton>
      </StyledFlexBox>
      {modal === modalLastFiveNumber && shouldModalOpen && (
        <Dialog onClose={close}>
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
              onClick={close}
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
                      onChange={(e) => {
                        const { value } = e.target;

                        setLetters((letters) =>
                          letters.map((letter, letterIndex) =>
                            letterIndex === index
                              ? value.replace(/\D+/g, "")
                              : letter
                          )
                        );
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
                  onClick={() => navigate(-1)}
                >
                  回上一頁
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
      {modal === modalConfirm && shouldModalOpen && (
        <Dialog onClose={close}>
          <DialogContentWrapper width={[311, 688, 715]} height={550}>
            <AccountLastFiveNumberWrapper>
              <CheckedIcon>
                <i className="bi bi-check-circle" />
              </CheckedIcon>
              <div className="title-lg mt-5 text-center">已成功匯款</div>
              <StyledFlexBox
                fontSize={14.7}
                color="#747474"
                width={[262, 391]}
                lineHeight="28px"
                mx="auto"
                textAlign="center"
                mt={16}
              >
                平台確認款項無誤後，即會進行出貨，如運費未依「配送資訊」進行匯款，將於全部款項補齊後出貨
              </StyledFlexBox>
              <div className="button-wrapper text-center">
                <CheckedButton onClick={close}>確認</CheckedButton>
              </div>
            </AccountLastFiveNumberWrapper>
          </DialogContentWrapper>
        </Dialog>
      )}
    </div>
  );
};

export default Checkout;
