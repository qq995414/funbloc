import React, { useEffect, useState } from "react";
import { CancelButton, FormContainer, SaveButton, Title } from "./MyStyle";
import { StyledInput } from "../login/LoginStyle";
import { editPassword, fetchMe } from "../../api/admin/Admin";
import { DoneDialog } from "../../component/dialog/Dialog";
import { useNavigate } from "react-router-dom";
import { StyledFlexBox } from "../../styles/Shared.styles";

const modalDone = "modal-done";

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [modal, setModal] = useState(null);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);

  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitPassword = () => {
    editPassword({
      password,
      password_confirmation: confirmPassword,
    })
      .then(() => {
        setModal(modalDone);
        setShouldOpenModal(true);

        setPassword("");
        setConfirmPassword("");
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
      <Title>修改密碼</Title>

      <FormContainer className="justify-content-center" minHeight={[256, 400]}>
        <StyledFlexBox mb={16}>
          <StyledFlexBox
            minWidth={[73, 87]}
            justifyContent="flex-end"
            alignItems="center"
            mr={[20, 40]}
            fontSize={[12, 14]}
          >
            會員帳號
          </StyledFlexBox>
          <StyledFlexBox height={45} alignItems="center">
            {account}
          </StyledFlexBox>
        </StyledFlexBox>
        <StyledFlexBox alignItems={["initial", "center"]} mb={16}>
          <StyledFlexBox
            minWidth={[73, 87]}
            justifyContent="flex-end"
            alignItems="center"
            mr={[20, 40]}
            fontSize={[12, 14]}
          >
            輸入新密碼
          </StyledFlexBox>
          <StyledFlexBox flexDirection={["column", "row"]} width="100%">
            <StyledFlexBox width={[150]} height={29}>
              <StyledInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </StyledFlexBox>
            <StyledFlexBox
              className="text-danger"
              fontSize={[11, 13]}
              ml={[0, 12]}
            >
              8字元以上，英數字混合。
            </StyledFlexBox>
          </StyledFlexBox>
        </StyledFlexBox>
        <StyledFlexBox>
          <StyledFlexBox
            minWidth={[73, 87]}
            justifyContent="flex-end"
            alignItems="center"
            mr={[20, 40]}
            fontSize={[12, 14]}
          >
            再次輸入密碼
          </StyledFlexBox>
          <StyledFlexBox width={[150]} height={29}>
            <StyledInput
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </StyledFlexBox>
        </StyledFlexBox>
      </FormContainer>
      <div className="text-center mt-4">
        <CancelButton className="mx-2" onClick={() => navigate("/home")}>
          取消修改
        </CancelButton>
        <SaveButton
          className="mx-2"
          disabled={isLoading}
          onClick={submitPassword}
        >
          確定修改
        </SaveButton>
      </div>

      {modal === modalDone && shouldOpenModal && (
        <DoneDialog
          closeModal={() => setShouldOpenModal(false)}
          text={"修改成功"}
        />
      )}
    </StyledFlexBox>
  );
};

export default ResetPasswordPage;
