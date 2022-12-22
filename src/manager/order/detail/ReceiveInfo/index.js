import { useState } from "react";
import Dialog from "../../../../component/dialog/Dialog";
import { StyledFlexBox, StyledImage } from "../../../../styles/Shared.styles";
import { StyledInput } from "../../../company/edit/EditCompanyStyle";
import {
  DialogButton,
  DialogContentWrapper,
  DialogTitle,
} from "../../../../component/dialog/DialogStyle";
import { editOrder } from "../../../../api/order/ManagerOrder";
import { useParams } from "react-router-dom";

const ReceiveInfo = ({ data = {}, getOrderDetail }) => {
  const { orderId } = useParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [info, setInfo] = useState({});

  const closeModal = () => {
    setModalOpen(false);
  };
  const onChangeInfo = async () => {
    await editOrder({
      orderId,
      data: {
        recipientName: info.name,
        recipientPhone: info.phone,
        recipientAddress: info.address,
        recipientRemark: info.remark,
      },
    });
    getOrderDetail();
    setModalOpen(false);
  };

  return (
    <StyledFlexBox flexDirection="column" mb={30}>
      <StyledFlexBox justifyContent="space-between">
        <StyledFlexBox
          mb="8px"
          color="#26b7bc"
          fontSize="15.6px"
          fontWeight={600}
        >
          收件資訊
        </StyledFlexBox>
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
          onClick={() => {
            setInfo(data);
            setModalOpen(true);
          }}
        >
          <StyledImage src="/images/manager/carbon_pen.svg" />
          編輯
        </StyledFlexBox>
      </StyledFlexBox>
      <StyledFlexBox
        width="100%"
        height={123}
        border="0.5px solid #26b6bc"
        borderRadius="9px"
        bg="#fff"
        pt={30}
        pl={35}
        color="#747474"
        fontSize={14.8}
        fontWeight={500}
        lineHeight={"28px"}
        justifyContent="space-between"
      >
        <StyledFlexBox flexDirection="column" width="50%">
          <div>收件人：{data.name}</div>
          <div>收件地址：{data.address}</div>
        </StyledFlexBox>
        <StyledFlexBox flexDirection="column" width="50%">
          <div>聯絡電話：{data.phone}</div>
          <div>備註：{data.remark}</div>
        </StyledFlexBox>
      </StyledFlexBox>
      {modalOpen && (
        <Dialog onClose={closeModal}>
          <DialogContentWrapper
            className="px-5 py-4 justify-content-between"
            width={724}
          >
            <DialogTitle className="text-primary">編輯收件資訊</DialogTitle>
            <StyledFlexBox
              mt={24}
              className="w-75 row"
              mb={16}
              color="#747474"
              fontSize={14.4}
              alignItems="center"
            >
              <StyledFlexBox className="col-4">
                <div>收件人</div>
                <StyledFlexBox color="#FE868E">*</StyledFlexBox>
              </StyledFlexBox>
              <div className="col">
                <StyledInput
                  type="text"
                  className="form-control border-primary"
                  defaultValue={info.name}
                  onChange={(e) =>
                    setInfo((prev) => {
                      const tmp = prev;
                      tmp.name = e.target.value;
                      return tmp;
                    })
                  }
                />
              </div>
            </StyledFlexBox>
            <StyledFlexBox
              className="w-75 row"
              mb={16}
              color="#747474"
              fontSize={14.4}
              alignItems="center"
            >
              <StyledFlexBox className="col-4">
                <div>收件地址</div>
                <StyledFlexBox color="#FE868E">*</StyledFlexBox>
              </StyledFlexBox>
              <div className="col">
                <StyledInput
                  type="text"
                  className="form-control border-primary"
                  defaultValue={info.address}
                  onChange={(e) =>
                    setInfo((prev) => {
                      const tmp = prev;
                      tmp.address = e.target.value;
                      return tmp;
                    })
                  }
                />
              </div>
            </StyledFlexBox>
            <StyledFlexBox
              className="w-75 row"
              mb={16}
              color="#747474"
              fontSize={14.4}
              alignItems="center"
            >
              <StyledFlexBox className="col-4">
                <div>聯絡電話</div>
                <StyledFlexBox color="#FE868E">*</StyledFlexBox>
              </StyledFlexBox>
              <div className="col">
                <StyledInput
                  type="text"
                  className="form-control border-primary"
                  defaultValue={info.phone}
                  onChange={(e) =>
                    setInfo((prev) => {
                      const tmp = prev;
                      tmp.phone = e.target.value;
                      return tmp;
                    })
                  }
                />
              </div>
            </StyledFlexBox>
            <StyledFlexBox
              className="w-75 row"
              mb={50}
              color="#747474"
              fontSize={14.4}
              alignItems="center"
            >
              <StyledFlexBox className="col-4">
                <div>備註</div>
              </StyledFlexBox>
              <div className="col">
                <StyledInput
                  type="textarea"
                  className="form-control border-primary"
                  defaultValue={info.remark}
                  onChange={(e) =>
                    setInfo((prev) => {
                      const tmp = prev;
                      tmp.remark = e.target.value;
                      return tmp;
                    })
                  }
                />
              </div>
            </StyledFlexBox>
            <div className="mb-3">
              <DialogButton
                className="btn-secondary cancel"
                onClick={closeModal}
              >
                取消
              </DialogButton>
              <DialogButton className="btn-primary" onClick={onChangeInfo}>
                確認
              </DialogButton>
            </div>
          </DialogContentWrapper>
        </Dialog>
      )}
    </StyledFlexBox>
  );
};

export default ReceiveInfo;
