import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AuthLogo,
  FormInput,
  IconLock,
  IconPerson,
  LoginForm,
  LoginWrapper,
  logo1,
  logo2,
  ModalForgotWrapper,
  ModalInput,
  ModalSendRequirementWrapper,
} from "./LoginStyle";
import { login } from "../../api/login/Login";
import Dialog, { DoneDialog } from "../../component/dialog/Dialog";
import {
  DialogButton,
  DialogContentWrapper,
} from "../../component/dialog/DialogStyle";

const checkImg = "/images/front-end/done.png";
const modalForgot = "modal-forgot";
const modalSendRequirement = "modal-send-requirement";
const modalBeforeResetPassword = "modal-before-reset-password";
const modalResetPassword = "modal-reset-password";
const modalResetPasswordSuccess = "modal-reset-password-success";

const initErrorMessage = () => ({
  account: "",
  phone: "",
});

const initErrorMessageForPassword = () => ({
  account: "",
  password: "",
  confirmPassword: "",
});

const ForgotPasswordModal = ({ closeModal, setModal }) => {
  const [account, setAccount] = useState("");
  const [phone, setPhone] = useState("");

  const [errorMessages, setErrorMessages] = useState(initErrorMessage());

  const submit = () => {
    if (!account) {
      setErrorMessages({ account: "此蘭未必填", phone: "" });
      alert("請確認欄位");
      return;
    }

    if (!phone) {
      setErrorMessages({ account: "", phone: "此蘭未必填" });
      alert("請確認欄位");
      return;
    }

    setModal(modalSendRequirement);
  };

  return (
    <Dialog onClose={closeModal}>
      <DialogContentWrapper className="py-4" width={400}>
        <ModalForgotWrapper>
          <div className="title text-primary mb-5">申請密碼更改</div>
          <div className="form">
            <div className="form-group mb-4">
              <ModalInput
                placeholder={"用戶名稱"}
                error={!!errorMessages.account}
                value={account}
                onChange={(e) => {
                  setErrorMessages(initErrorMessage());
                  setAccount(e.target.value);
                }}
              />
            </div>
            <div className="form-group mb-5">
              <ModalInput
                placeholder={"電話號碼"}
                error={!!errorMessages.phone}
                value={phone}
                onChange={(e) => {
                  setErrorMessages(initErrorMessage());
                  setPhone(e.target.value);
                }}
              />
            </div>
            <div className="text-center">
              <DialogButton
                className="btn-secondary cancel"
                onClick={closeModal}
              >
                取消
              </DialogButton>
              <DialogButton className="btn-primary" onClick={submit}>
                確認
              </DialogButton>
            </div>
          </div>
        </ModalForgotWrapper>
      </DialogContentWrapper>
    </Dialog>
  );
};

const SendRequirement = ({ closeModal }) => {
  return (
    <Dialog onClose={closeModal}>
      <DialogContentWrapper className="py-4" width={400}>
        <ModalSendRequirementWrapper>
          <div className="title text-primary">已送出申請</div>
          <div className="img-wrapper mx-auto my-3">
            <img src={checkImg} alt="" className="w-100" />
          </div>
          <div className="text-danger mb-3">已通知管理員</div>
          <div className="text-secondary mb-4">授權後至登入頁重設密碼即可</div>
          <DialogButton className="btn-primary" onClick={closeModal}>
            確認
          </DialogButton>
        </ModalSendRequirementWrapper>
      </DialogContentWrapper>
    </Dialog>
  );
};

const BeforeResetPassword = ({ closeModal, setModal }) => {
  return (
    <Dialog onClose={closeModal}>
      <DialogContentWrapper width={400} height={240}>
        <ModalSendRequirementWrapper>
          <div className="title text-primary">需先至忘記密碼申請重設</div>
          <div className="text-secondary my-4">
            其他會員請登入後至｢我的資料」修改
          </div>
          <DialogButton
            className="btn-secondary cancel"
            onClick={() => setModal(modalForgot)}
          >
            忘記密碼
          </DialogButton>
          <DialogButton
            className="btn-primary"
            onClick={() => setModal(modalResetPassword)}
          >
            已申請
          </DialogButton>
        </ModalSendRequirementWrapper>
      </DialogContentWrapper>
    </Dialog>
  );
};

