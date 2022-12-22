import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import _ from "lodash";
import {
  ContentWrapper,
  OperateButton,
} from "../../../component/StyledComponent";
import BackBtn from "../../components/general/BackBtn";
import {
  changeCompanyStats,
  editCompany,
  fetchCompany,
  fetchCompanyTypes,
} from "../../../api/Company";
import {
  EditRow,
  EditTitle,
  EditWrapper,
  Label,
  SaveButton,
  StyledInput,
  StyledSelect,
} from "./EditCompanyStyle";
import Dialog, {
  CancelledDialog,
  DoneDialog,
} from "../../../component/dialog/Dialog";
import {
  DialogButton,
  DialogContentWrapper,
  DialogTitle,
} from "../../../component/dialog/DialogStyle";

const InactiveCompanyDialog = ({
  closeModal,
  isLoading,
  onChangeCompanyStats,
}) => (
  <Dialog onClose={closeModal}>
    <DialogContentWrapper width={488} height={297}>
      <DialogTitle className="mb-5">確定取消合作此廠商嗎？</DialogTitle>
      <div>
        <DialogButton className="btn-secondary cancel" onClick={closeModal}>
          取消
        </DialogButton>
        <DialogButton
          className="btn-primary"
          disabled={isLoading}
          onClick={() => onChangeCompanyStats(0)}
        >
          確認
        </DialogButton>
      </div>
    </DialogContentWrapper>
  </Dialog>
);

const ActiveCompanyDialog = ({
  closeModal,
  isLoading,
  onChangeCompanyStats,
}) => (
  <Dialog onClose={closeModal}>
    <DialogContentWrapper width={488} height={297}>
      <DialogTitle className="mb-5">確定要合作此廠商嗎？</DialogTitle>
      <div>
        <DialogButton className="btn-secondary cancel" onClick={closeModal}>
          取消
        </DialogButton>
        <DialogButton
          className="btn-primary"
          disabled={isLoading}
          onClick={() => onChangeCompanyStats(1)}
        >
          確認
        </DialogButton>
      </div>
    </DialogContentWrapper>
  </Dialog>
);

