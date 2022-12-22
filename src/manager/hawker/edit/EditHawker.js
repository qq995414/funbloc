import React, { useCallback, useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import {
  activateHawker,
  blockHawker,
  editHawker,
  fetchBlockHawker,
  fetchHawker,
  fetchHawkerTypes,
} from "../../../api/hawker/ManagerHawker";
import {
  ActivateButton,
  ActivateDivider,
  ActivateTitle,
  BlockButton,
  BlockContent,
  BlockedReason,
  BlockTextarea,
  ButtonWrapper,
  Field,
  HawkerDetailTitle,
  Label,
  StyledCol,
  StyledRow,
  StyledSelect,
  StyledTextarea,
} from "./EditHawkerStyle";
import _ from "lodash";
import Table from "../../../component/table/Table";
import Dialog, {
  CancelledDialog,
  DoneDialog,
} from "../../../component/dialog/Dialog";
import {
  DialogButton,
  DialogContentWrapper,
} from "../../../component/dialog/DialogStyle";
import { fetchOrders } from "../../../api/order/ManagerOrder";
import { Tr } from "../../../component/table/TableStyle";
import { numberWithThousandCommas } from "../../../helper/Helper";
import Loading from "../../components/loading/Loading";

const ths = [
  "開團日期",
  "小販團編號",
  "名稱",
  "應付總額",
  "銷售總額",
  "賺取的差額",
  "狀態",
];

const EditHawker = () => {
  const { hawkerId } = useParams();
  const bankObject = useOutletContext();

  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);

  const [hawkerDetail, setHawkerDetail] = useState({});
  const [selectedHawkerType, setSelectedHawkerType] = useState("");
  const [hawkerTypes, setHawkerTypes] = useState([]);
  const [orders, setOrders] = useState([]);

  const [blockNote, setBlockNote] = useState("");

  const [editNote, setEditNote] = useState("");

  const getBlockHawker = useCallback(() => {
    fetchBlockHawker(hawkerId)
      .then((res) => {
        setBlockNote(res.data.note);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [hawkerId]);

  const getHawkerDetail = useCallback(() => {
    fetchHawker(hawkerId)
      .then((res) => {
        setHawkerDetail(res.data);
        setEditNote(res.data.note);
        setSelectedHawkerType(res.data.type);
        if (res.data.stats === 0) {
          getBlockHawker();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [hawkerId, getBlockHawker]);

  const closeModal = () => {
    setShouldOpenModal(false);
  };

  const block = () => {
    setIsLoading(true);
    blockHawker(hawkerId, blockNote)
      .then(() => {
        setModal("blocked");
        getHawkerDetail();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const activate = () => {
    setIsLoading(true);
    activateHawker(hawkerId)
      .then(() => {
        setModal("activated");
        getHawkerDetail();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const editHawkerType = () => {
    setIsLoading(true);
    editHawker(hawkerId, {
      name: hawkerDetail.name,
      phone: hawkerDetail.phone,
      account: hawkerDetail.account,
      type: selectedHawkerType,
      note: editNote,
    })
      .then(() => {
        getHawkerDetail();
        setModal("type-edited");
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
    getHawkerDetail();

    fetchHawkerTypes({ page: 1, perPage: 1000 })
      .then((res) => {
        setHawkerTypes(res.data);
      })
      .catch((error) => {
        console.error(error);
      });

    fetchOrders({ page: 1, perPage: 1000, hawkerId })
      .then((res) => {
        setOrders(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [getHawkerDetail, hawkerId]);

  return (
    <div className="container-fluid p-5">
      <ButtonWrapper>
        {hawkerDetail.stats === 0 && (
          <ActivateButton
            onClick={() => {
              setModal("activate");
              setShouldOpenModal(true);
            }}
          >
            <i className="bi bi-shield-check me-2" />
            恢復權限
          </ActivateButton>
        )}
        {[1, 2].includes(hawkerDetail.stats) && (
          <BlockButton
            onClick={() => {
              setModal("block");
              setShouldOpenModal(true);
            }}
          >
            <i className="bi bi-shield-x me-2" />
            黑名單小販
          </BlockButton>
        )}
      </ButtonWrapper>

      <HawkerDetailTitle>小販資訊</HawkerDetailTitle>
      <div className="container-fluid px-4">
        <StyledRow className="row">
          <StyledCol>
            <Label>姓&emsp;&emsp;名</Label>
            <Field>{hawkerDetail.name}</Field>
          </StyledCol>
          <StyledCol className="align-items-center">
            <Label>分&emsp;&emsp;類</Label>
            <Field className="w-100 d-flex justify-content-between">
              <StyledSelect
                className="w-25"
                disabled={isLoading}
                value={selectedHawkerType}
                onChange={(e) => setSelectedHawkerType(e.target.value)}
              >
                {hawkerTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </StyledSelect>
              <button
                className="btn btn-primary text-white ms-3"
                style={{ width: "120px" }}
                onClick={editHawkerType}
              >
                儲存變更
              </button>
            </Field>
          </StyledCol>
        </StyledRow>
        <StyledRow>
          <StyledCol>
            <Label>加入日期</Label>
            <Field>{hawkerDetail.join_at}</Field>
          </StyledCol>
        </StyledRow>
        <StyledRow>
          <StyledCol>
            <Label>連絡電話</Label>
            <Field>{hawkerDetail.phone}</Field>
          </StyledCol>
          <StyledCol>
            <Label>銀行代碼</Label>
            <Field>
              {hawkerDetail.bank_code}
              {!_.isEmpty(bankObject) && bankObject.map[hawkerDetail.bank_code]}
            </Field>
          </StyledCol>
        </StyledRow>
        <StyledRow>
          <StyledCol>
            <Label>通訊地址</Label>
            <Field>{hawkerDetail.address}</Field>
          </StyledCol>
          <StyledCol>
            <Label>銀行帳戶</Label>
            <Field>{hawkerDetail.bank_account}</Field>
          </StyledCol>
        </StyledRow>
        <StyledRow>
          <StyledCol className="align-items-start">
            <Label>備&emsp;&emsp;註</Label>
            <StyledTextarea
              rows={8}
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
            />
          </StyledCol>
        </StyledRow>
      </div>

      <HawkerDetailTitle>最新小販揪團紀錄</HawkerDetailTitle>
      <Table ths={ths}>
        {orders.length > 0 ? (
          orders.map((order) => {
            return (
              <Tr key={order.id}>
                <td>{order.createAt}</td>
                <td>{order.num}</td>
                <td>{order.funblocName}</td>
                <td>{numberWithThousandCommas(order.totalCost)}</td>
                <td>{numberWithThousandCommas(order.totalMyPrice)}</td>
                <td>{numberWithThousandCommas(order.totalProfit)}</td>
                <td>
                  <div>
                    帳務
                    {order.isPaymentDate ? (
                      <i className="bi bi-check-circle-fill ms-1 text-success-light" />
                    ) : (
                      <i className="bi bi-x-circle-fill ms-1 text-danger" />
                    )}
                  </div>
                  <div>
                    訂單
                    {order.isOrderDate ? (
                      <i className="bi bi-check-circle-fill ms-1 text-success-light" />
                    ) : (
                      <i className="bi bi-x-circle-fill ms-1 text-danger" />
                    )}
                  </div>
                </td>
              </Tr>
            );
          })
        ) : (
          <Tr>
            <td colSpan={ths.length}>{isLoading ? <Loading /> : "無資料"}</td>
          </Tr>
        )}
      </Table>

      {modal === "block" && shouldOpenModal && (
        <Dialog onClose={closeModal}>
          <DialogContentWrapper className="p-5">
            <BlockContent>
              【{hawkerDetail.name}】即將被列入黑名單
              <br />
              若想恢復權限，請至黑名單頁面取消
            </BlockContent>
            <BlockTextarea
              rows={8}
              placeholder="請輸入被加入黑名單的原因"
              value={blockNote}
              onChange={(e) => setBlockNote(e.target.value)}
            />
            <div className="mt-5">
              <DialogButton
                className="btn-secondary cancel"
                onClick={closeModal}
              >
                取消
              </DialogButton>
              <DialogButton
                className="btn-primary"
                disabled={isLoading}
                onClick={block}
              >
                確認
              </DialogButton>
            </div>
          </DialogContentWrapper>
        </Dialog>
      )}
      {modal === "blocked" && shouldOpenModal && (
        <CancelledDialog
          text={`${hawkerDetail.name}已被設定黑名單`}
          closeModal={closeModal}
        />
      )}
      {modal === "activate" && shouldOpenModal && (
        <Dialog onClose={closeModal}>
          <DialogContentWrapper className="p-5">
            <div>
              <ActivateTitle>黑名單原因</ActivateTitle>
              <BlockedReason>{blockNote}</BlockedReason>
              <ActivateDivider />
              <ActivateTitle className="text-center">
                確定要讓【{hawkerDetail.name}】恢復權限嗎？
              </ActivateTitle>
              <div className="d-flex justify-content-center mt-5">
                <DialogButton
                  className="btn-secondary cancel"
                  onClick={closeModal}
                >
                  取消
                </DialogButton>
                <DialogButton
                  className="btn-primary"
                  disabled={isLoading}
                  onClick={activate}
                >
                  確認
                </DialogButton>
              </div>
            </div>
          </DialogContentWrapper>
        </Dialog>
      )}

      {modal === "activated" && shouldOpenModal && (
        <DoneDialog text={`已恢復權限`} closeModal={closeModal} />
      )}

      {modal === "type-edited" && shouldOpenModal && (
        <DoneDialog text={`已儲存`} closeModal={closeModal} />
      )}
    </div>
  );
};

export default EditHawker;