const ResetPasswordModal = ({ closeModal, setModal }) => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessages, setErrorMessages] = useState(
    initErrorMessageForPassword()
  );

  const submit = () => {
    if (!account) {
      setErrorMessages({
        account: "此蘭未必填",
        password: "",
        confirmPassword: "",
      });
      alert("請確認欄位");
      return;
    }

    if (!password) {
      setErrorMessages({
        account: "此蘭未必填",
        password: "",
        confirmPassword: "",
      });
      alert("請確認欄位");
      return;
    }

    if (!confirmPassword) {
      setErrorMessages({
        account: "此蘭未必填",
        password: "",
        confirmPassword: "",
      });
      alert("請確認欄位");
      return;
    }

    setModal(modalResetPasswordSuccess);
  };

  return (
    <Dialog onClose={closeModal}>
      <DialogContentWrapper className="py-4" width={400}>
        <ModalForgotWrapper>
          <div className="title text-primary mb-4">重設密碼</div>
          <div className="form">
            <div className="form-group mb-4">
              <ModalInput
                type="text"
                placeholder={"用戶名稱"}
                error={!!errorMessages.account}
                value={account}
                onChange={(e) => {
                  setErrorMessages(initErrorMessage());
                  setAccount(e.target.value);
                }}
              />
            </div>
            <div className="form-group mb-3">
              <ModalInput
                type="password"
                placeholder={"新密碼"}
                error={!!errorMessages.phone}
                value={password}
                onChange={(e) => {
                  setErrorMessages(initErrorMessage());
                  setPassword(e.target.value);
                }}
              />
              <div className="warning text-start text-danger">
                8字元以上，英數字混合。
              </div>
            </div>
            <div className="form-group mb-5">
              <ModalInput
                type="password"
                placeholder={"再次輸入新密碼"}
                error={!!errorMessages.phone}
                value={confirmPassword}
                onChange={(e) => {
                  setErrorMessages(initErrorMessage());
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>
            <div className="text-center">
              <DialogButton
                className="btn-secondary cancel"
                onClick={closeModal}
              >
                取消
              </DialogButton>
              <DialogButton className="btn-primary" onClick={submit}>
                確認
              </DialogButton>
            </div>
          </div>
        </ModalForgotWrapper>
      </DialogContentWrapper>
    </Dialog>
  );
};

const Login = () => {
  const navigate = useNavigate();

  const [modal, setModal] = useState(null);
  const [shouldModalOpen, setShouldModalOpen] = useState(false);

  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    setModal(null);
    setShouldModalOpen(false);
  };

  const submit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    login(account, password)
      .then(() => {
        navigate("/home", { replace: true });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <LoginWrapper className="d-flex flex-column justify-content-center">
        <div className="align-items-center" id="auth-left">
          <AuthLogo className="auth-logo">
            <div className="d-grid" style={{ justifyItems: "center" }}>
              <img src={logo2} alt="Logo" className="h-100" />
              <img src={logo1} alt="Logo" className="h-75" />
            </div>
          </AuthLogo>

          <LoginForm
            className="form mx-auto"
            onSubmit={submit}
            width={["60%", "60%", "30%"]}
          >
            <div className="form-group position-relative has-icon-left mb-3">
              <FormInput
                type="text"
                className="form-control form-control-xl usr"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Username"
              />
              <IconPerson className="form-control-icon position-absolute icon-person">
                <i className="bi bi-person-fill text-primary" />
              </IconPerson>
            </div>
            <div className="form-group position-relative has-icon-left mb-3">
              <FormInput
                type="password"
                className="form-control form-control-xl pwd"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <IconLock className="form-control-icon lock-icon position-absolute">
                <i className="bi bi-unlock-fill text-primary" />
              </IconLock>
            </div>
            {/*<ForgotPasswordLink onClick={() => {*/}
            {/*    setModal(modalForgot)*/}
            {/*    setShouldModalOpen(true)*/}
            {/*}}>*/}
            {/*    忘記密碼*/}
            {/*</ForgotPasswordLink>*/}
            <button
              className="btn btn-primary text-white w-100"
              disabled={isLoading}
            >
              LOGIN
            </button>
          </LoginForm>
        </div>
        {/*<div className="text-center" style={{ marginTop: '120px' }}>*/}
        {/*    <button className="btn btn-primary text-white px-4" disabled={isLoading} onClick={() => {*/}
        {/*        setModal(modalBeforeResetPassword)*/}
        {/*        setShouldModalOpen(true)*/}
        {/*    }}>密碼重設*/}
        {/*    </button>*/}
        {/*</div>*/}
      </LoginWrapper>

      {modal === modalForgot && shouldModalOpen && (
        <ForgotPasswordModal closeModal={closeModal} setModal={setModal} />
      )}

      {modal === modalSendRequirement && shouldModalOpen && (
        <SendRequirement closeModal={closeModal} />
      )}

      {modal === modalBeforeResetPassword && shouldModalOpen && (
        <BeforeResetPassword closeModal={closeModal} setModal={setModal} />
      )}

      {modal === modalResetPassword && shouldModalOpen && (
        <ResetPasswordModal closeModal={closeModal} setModal={setModal} />
      )}

      {modal === modalResetPasswordSuccess && shouldModalOpen && (
        <DoneDialog closeModal={closeModal} text={"修改完成"} />
      )}
    </>
  );
};

export default Login;