const EditCompany = () => {
  const navigate = useNavigate();
  const bankObject = useOutletContext();
  const { companyId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const [companyDetail, setCompanyDetail] = useState({});
  const [companyTypes, setCompanyTypes] = useState([]);

  const [name, setName] = useState("");
  const [window, setWindow] = useState("");
  const [selectedType, setSelectedType] = useState("-");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [checkout, setCheckout] = useState("");

  const [shouldOpenModal, setShouldOpenModal] = useState(false);
  const [modal, setModal] = useState(null);

  const closeModal = () => {
    setShouldOpenModal(false);
  };

  const getCompanyDetail = useCallback(
    (companyId) => {
      fetchCompany(companyId)
        .then((res) => {
          setCompanyDetail(res.data);
          setAddress(res.data.address);
          setBankAccount(res.data.bank_account);
          setBankCode(res.data.bank_code);
          setCheckout(res.data.checkout);
          setName(res.data.name);
          setPhone(res.data.phone);
          setWindow(res.data.window);
          setWindow(res.data.window);
          setSelectedType(res.data.type);
        })
        .catch((error) => console.error(error))
        .finally(() => setIsLoading(false));
    },
    [companyId]
  );

  const onChangeCompanyStats = (stats) => {
    setIsLoading(true);
    changeCompanyStats(stats, [companyDetail.id])
      .then(() => {
        getCompanyDetail(companyId);

        if (stats === 1) {
          setModal("confirmActive");
        } else {
          setModal("confirmInactive");
        }
      })
      .catch((error) => console.error(error));
  };

  const edit = () => {
    setIsLoading(true);
    editCompany(companyId, {
      name,
      window,
      type: selectedType,
      phone,
      address,
      bank_account: bankAccount,
      bank_code: bankCode,
      checkout,
    })
      .then(() => {
        getCompanyDetail(companyId);
        setModal("edited");
        setShouldOpenModal(true);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    setIsLoading(true);
    getCompanyDetail(companyId);
  }, [getCompanyDetail, companyId]);

  useEffect(() => {
    fetchCompanyTypes({ page: 1 })
      .then((res) => setCompanyTypes(res.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="container-fluid p-5 text-center">
      <div className="d-flex justify-content-between align-items-center">
        <BackBtn
          text={"回列表"}
          onClickCallback={() => navigate("/manager/company")}
        />
        <div>
          {companyDetail.stats === 0 && (
            <OperateButton
              className="btn-primary text-white"
              onClick={() => {
                setModal("activeCompany");
                setShouldOpenModal(true);
              }}
            >
              上架
            </OperateButton>
          )}

          {companyDetail.stats === 1 && (
            <OperateButton
              className="btn-secondary"
              onClick={() => {
                setModal("inactiveCompany");
                setShouldOpenModal(true);
              }}
            >
              下架
            </OperateButton>
          )}
        </div>
      </div>

      <EditTitle>編輯廠商</EditTitle>
      <ContentWrapper>
        <EditWrapper>
          <EditRow>
            <div className="col-2">
              <Label>廠商名稱</Label>
            </div>
            <div className="col">
              <StyledInput
                type="text"
                className="form-control border-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </EditRow>
          <EditRow>
            <div className="col-2">
              <Label>窗&emsp;&emsp;口</Label>
            </div>
            <div className="col">
              <StyledInput
                type="text"
                className="form-control border-primary"
                value={window}
                onChange={(e) => setWindow(e.target.value)}
              />
            </div>
          </EditRow>
          <EditRow>
            <div className="col-2">
              <Label>分&emsp;&emsp;類</Label>
            </div>
            <div className="col">
              <StyledSelect
                className="form-select border-primary"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {companyTypes.map((type) => {
                  return (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  );
                })}
              </StyledSelect>
            </div>
          </EditRow>
          <EditRow>
            <div className="col-2">
              <Label>聯絡電話</Label>
            </div>
            <div className="col">
              <StyledInput
                type="text"
                className="form-control border-primary"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </EditRow>
          <EditRow>
            <div className="col-2">
              <Label>地&emsp;&emsp;址</Label>
            </div>
            <div className="col">
              <StyledInput
                type="text"
                className="form-control border-primary"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </EditRow>
          <EditRow>
            <div className="col-2">
              <Label>銀行代碼</Label>
            </div>
            <div className="col">
              <StyledSelect
                className="form-select border-primary w-50"
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
              >
                <option value="-" disabled>
                  請選擇
                </option>
                {!_.isEmpty(bankObject) &&
                  bankObject.banks.map((bank) => (
                    <option key={bank.bank_code} value={bank.bank_code}>
                      {bank.bank_code} {bank.name}
                    </option>
                  ))}
              </StyledSelect>
            </div>
          </EditRow>
          <EditRow>
            <div className="col-2">
              <Label>銀行帳戶</Label>
            </div>
            <div className="col">
              <StyledInput
                type="text"
                className="form-control border-primary"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
              />
            </div>
          </EditRow>
          <EditRow>
            <div className="col-2">
              <Label>結帳方式 </Label>
            </div>
            <div className="col">
              <StyledSelect
                className="form-select border-primary w-50"
                value={checkout}
                onChange={(e) => setCheckout(e.target.value)}
              >
                <option value="-" disabled>
                  請選擇
                </option>
                <option value="單筆結">單筆結</option>
                <option value="月結">月結</option>
              </StyledSelect>
            </div>
          </EditRow>
        </EditWrapper>
      </ContentWrapper>
      <SaveButton disabled={isLoading} onClick={edit}>
        儲存
      </SaveButton>

      {modal === "activeCompany" && shouldOpenModal && (
        <ActiveCompanyDialog
          closeModal={closeModal}
          isLoading={isLoading}
          onChangeCompanyStats={onChangeCompanyStats}
        />
      )}

      {modal === "confirmActive" && shouldOpenModal && (
        <DoneDialog closeModal={closeModal} text={"已重新合作廠商"} />
      )}

      {modal === "inactiveCompany" && shouldOpenModal && (
        <InactiveCompanyDialog
          closeModal={closeModal}
          isLoading={isLoading}
          onChangeCompanyStats={onChangeCompanyStats}
        />
      )}

      {modal === "confirmInactive" && shouldOpenModal && (
        <CancelledDialog closeModal={closeModal} text={"已下架廠商"} />
      )}

      {modal === "edited" && shouldOpenModal && (
        <DoneDialog closeModal={closeModal} text={"已儲存"} />
      )}
    </div>
  );
};

export default EditCompany;
