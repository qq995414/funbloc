import React, { useState } from "react";
import styled from "styled-components";
import Dialog from "../../../component/dialog/Dialog";

import { DialogContentWrapper } from "../../../component/dialog/DialogStyle";
import { ConfirmButton } from "../../end/detail/EndDetailStyle";
import { numberWithThousandCommas } from "../../../helper/Helper";
import {
  StyledButton,
  StyledFlexBox,
  StyledImage,
} from "../../../styles/Shared.styles";
import { StyledInput } from "../../ing/detail/FublocDetailStyle";
import { StyledTextarea } from "../../../manager/hawker/new/NewHawkerStyle";

const Container = styled.div.attrs({
  className: "container py-5",
})`
  color: #747474;
  max-height: 100vh;
  overflow-y: auto;
  position: relative;
`;

const BeforeCheckoutDialog = ({
  name,
  num,
  totalCost,
  onConfirm,
  onCancel,
  condition,
  deliveryInfo,
  five,
  isEndDetail = false,
}) => {
  const [receiveName, setReceiveName] = useState("");
  const [receiveAddress, setReceiveAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [remark, setRemark] = useState("");
  return (
    <Dialog onClose={onCancel}>
      <DialogContentWrapper width={[311, 688, 715]}>
        <Container>
          <StyledFlexBox width={[272, 566]} mx="auto">
            {isEndDetail
              ? "請將揪團的總金額匯至以下帳戶"
              : "請將揪團的總金額匯至以下帳戶。在確認收款無誤後，就會準備出貨。"}
          </StyledFlexBox>
          <StyledFlexBox
            position="absolute"
            top={16}
            right={16}
            cursor="pointer"
            onClick={onCancel}
          >
            <StyledImage src="/images/front-end/icon_close.svg" />
          </StyledFlexBox>
          <StyledFlexBox
            fontSize={14}
            lineHeight="27px"
            color="#9b9b9b"
            width={[272, 566]}
            mx="auto"
          >
            {isEndDetail
              ? ""
              : "匯款前請注意「配送資訊」的說明，請根據該團狀況在原「團購總額」自行「加上」運費，運費不足者會再補齊後才進行出貨。"}
          </StyledFlexBox>
          <StyledFlexBox
            bg="#26b7bc"
            my={24}
            width={[272, 566]}
            height="1px"
            mx="auto"
          />
          <StyledFlexBox mx="auto" width={[272, 566]} flexDirection="column">
            <StyledFlexBox color="#26b7bc" fontSize={17} mb="8px">
              團購資料
            </StyledFlexBox>
            <StyledFlexBox fontSize={15} color="#747474" mb={24}>
              成團名稱：{name} <br />
              成團編號：{num} <br />
              成團條件：{condition}
              <br />
            </StyledFlexBox>
            {!isEndDetail && (
              <>
                <StyledFlexBox color="#26b7bc" fontSize={17} mb="4px">
                  團購主收件資料
                </StyledFlexBox>
                <StyledFlexBox color="#9b9b9b" fontSize={14} mb="12px">
                  平台會將所有商品寄送給團主指定收件地址
                </StyledFlexBox>
                <StyledFlexBox
                  fontSize={14.4}
                  color="#747474"
                  height={45}
                  alignItems="center"
                  mb="9px"
                >
                  <StyledFlexBox width={82}>
                    收件人
                    <StyledFlexBox color="#FE868E">*</StyledFlexBox>
                  </StyledFlexBox>
                  <StyledInput
                    type="text"
                    value={receiveName}
                    onChange={(e) => setReceiveName(e.target.value)}
                  />
                </StyledFlexBox>
                <StyledFlexBox
                  fontSize={14.4}
                  color="#747474"
                  height={45}
                  alignItems="center"
                  mb="9px"
                >
                  <StyledFlexBox width={82}>
                    收件地址
                    <StyledFlexBox color="#FE868E">*</StyledFlexBox>
                  </StyledFlexBox>
                  <StyledInput
                    type="text"
                    value={receiveAddress}
                    onChange={(e) => setReceiveAddress(e.target.value)}
                  />
                </StyledFlexBox>
                <StyledFlexBox
                  fontSize={14.4}
                  color="#747474"
                  height={45}
                  alignItems="center"
                  mb="9px"
                >
                  <StyledFlexBox width={82}>
                    聯絡電話
                    <StyledFlexBox color="#FE868E">*</StyledFlexBox>
                  </StyledFlexBox>
                  <StyledInput
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </StyledFlexBox>
                <StyledFlexBox
                  fontSize={14.4}
                  color="#747474"
                  height={45}
                  alignItems="center"
                  mb="24px"
                >
                  <StyledFlexBox width={82}>備註</StyledFlexBox>
                  <StyledTextarea
                    ml="15px"
                    width="80%"
                    type="text"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </StyledFlexBox>
              </>
            )}
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
                <StyledFlexBox
                  color="#747474"
                  fontSize={17}
                  width="calc(90% - 91px)"
                >
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
                <StyledFlexBox
                  color="#747474"
                  fontSize={17}
                  width="calc(90% - 91px)"
                >
                  {deliveryInfo}
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
                mb={12}
              >
                實際應付總額 ={" "}
                <StyledFlexBox display={["contents", "none"]}>
                  <br />
                </StyledFlexBox>
                團購總額 {numberWithThousandCommas(totalCost * 1)}元 (+運費)
              </StyledFlexBox>
            </StyledFlexBox>
          </StyledFlexBox>
          <StyledFlexBox
            width={[272, 566]}
            mx="auto"
            mt={[40, 17]}
            color="#fe868e"
            fontSize={15}
          >
            實際應付總額：團購總額+配送資訊對應的運費門檻。付款不足者，補齊款項後，商品才會出貨。
          </StyledFlexBox>
          {!isEndDetail && (
            <div className="d-flex justify-content-evenly mt-5">
              <StyledButton
                className="btn btn btn-outline-primary"
                p={["6px 20px", "10px 50px"]}
                onClick={() =>
                  onConfirm({
                    data: {
                      recipientName: receiveName,
                      recipientAddress: receiveAddress,
                      recipientPhone: phone,
                      recipientRemark: remark,
                    },
                  })
                }
              >
                立即結團
              </StyledButton>
            </div>
          )}
          {isEndDetail && (
            <ConfirmButton
              onClick={five}
              p={["6px 20px", "10px 50px"]}
              mx="auto"
              display="block"
              mt={40}
            >
              我已匯款
            </ConfirmButton>
          )}
        </Container>
      </DialogContentWrapper>
    </Dialog>
  );
};
export default BeforeCheckoutDialog;
