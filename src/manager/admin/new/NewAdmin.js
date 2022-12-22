import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackBtn from "../../components/general/BackBtn";
import { EditTitle } from "../../company/new/NewCompanyStyle";
import { ContentWrapper } from "../../../component/StyledComponent";
import {
  Label,
  NewAdminWrapper,
  SaveButton,
  StyledInput,
  StyledTextarea,
} from "./NewAdminStyle";
import { createAdminAccount } from "../../../api/admin/ManagerAdmin";
import Dialog, { DoneDialog } from "../../../component/dialog/Dialog";
import { AdminSetting } from "../Admin";
import {
  InnerContent,
  UploadContent,
} from "../../../frontEnd/advise/AdviseStyle";
import { uploadFileImg } from "../../../frontEnd/advise/Advise";
import AvatarEdit from "../../../component/avatar/AvatarEdit";
import { ErrorMessage } from "../../hawker/new/NewHawkerStyle";
import { dataURLtoFile } from "../edit/EditAdmin";

const modalAvatar = "modal-avatar";
const modalCreated = "modal-created";

const NewAdmin = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);

  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState("");

  const [errorMessages, setErrorMessages] = useState({
    name: "",
    account: "",
    password: "",
    note: "",
  });

  const closeModal = () => {
    setModal(null);
    setShouldOpenModal(false);
  };

  const reset = () => {
    setName("");
    setAccount("");
    setPassword("");
    setNote("");
  };

  const create = () => {
    if (!name || !account || !password) {
      setErrorMessages({
        name: !name ? "欄位必填" : "",
        account: !account ? "欄位必填" : "",
        password: !password ? "欄位必填" : "",
      });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    const data = new FormData();

    data.append("name", name);
    data.append("account", account);
    data.append("password", password);
    data.append("note", note);
    if (photo) {
      data.append("photo", dataURLtoFile(photo, `${name}.png`));
    }

    createAdminAccount(data)
      .then(() => {
        setModal(modalCreated);
        setShouldOpenModal(true);
        reset();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="container-fluid p-5 text-center">
      <div className="d-flex justify-content-between align-items-center">
        <BackBtn
          text={"回列表"}
          onClickCallback={() =>
            navigate("/manager/admin", { state: AdminSetting })
          }
        />
      </div>

      <EditTitle>新增管理員</EditTitle>

      <ContentWrapper>
        <NewAdminWrapper>
          <div className="row align-items-center mb-3">
            <div className="col-3">
              <Label>管理員名稱</Label>
            </div>
            <div className="col">
              <StyledInput
                type="text"
                error={errorMessages.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col-2">
              <ErrorMessage>{errorMessages.name}</ErrorMessage>
            </div>
          </div>
          <div className="row align-items-center mb-3">
            <div className="col-3">
              <Label>帳號</Label>
            </div>
            <div className="col">
              <StyledInput
                type="text"
                error={errorMessages.account}
                value={account}
                onChange={(e) => setAccount(e.target.value)}
              />
            </div>
            <div className="col-2">
              <ErrorMessage>{errorMessages.account}</ErrorMessage>
            </div>
          </div>
          <div className="row align-items-center mb-3">
            <div className="col-3">
              <Label>密碼</Label>
            </div>
            <div className="col">
              <StyledInput
                type="password"
                error={errorMessages.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="col-2">
              <ErrorMessage>{errorMessages.password}</ErrorMessage>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-3">
              <Label>備註</Label>
            </div>
            <div className="col">
              <StyledTextarea
                rows={8}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-3">
              <Label>頭像</Label>
            </div>
            <div className="col">
              {photo ? (
                <div className="w-50">
                  <img src={photo} alt="" className="w-100" />
                </div>
              ) : (
                <UploadContent
                  className="w-75"
                  onClick={() => {
                    setModal(modalAvatar);
                    setShouldOpenModal(true);
                  }}
                >
                  <InnerContent>
                    <div>點擊上傳圖片</div>
                    <div className="mt-3">
                      <img src={uploadFileImg} className="w-75" />
                    </div>
                  </InnerContent>
                </UploadContent>
              )}
            </div>
          </div>
        </NewAdminWrapper>
      </ContentWrapper>

      <SaveButton onClick={create}>新增管理</SaveButton>

      {modal === modalAvatar && shouldOpenModal && (
        <Dialog onClose={() => setShouldOpenModal(false)}>
          <AvatarEdit
            save={setPhoto}
            onCloseModal={() => setShouldOpenModal(false)}
          />
        </Dialog>
      )}

      {modal === modalCreated && shouldOpenModal && (
        <DoneDialog closeModal={closeModal} text={"新增成功"} />
      )}
    </div>
  );
};

export default NewAdmin;
