import React, { useEffect, useState } from "react";
import BackBtn from "../../components/general/BackBtn";
import { EditTitle } from "../../company/new/NewCompanyStyle";
import { ContentWrapper } from "../../../component/StyledComponent";
import {
  ActivateButton,
  InactivateButton,
  Label,
  NewAdminWrapper,
  SaveButton,
  StyledInput,
  StyledTextarea,
} from "../new/NewAdminStyle";
import Dialog, {
  CancelledDialog,
  DoneDialog,
} from "../../../component/dialog/Dialog";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  changeAdminAccountStats,
  editAdminAccount,
} from "../../../api/admin/ManagerAdmin";
import { AdminSetting } from "../Admin";
import AvatarEdit from "../../../component/avatar/AvatarEdit";
import {
  InnerContent,
  UploadContent,
} from "../../../frontEnd/advise/AdviseStyle";
import { uploadFileImg } from "../../../frontEnd/advise/Advise";
import { ErrorMessage } from "../../hawker/new/NewHawkerStyle";

const modalEdited = "edited";
const modalActivated = "activated";
const modalInactivated = "inactivated";
const modalAvatar = "modal-avatar";

export function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

const EditAdmin = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);

  const [stats, setStats] = useState(null);
  const [name, setName] = useState(location?.state.account.name);
  const [account, setAccount] = useState(location?.state.account.account);
  const [password, setPassword] = useState("");
  const [note, setNote] = useState(location?.state.account.note);
  const [photo, setPhoto] = useState("");

  const [errorMessages, setErrorMessages] = useState({
    name: "",
    account: "",
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

  const changeStats = (stats) => {
    setIsLoading(true);

    changeAdminAccountStats(id, stats)
      .then(() => {
        setStats(stats);
        if (stats === 1) {
          setModal(modalActivated);
        } else {
          setModal(modalInactivated);
        }

        setShouldOpenModal(true);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const edit = () => {
    if (!name || !account) {
      setErrorMessages({
        name: !name ? "欄位必填" : "",
        account: !account ? "欄位必填" : "",
      });
      return;
    }
    if (isLoading) return;

    setIsLoading(true);

    const data = new FormData();

    data.append("name", name);
    data.append("account", account);
    if (password) {
      data.append("password", password);
    }
    data.append("note", note);
    data.append("_method", "PUT");
    if (photo) {
      data.append("photo", dataURLtoFile(photo, `${name}.png`));
    }

    editAdminAccount(id, data)
      .then(() => {
        setModal(modalEdited);
        setShouldOpenModal(true);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (
      !location.state ||
      location.state?.account.stats === null ||
      location.state?.account.stats === undefined
    ) {
      navigate("/manager/admin", { replace: true });
    } else {
      setStats(location.state?.account.stats);
    }
  }, [location]);

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

      <EditTitle>編輯管理員</EditTitle>

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

      {stats === 1 && (
        <InactivateButton onClick={() => changeStats(0)}>
          停用帳號
        </InactivateButton>
      )}
      {stats === 0 && (
        <ActivateButton onClick={() => changeStats(1)}>啟用帳號</ActivateButton>
      )}
      <SaveButton onClick={edit}>儲存</SaveButton>

      {modal === modalAvatar && shouldOpenModal && (
        <Dialog onClose={() => setShouldOpenModal(false)}>
          <AvatarEdit
            save={setPhoto}
            onCloseModal={() => setShouldOpenModal(false)}
          />
        </Dialog>
      )}

      {modal === modalEdited && shouldOpenModal && (
        <DoneDialog
          closeModal={() => {
            closeModal();
            navigate("/manager/admin", { state: AdminSetting });
          }}
          text={"編輯成功"}
        />
      )}

      {modal === modalActivated && shouldOpenModal && (
        <DoneDialog closeModal={closeModal} text={"已啟用"} />
      )}

      {modal === modalInactivated && shouldOpenModal && (
        <CancelledDialog closeModal={closeModal} text={"已停用"} />
      )}
    </div>
  );
};

export default EditAdmin;
