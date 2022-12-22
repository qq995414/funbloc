import React, { useEffect, useState } from "react";
import moment from "moment";
import { CancelButton, FormContainer, SaveButton, Title } from "./MyStyle";
import { StyledInput } from "../login/LoginStyle";
import { editUserInfo, fetchMe } from "../../api/admin/Admin";
import { InnerContent, UploadContent } from "../advise/AdviseStyle";
import { uploadFileImg } from "../advise/Advise";
import Dialog, { DoneDialog } from "../../component/dialog/Dialog";
import AvatarEdit from "../../component/avatar/AvatarEdit";
import { dataURLtoFile } from "../../manager/admin/edit/EditAdmin";
import { useNavigate } from "react-router-dom";
import { StyledFlexBox } from "../../styles/Shared.styles";

const modalAvatar = "modal-avatar";
const modalDone = "modal-done";

const My = ({ getMe }) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [modal, setModal] = useState(null);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);

  const [account, setAccount] = useState("");

  const [name, setName] = useState("");
  const [gender, setGender] = useState("男");
  const [birthday, setBirthday] = useState("");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState("");

  const submitInfo = (forceUpdate) => {
    const data = new FormData();

    data.append("_method", "put");
    data.append("phone", phone);
    data.append("email", email);
    data.append("address", address);
    if (photo) {
      data.append("photo", dataURLtoFile(photo, `${name}.png`));
    }
    if (forceUpdate) {
      data.append("photo", "");
    }

    editUserInfo(data)
      .then(() => {
        setModal(modalDone);
        setShouldOpenModal(true);
        getMe();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);

    fetchMe()
      .then((res) => {
        setAccount(res.data.account);
        setName(res.data.name);
        setGender(res.data.gender * 1 === 0 ? "男" : "女");
        setBirthday(moment(res.data.birthday).format("YYYY/MM/DD"));
        setPhone(res.data.phone);
        setAddress(res.data.address);
        setEmail(res.data.email);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <StyledFlexBox flexDirection="column" pt={40} px={["8px", "16px", 50]}>
      <Title>編輯資料</Title>
      <FormContainer
        className="justify-content-evenly"
        padding={["42px 5% 31px", "55px 8% 100px 8%"]}
        fontSize={[12, 14.5]}
      >
        <StyledFlexBox>
          <StyledFlexBox
            minWidth={[73, 87]}
            justifyContent="flex-end"
            alignItems="center"
            mr={[20, 40]}
          >
            會員帳號
          </StyledFlexBox>
          <StyledFlexBox height={45} alignItems="center">
            {account}
          </StyledFlexBox>
        </StyledFlexBox>
        <StyledFlexBox>
          <StyledFlexBox
            minWidth={[73, 87]}
            justifyContent="flex-end"
            alignItems="center"
            mr={[20, 40]}
          >
            真實姓名
          </StyledFlexBox>
          <StyledFlexBox height={45} alignItems="center">
            {name}
          </StyledFlexBox>
        </StyledFlexBox>
        <StyledFlexBox>
          <StyledFlexBox
            minWidth={[73, 87]}
            justifyContent="flex-end"
            alignItems="center"
            mr={[20, 40]}
          >
            性別
          </StyledFlexBox>
          <StyledFlexBox height={45} alignItems="center">
            {gender}
          </StyledFlexBox>
        </StyledFlexBox>
        <StyledFlexBox>
          <StyledFlexBox
            minWidth={[73, 87]}
            justifyContent="flex-end"
            alignItems="center"
            mr={[20, 40]}
          >
            出生年月日
          </StyledFlexBox>
          <StyledFlexBox height={45} alignItems="center">
            {birthday}
          </StyledFlexBox>
        </StyledFlexBox>
        <StyledFlexBox>
          <StyledFlexBox
            minWidth={[73, 87]}
            justifyContent="flex-end"
            alignItems="center"
            mr={[20, 40]}
          >
            手機號碼
          </StyledFlexBox>
          <StyledFlexBox height={45} alignItems="center">
            <StyledInput
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            />
          </StyledFlexBox>
        </StyledFlexBox>
        <StyledFlexBox>
          <StyledFlexBox
            minWidth={[73, 87]}
            justifyContent="flex-end"
            alignItems="center"
            mr={[20, 40]}
          >
            E-mail
          </StyledFlexBox>
          <StyledFlexBox height={45} alignItems="center">
            <StyledInput
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </StyledFlexBox>
        </StyledFlexBox>
        <StyledFlexBox>
          <StyledFlexBox
            minWidth={[73, 87]}
            justifyContent="flex-end"
            alignItems="center"
            mr={[20, 40]}
          >
            我的收貨地址
          </StyledFlexBox>
          <StyledFlexBox height={45}  minWidth={[73, 212]} alignItems="center">
            <StyledInput
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </StyledFlexBox>
        </StyledFlexBox>
        <StyledFlexBox>
          <StyledFlexBox
            minWidth={[73, 87]}
            justifyContent="flex-end"
            mr={[20, 40]}
          >
            頭像
          </StyledFlexBox>
          <StyledFlexBox
            flexDirection={["column", "row"]}
            alignItems={["initial", "flex-end"]}
          >
            {photo ? (
              <div className="w-100">
                <img src={photo} alt="" className="w-100" />
              </div>
            ) : (
              <UploadContent
                onClick={() => {
                  setModal(modalAvatar);
                  setShouldOpenModal(true);
                }}
              >
                <InnerContent>
                  <div>點擊上傳圖片</div>
                  <div className="mt-3">
                    <img
                      src={uploadFileImg}
                      className="w-75"
                      alt="uploaded-img"
                    />
                  </div>
                </InnerContent>
              </UploadContent>
            )}
          </StyledFlexBox>


        </StyledFlexBox>
        <StyledFlexBox
          minWidth={120}
          height={32}
          alignItems={"center"}
          mt={["15px", 3]}
          ml={[90, 125]}
        >
          <button
            className="btn btn-outline-primary"
            onClick={() => {
              setPhoto("");
              submitInfo(true);
            }}
          >
            清除照片
          </button>
        </StyledFlexBox>
      </FormContainer>
      <div className="text-center mt-4">
        <CancelButton className="mx-2" onClick={() => navigate("/home")}>
          取消修改
        </CancelButton>
        <SaveButton className="mx-2" disabled={isLoading} onClick={submitInfo}>
          確定修改
        </SaveButton>
      </div>

      {modal === modalAvatar && shouldOpenModal && (
        <Dialog onClose={() => setShouldOpenModal(false)}>
          <AvatarEdit
            save={setPhoto}
            onCloseModal={() => setShouldOpenModal(false)}
          />
        </Dialog>
      )}
      {modal === modalDone && shouldOpenModal && (
        <DoneDialog
          closeModal={() => setShouldOpenModal(false)}
          text={"完成"}
        />
      )}
    </StyledFlexBox>
  );
};

export default My;
