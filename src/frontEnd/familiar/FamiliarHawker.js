import React, { useCallback, useEffect, useState } from "react";
import {
  PaginationWrapper,
  SearchIcon,
  SearchInput,
} from "../../component/StyledComponent";
import Table from "../../component/table/Table";
import {
  createFamiliarHawker,
  deleteFamiliarHawker,
  editFamiliarHawker,
  fetchFamiliarHawkers,
} from "../../api/hawker/Hawker";
import Pagination from "../../manager/components/pagination/Pagination";
import { Tr } from "../../component/table/TableStyle";
import Loading from "../../manager/components/loading/Loading";
import {
  AddNewFamiliarHawker,
  DeleteButton,
  EditButton,
  EditTitle,
  FHEditWrapper,
  FHStyledInput,
  FHStyledTextarea,
} from "./FamiliarHawkerStyle";
import Dialog, {
  DeleteDialog,
  DoneDialog,
} from "../../component/dialog/Dialog";
import {
  DialogButton,
  DialogContentWrapper,
  DialogTitle,
} from "../../component/dialog/DialogStyle";
import { TW_ZIP_CODE } from "../login/FirstLogin";
import { StyledFlexBox, StyledText } from "../../styles/Shared.styles";
import { CloseButton, StyledTd } from "../ing/IngStyle";

const modalDelete = "delete";
const modalDeleted = "deleted";
const modalEdit = "edit";
const modalEdited = "edited";
const modalCreate = "create";
const modalCreated = "created";

const FamiliarHawker = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [modal, setModal] = useState(null);
  const [shouldModalOpen, setShouldModalOpen] = useState(false);

  const [inputKeyword, setInputKeyword] = useState("");
  const [keyword, setKeyword] = useState("");

  const [familiarHawkers, setFamiliarHawkers] = useState([]);

  const [pageObject, setPageObject] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editNote, setEditNote] = useState("");

  const [city, setCity] = useState("台北市");
  const [districts, setDistricts] = useState(
    TW_ZIP_CODE[city].map((code) => code.district)
  );
  const [selectedDistrict, setSelectedDistrict] = useState(districts[0]);

  const ths = ["刪除", "編輯", "姓名", "電話", "地址", "備註"];

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState("");
  const onModalClose = () => {
    setModalOpen(false);
    setModalData({});
  };
  const onNoteModalOpen = (note) => {
    setModalOpen(true);
    setModalData(note);
  };

  const close = () => {
    setEditId(null);
    setModal(null);
    setShouldModalOpen(false);
  };

  const clear = () => {
    setEditName("");
    setEditPhone("");
    setEditAddress("");
    setEditNote("");
    setCity("台北市");
    setSelectedDistrict(districts[0]);
  };

  const getFamiliarHawkers = useCallback((currentPage, keyword) => {
    setIsLoading(true);
    fetchFamiliarHawkers({ page: currentPage, keyword })
      .then((res) => {
        setFamiliarHawkers(res.data);
        setPageObject(res.meta);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const deleteHawker = () => {
    deleteFamiliarHawker(editId)
      .then(() => {
        getFamiliarHawkers(currentPage, keyword);
        setModal(modalDeleted);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const edit = () => {
    editFamiliarHawker(editId, {
      name: editName,
      phone: editPhone,
      address: `${city}${selectedDistrict}${editAddress}`,
      note: editNote,
    })
      .then(() => {
        clear();
        getFamiliarHawkers(currentPage, keyword);
        setModal(modalEdited);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const create = () => {
    createFamiliarHawker({
      name: editName,
      phone: editPhone,
      address: `${city}${selectedDistrict}${editAddress}`,
      note: editNote,
    })
      .then(() => {
        clear();
        getFamiliarHawkers(currentPage, keyword);
        setModal(modalCreated);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getFamiliarHawkers(currentPage, keyword);
  }, [currentPage, keyword]);

  useEffect(() => {
    setDistricts(TW_ZIP_CODE[city].map((code) => code.district));
  }, [city]);

  useEffect(() => {
    setSelectedDistrict(districts[0]);
  }, [districts]);

  return (
    <StyledFlexBox
      className="container-fluid pb-5"
      flexDirection="column"
      px={["12px", "12px", 50]}
    >
      <StyledFlexBox
        className="align-items-center mt-5 mb-4"
        justifyContent="space-between"
      >
        <div>
          <AddNewFamiliarHawker
            onClick={() => {
              setModal(modalCreate);
              setShouldModalOpen(true);
            }}
          >
            <i className="bi bi-plus-circle-fill text-primary" />
          </AddNewFamiliarHawker>
        </div>
        <div className="position-relative">
          <SearchInput
            type="text"
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            placeholder="關鍵字搜尋..."
          />
          <SearchIcon onClick={() => setKeyword(inputKeyword)}>
            <i className="bi bi-search" />
          </SearchIcon>
        </div>
      </StyledFlexBox>
      <Table ths={ths} wrapperStyle={{ overflow: "auto" }}>
        {familiarHawkers.length > 0 ? (
          familiarHawkers.map((hawker) => (
            <Tr key={hawker.id}>
              <StyledTd>
                <DeleteButton
                  onClick={() => {
                    setEditId(hawker.id);
                    setModal(modalDelete);
                    setShouldModalOpen(true);
                  }}
                >
                  <i className="bi bi-slash-circle" />
                </DeleteButton>
              </StyledTd>
              <StyledTd>
                <EditButton
                  onClick={() => {
                    setEditId(hawker.id);
                    setEditName(hawker.name);
                    setEditPhone(hawker.phone);
                    setEditAddress(hawker.address);
                    setEditNote(hawker.note);
                    setModal(modalEdit);
                    setShouldModalOpen(true);
                  }}
                >
                  <i className="bi bi-pen" />
                </EditButton>
              </StyledTd>
              <StyledTd>{hawker.name}</StyledTd>
              <StyledTd>{hawker.phone}</StyledTd>
              <StyledTd>{hawker.address}</StyledTd>
              {/**<StyledTd display={["none", "none", "contents"]}>
                {hawker.note}
              </StyledTd>**/}
              <StyledTd>{hawker.note}</StyledTd>

              <StyledTd
                display={["contents", "contents", "none"]}
                width="100%"
                height="100%"
              >
                <StyledFlexBox
                  fontSize={12}
                  color="#ffbd3d"
                  justifyContent="center"
                  alignItems="center"
                  height={72.8}
                  onClick={() => onNoteModalOpen(hawker.note)}
                >
                  查看
                </StyledFlexBox>
              </StyledTd>
            </Tr>
          ))
        ) : (
          <Tr>
            <StyledTd colSpan={ths.length}>
              {isLoading ? <Loading /> : "無資料"}
            </StyledTd>
          </Tr>
        )}
      </Table>
      <PaginationWrapper>
        <Pagination
          pageObject={pageObject}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </PaginationWrapper>

      {modal === modalDelete && shouldModalOpen && (
        <Dialog onClose={close}>
          <DialogContentWrapper>
            <DialogTitle className="mb-4"> 確定是否立即刪除？</DialogTitle>
            <div>
              <DialogButton className="btn-secondary cancel" onClick={close}>
                取消
              </DialogButton>
              <DialogButton className="btn-danger" onClick={deleteHawker}>
                確認
              </DialogButton>
            </div>
          </DialogContentWrapper>
        </Dialog>
      )}

      {modal === modalDeleted && shouldModalOpen && (
        <DeleteDialog closeModal={close} text={"刪除成功"} />
      )}

      {modal === modalEdit && shouldModalOpen && (
        <Dialog onClose={close}>
          <DialogContentWrapper width={700}>
            <FHEditWrapper p={["32px 20px", "60px 40px", "60px 70px"]}>
              <EditTitle>編輯熟販友資訊</EditTitle>
              <div className="container mb-4">
                <StyledFlexBox
                  className="row mb-2"
                  flexDirection={["column", "row"]}
                >
                  <StyledFlexBox
                    className="col-3"
                    justifyContent={["flex-start", "flex-end"]}
                    width={["fit-content", "16%", "25%"]}
                  >
                    姓名
                  </StyledFlexBox>
                  <div className="col">
                    <FHStyledInput
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                </StyledFlexBox>
                <StyledFlexBox
                  className="row mb-2"
                  flexDirection={["column", "row"]}
                >
                  <StyledFlexBox
                    className="col-3"
                    justifyContent={["flex-start", "flex-end"]}
                    width={["fit-content", "16%", "25%"]}
                  >
                    聯絡電話
                  </StyledFlexBox>
                  <div className="col">
                    <FHStyledInput
                      type="text"
                      value={editPhone}
                      onChange={(e) =>
                        setEditPhone(e.target.value.replace(/\D+/g, ""))
                      }
                    />
                  </div>
                </StyledFlexBox>
                <StyledFlexBox
                  className="row mb-2"
                  flexDirection={["column", "row"]}
                >
                  <StyledFlexBox
                    className="col-3"
                    justifyContent={["flex-start", "flex-end"]}
                    width={["fit-content", "16%", "25%"]}
                  >
                    收貨地址
                  </StyledFlexBox>
                  <StyledFlexBox
                    className="col d-flex"
                    flexDirection={["column", "row"]}
                  >
                    <StyledFlexBox mb={["8px", 0]}>
                      <select
                        className="form-select border-primary me-1"
                        style={{ width: "fit-content" }}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      >
                        {Object.keys(TW_ZIP_CODE).map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>
                      <select
                        className="form-select border-primary mx-1"
                        value={selectedDistrict}
                        style={{ width: "fit-content" }}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                      >
                        {districts.map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>
                    </StyledFlexBox>
                    <FHStyledInput
                      type="text"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                    />
                  </StyledFlexBox>
                </StyledFlexBox>
                <StyledFlexBox
                  className="row mb-2"
                  flexDirection={["column", "row"]}
                >
                  <StyledFlexBox
                    className="col-3"
                    justifyContent={["flex-start", "flex-end"]}
                    width={["fit-content", "16%", "25%"]}
                  >
                    附註
                  </StyledFlexBox>
                  <div className="col">
                    <FHStyledTextarea
                      rows={8}
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                    />
                  </div>
                </StyledFlexBox>
              </div>
              <StyledFlexBox className="text-center" justifyContent="center">
                <DialogButton className="btn-secondary cancel" onClick={close}>
                  取消
                </DialogButton>
                <DialogButton className="btn-primary" onClick={edit}>
                  確認
                </DialogButton>
              </StyledFlexBox>
            </FHEditWrapper>
          </DialogContentWrapper>
        </Dialog>
      )}
      {modal === modalEdited && shouldModalOpen && (
        <DoneDialog closeModal={close} text={"已編輯"} />
      )}

      {modal === modalCreate && shouldModalOpen && (
        <Dialog onClose={close}>
          <DialogContentWrapper width={700}>
            <FHEditWrapper p={["32px 20px", "60px 40px", "60px 70px"]}>
              <EditTitle>新增熟販友資訊</EditTitle>
              <div className="container mb-4">
                <StyledFlexBox
                  className="row mb-2"
                  flexDirection={["column", "row"]}
                >
                  <StyledFlexBox
                    className="col-3"
                    justifyContent={["flex-start", "flex-end"]}
                    width={["fit-content", "16%", "25%"]}
                  >
                    姓名
                  </StyledFlexBox>
                  <div className="col">
                    <FHStyledInput
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                </StyledFlexBox>
                <StyledFlexBox
                  className="row mb-2"
                  flexDirection={["column", "row"]}
                >
                  <StyledFlexBox
                    className="col-3"
                    justifyContent={["flex-start", "flex-end"]}
                    width={["fit-content", "16%", "25%"]}
                  >
                    聯絡電話
                  </StyledFlexBox>
                  <div className="col">
                    <FHStyledInput
                      type="text"
                      value={editPhone}
                      onChange={(e) =>
                        setEditPhone(e.target.value.replace(/\D+/g, ""))
                      }
                    />
                  </div>
                </StyledFlexBox>
                <StyledFlexBox
                  className="row mb-2"
                  flexDirection={["column", "row"]}
                >
                  <StyledFlexBox
                    className="col-3"
                    justifyContent={["flex-start", "flex-end"]}
                    width={["fit-content", "16%", "25%"]}
                  >
                    收貨地址
                  </StyledFlexBox>
                  <StyledFlexBox
                    className="col d-flex"
                    flexDirection={["column", "row"]}
                  >
                    <StyledFlexBox mb={["8px", 0]}>
                      <select
                        className="form-select border-primary me-1"
                        style={{ width: "fit-content" }}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      >
                        {Object.keys(TW_ZIP_CODE).map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>
                      <select
                        className="form-select border-primary mx-1"
                        value={selectedDistrict}
                        style={{ width: "fit-content" }}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                      >
                        {districts.map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>
                    </StyledFlexBox>
                    <FHStyledInput
                      type="text"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                    />
                  </StyledFlexBox>
                </StyledFlexBox>
                <StyledFlexBox
                  className="row mb-2"
                  flexDirection={["column", "row"]}
                >
                  <StyledFlexBox
                    className="col-3"
                    justifyContent={["flex-start", "flex-end"]}
                    width={["fit-content", "16%", "25%"]}
                  >
                    附註
                  </StyledFlexBox>
                  <div className="col">
                    <FHStyledTextarea
                      rows={8}
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                    />
                  </div>
                </StyledFlexBox>
              </div>
              <StyledFlexBox className="text-center" justifyContent="center">
                <DialogButton className="btn-secondary cancel" onClick={close}>
                  取消
                </DialogButton>
                <DialogButton className="btn-primary" onClick={create}>
                  確認
                </DialogButton>
              </StyledFlexBox>
            </FHEditWrapper>
          </DialogContentWrapper>
        </Dialog>
      )}
      {modal === modalCreated && shouldModalOpen && (
        <DoneDialog closeModal={close} text={"已新增"} />
      )}
      {modalOpen && (
        <Dialog onClose={onModalClose}>
          <DialogContentWrapper className="p-3" width={323} height={156}>
            <StyledFlexBox
              width={323}
              height={156}
              flexDirection="column"
              justifyContent="center"
            >
              <CloseButton onClick={onModalClose} />
              <StyledText fontSize={14} width={260} mx="auto" lineHeight="23px">
                備註內容 <br />
                {modalData}
              </StyledText>
            </StyledFlexBox>
          </DialogContentWrapper>
        </Dialog>
      )}
    </StyledFlexBox>
  );
};

export default FamiliarHawker;
