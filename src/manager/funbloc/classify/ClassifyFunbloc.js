import React, { useCallback, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import BackBtn from "../../components/general/BackBtn";
import {
    AddSubTypeButton,
    ClassifyInput,
    ClassifyLabel,
    ClassifyTextarea,
    ContentWrapperButton,
    DeleteButton,
    EditButton,
    Label,
    ProductTab,
    SubTypeItem,
    SubTypeTitle,
    Value,
    ContentWrapperTitle
} from "../../product/classify/ClassifyProductStyle"
import {
    createFunblocSubType,
    createFunblocType,
    deleteFunblocSubType,
    deleteFunblocType,
    editFunblocType,
    fetchFunblocTypeDetail,
    fetchFunblocTypes,
    sortFunblocType,
    sortIdFunblocType,
    editSubFunblocType
} from "../../../api/funbloc/ManagerFunbloc"
import Dialog, {
    CancelledDialog,
    DoneDialog,
} from "../../../component/dialog/Dialog";
import {
    DialogButton,
    DialogContentWrapper,
    DialogTitle,
} from "../../../component/dialog/DialogStyle";
import { ContentWrapper, ContentWrapperClass } from "../../../component/StyledComponent";
import SortableTable from "./ClassTypeSortableTable";
import ClassSecondaryTypeSortableTable from "./ClassSecondaryTypeSortableTable";
import { StyledSelect } from "../../admin/AdminStyle";

const generateCreateTypeObject = () => ({
    num: "",
    name: "",
    note: "",
});

const generateSubTypeObject = () => ({
    typeId: "", // 主分類,
    num: "", //自訂編號
    name: "", // 名稱
    note: "",
});

const CreateAndEditModal = ({
    closeModal,
    funblocTypeObject,
    setFunblocTypeObject,
    title,
    children,
}) => {
    return (
        <Dialog onClose={closeModal}>
            <DialogContentWrapper className="p-3" width={500} height={450}>
                <div className="container mb-5 px-5">
                    <div className="row mb-3">
                        <ClassifyLabel className="col-4 text-indent">
                            分類代碼
                        </ClassifyLabel>
                        <div className="col">
                            <ClassifyInput
                                type="text"
                                className="form-control border-primary"
                                value={funblocTypeObject.num}
                                onChange={(e) =>
                                    setFunblocTypeObject((prev) => ({
                                        ...prev,
                                        num: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <ClassifyLabel className="col-4 text-indent">
                            分類名稱
                        </ClassifyLabel>
                        <div className="col">
                            <ClassifyInput
                                type="text"
                                className="form-control border-primary"
                                value={funblocTypeObject.name}
                                onChange={(e) =>
                                    setFunblocTypeObject((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                    <div className="row">
                        <ClassifyLabel className="col-4 text-indent">
                            備註說明
                        </ClassifyLabel>
                        <div className="col">
                            <ClassifyTextarea
                                type="text"
                                rows="4"
                                className="form-control border-primary"
                                value={funblocTypeObject.note}
                                onChange={(e) =>
                                    setFunblocTypeObject((prev) => ({
                                        ...prev,
                                        note: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>
                {children}
            </DialogContentWrapper>
        </Dialog>
    );
};


export const SubTypeSettingModal = ({
    closeModal,
    currentTypeDetail,
    createSubType,
    deleteSubType,
    refreshCurrentTypeDetail,
}) => {
    const [showInput, setShowInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [beingSetSubType, setBeingSetSubType] = useState("");

    const onSubTypeChanged = (subType) => {
        setBeingSetSubType(subType);
    };

    const onInputKeyUp = (e) => {
        if (e.key === "Enter") {
            setSubType();
        }
    };

    const addSubTypeInput = () => {
        setShowInput(true);
    };

    const setSubType = () => {
        if (isLoading) return;
        setIsLoading(true);

        createSubType(currentTypeDetail.id, beingSetSubType)
            .then(async () => {
                await refreshCurrentTypeDetail(currentTypeDetail.id);
                setBeingSetSubType("");
                setShowInput(false);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const deleteType = (id) => {
        if (isLoading) return;
        setIsLoading(true);

        deleteSubType(id)
            .then(async () => {
                await refreshCurrentTypeDetail(currentTypeDetail.id);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <Dialog onClose={closeModal}>
            <DialogContentWrapper
                className="p-3 pt-5 justify-content-start"
                width={500}
                minHeight={450}
            >
                <DialogTitle className="mb-4 text-primary">
                    {currentTypeDetail.name}
                </DialogTitle>
                <SubTypeTitle>次分類名稱</SubTypeTitle>
                {currentTypeDetail.sub.map((subType) => {
                    return (
                        <SubTypeItem key={subType.id}>
                            <div className="w-100 me-2 text-center">{subType.name}</div>
                            <button
                                className="btn btn-danger text-white"
                                disabled={isLoading}
                                onClick={() => deleteType(subType.id)}
                            >
                                <i className="bi bi-trash" />
                            </button>
                        </SubTypeItem>
                    );
                })}
                {showInput && (
                    <div className="w-75 d-flex mt-3">
                        <input
                            type="text"
                            className="form-control border-primary w-100 me-2"
                            value={beingSetSubType}
                            onChange={(e) => onSubTypeChanged(e.target.value)}
                            onKeyUp={onInputKeyUp}
                        />
                        <button className="btn btn-danger text-white" disabled={isLoading}>
                            <i className="bi bi-trash" />
                        </button>
                    </div>
                )}
                <AddSubTypeButton onClick={addSubTypeInput} disabled={isLoading} />
            </DialogContentWrapper>
        </Dialog>
    );
};

const newSubTypeSetting = "newSubTypeSetting";
const createdNewSubType = "created-new-subType";
const editSubTypeSetting = "editSubTypeSetting";
const editTypeSetting = "editTypeSetting";

const editedSubType = "edited-subType";
const deleteSubTypeSetting = "deleteSubTypeSetting";
const deleteTypeSetting = "deleteTypeSetting";
const deletedSubType = "deleted-subType";

const ClassifyFunbloc = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const [modal, setModal] = useState(null);
    const [shouldOpenModal, setShouldOpenModal] = useState(false);

    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [selectedSubTypeId, setSelectedSubTypeId] = useState(null);
    const [types, setTypes] = useState([]);
    const [subTypes, setSubTypes] = useState([]);
    const [subMainTypes, setSubMainTypes] = useState([]);
    const [subSecondaryTypes, setSubSecondaryTypes] = useState([]);
    const [currentTypeDetail, setCurrentTypeDetail] = useState({});

    const [editFunblocTypeId, setEditFunblocTypeId] = useState("");
    const [funblocTypeObject, setFunblocTypeObject] = useState(() =>
        generateCreateTypeObject()
    );

    const [subTypeObject, setSubTypeObject] = useState(() =>
        generateSubTypeObject()
    );

    const [shouldSort, setShouldSort] = useState(false);

    const closeModal = () => {
        setModal(null);
        setShouldOpenModal(false);
        setFunblocTypeObject(generateCreateTypeObject());
        setSubTypeObject(generateSubTypeObject());
    };

    const getFunblocTypes = useCallback(() => {
        fetchFunblocTypes({ page: 1 })
            .then((res) => {
                setTypes(res.data);
                setSubMainTypes(
                    res.data.reduce((prev, type) => {
                        if (type.sub.length > 0) {
                            const subMainTypes = {
                                id: type.id,
                                name: type.name,
                                num: type.num,
                                subTypeId: type.id
                            };
                            return prev.concat(subMainTypes);
                        } else {
                            return prev.concat([
                                {
                                    id: type.id,
                                    name: type.name,
                                    num: type.num,
                                },
                            ]);
                        }
                    }, [])
                );
                setSubTypes(
                    res.data.reduce((prev, type) => {
                        if (type.sub.length > 0) {
                            const subTypes = type.sub.map((subType) => ({
                                subTypeId: subType.id,
                                subTypeNum: subType.num,
                                subTypeName: subType.name,
                                id: type.id,
                                name: type.name,
                                num: type.num,
                            }));
                            return prev.concat(subTypes);
                        } else {
                            return prev.concat([
                                {
                                    id: type.id,
                                    name: type.name,
                                    num: type.num,
                                },
                            ]);
                        }
                    }, [])
                );

            })
            .catch((error) => console.error(error))
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const handleCreate = () => {
        setIsLoading(true);

        const { note, num, name } = funblocTypeObject;

        createFunblocType(num, name, note)
            .then(() => {
                getFunblocTypes();
                setModal("created");
            })
            .catch((error) => console.error(error))
            .finally(() => setIsLoading(false));
    };
    const handleSubCreate = () => {
        setIsLoading(true);

        const { note, num, name } = funblocTypeObject;

        createFunblocSubType(selectedTypeId, funblocTypeObject)
            .then(() => {
                getFunblocTypes();
                setModal("created");
            })
            .catch((error) => console.error(error))
            .finally(() => setIsLoading(false));
    };
    const handleEdit = () => {
        setIsLoading(true);

        const { note, num, name, subType } = funblocTypeObject;

        editFunblocType(editFunblocTypeId, num, name, subType, note)
            .then(() => {
                getFunblocTypes();
                getFunblocTypeDetail(editFunblocTypeId, selectedSubTypeId);
                setModal("edited");
            })
            .catch((error) => console.error(error))
            .finally(() => setIsLoading(false));
    };

    const createNewSubType = () => {
        /* if (subTypeObject.typeId === "") return;
         if (subTypeObject.name === "") return;
         if (subTypeObject.num === "") return;
 
         setIsLoading(true);
         createFunblocSubType(subTypeObject.typeId, subTypeObject)
             .then(() => {
                 getFunblocTypes();
                 getFunblocTypeDetail(subTypeObject.typeId, selectedSubTypeId);
                 setModal(createdNewSubType);
             })
             .catch((error) => console.error(error))
             .finally(() => setIsLoading(false));*/
        console.log("NewSub")
    };

    const editSubType = () => {
        if (subTypeObject.typeId === "") return;
        if (subTypeObject.name === "") return;
        if (subTypeObject.num === "") return;
        setIsLoading(true);
        editSubFunblocType(subTypeObject)
            .then(() => {
                getFunblocTypes();
                getFunblocTypeDetail(subTypeObject.typeId, selectedSubTypeId);
                setModal(editedSubType);
            })
            .catch((error) => console.error(error))
            .finally(() => setIsLoading(false));

    };
    const editType = () => {
        if (subTypeObject.typeId === "") return;
        if (subTypeObject.name === "") return;
        if (subTypeObject.num === "") return;
        setIsLoading(true);
        editFunblocType(subTypeObject)
            .then(() => {
                getFunblocTypes();
                setModal(editedSubType);
            })
            .catch()
            .finally(() => setIsLoading(false));

    };

    const deleteSubType = () => {
        setIsLoading(true);

        deleteFunblocSubType(subTypeObject.id)
            .then(() => {
                getFunblocTypes();
                getFunblocTypeDetail(subTypeObject.typeId, selectedSubTypeId);
                setModal(deletedSubType);
            })
            .catch((error) => console.error(error))
            .finally(() => setIsLoading(false));
    };
    const deleteType = () => {
        setIsLoading(true);

        deleteFunblocType(subTypeObject.typeId)
            .then(() => {
                getFunblocTypes();
                setModal(deletedSubType);
            })
            .catch((error) => console.error(error))
            .finally(() => setIsLoading(false));
    };

    const handleDelete = () => {
        /*setIsLoading(true);

        deleteFunblocType(selectedTypeId)
            .then(() => {
                getFunblocTypes();
                setModal("deleted");
            })
            .catch((error) => console.error(error))
            .finally(() => setIsLoading(false));
            */
        console.log(selectedTypeId)
    };

    const getFunblocTypeDetail = useCallback((selectedTypeId) => {
        setIsLoading(true);
        return new Promise((resolve) => {
            fetchFunblocTypeDetail(selectedTypeId)
                .then((res) => {
                    let subTypeName, subTypeNum;
                    if (res.data.sub.length > 0) {

                        subTypeName = res.data.name;
                        subTypeNum = res.data.num;
                    }

                    setCurrentTypeDetail({ ...res.data, subTypeName, subTypeNum });
                    setIsLoading(false);
                    resolve(res.data);
                })
                .catch((error) => {
                    console.error(error);
                    setIsLoading(false);
                });
        });
    }, []);

    const onSortableTableRowClicked = (id, subTypeId) => {
        if (isLoading) return;
        if (selectedSubTypeId === subTypeId) return;
        setSubSecondaryTypes(sortedData)
        setSelectedTypeId(id);
        setSelectedSubTypeId(subTypeId);
    };

    const sortedData = useMemo(() => {
        return subTypes.map((type) => {
            return {
                ...type,
                button: (
                    <EditButton
                        onClick={(e) => {
                            (async (e) => {
                                e.stopPropagation();
                                const res = await getFunblocTypeDetail(type.id, type.subTypeId);
                                setFunblocTypeObject({
                                    num: type.num,
                                    name: type.name,
                                    note: res.note,
                                });
                                setSelectedTypeId(type.id);

                                setEditFunblocTypeId(type.id);
                                setModal("edit");
                                setShouldOpenModal(true);
                            })(e);
                        }}
                    >
                        <i className="bi bi-pen" />
                        編輯
                    </EditButton>
                ),
                editSubTypeButton: type.subTypeId ? (
                    <button
                        className="btn btn-sm"
                        onClick={(e) => {
                            (async (e) => {
                                e.stopPropagation();
                                const res = await getFunblocTypeDetail(type.id, type.subTypeId);
                                setSubTypeObject({
                                    typeId: type.id,
                                    ..._.find(res.sub, ["id", type.subTypeId]),
                                });
                                setModal(editSubTypeSetting);
                                setShouldOpenModal(true);
                            })(e);
                        }}
                    >
                        <img src="/images/front-end/product_table_editor.svg" alt="" />
                    </button>
                ) : null,
            };
        });

    }, [getFunblocTypeDetail, subTypes]);

    const sortedMainData = useMemo(() => {
        return subMainTypes.map((type) => {
            return {
                ...type,
                button: (
                    <EditButton
                        onClick={(e) => {
                            (async (e) => {
                                e.stopPropagation();
                                const res = await getFunblocTypeDetail(type.id, type.subTypeId);
                                setFunblocTypeObject({
                                    num: type.num,
                                    name: type.name,
                                    note: res.note,
                                });
                                setSelectedTypeId(type.id);

                                setEditFunblocTypeId(type.id);
                                setModal("edit");
                                setShouldOpenModal(true);
                            })(e);
                        }}
                    >
                        <i className="bi bi-pen" />
                        編輯
                    </EditButton>
                ),
                editSubTypeButton: type.id ? (
                    <button
                        className="btn btn-sm"
                        onClick={(e) => {
                            (async (e) => {
                                e.stopPropagation();
                                const res = await getFunblocTypeDetail(type.id, type.subTypeId);
                                setSubTypeObject(res);
                                setModal(editTypeSetting);
                                setShouldOpenModal(true);
                            })(e);
                        }}
                    >
                        <img src="/images/front-end/product_table_editor.svg" alt="" />
                    </button>
                ) : null,
            };
        });
    }, [getFunblocTypeDetail, subMainTypes]);
    const handleSort = useCallback(
        (ids) => {
            if (isLoading) return;

            setIsLoading(true);

            sortFunblocType(ids)
                .then(() => {
                    getFunblocTypes();
                    setShouldSort(false);
                })
                .catch((error) => {
                    console.error(error);
                    setIsLoading(false);
                    setShouldSort(false);
                });

        },
        [isLoading, getFunblocTypes]
    );
    const handleSort2 = useCallback(
        (ids) => {
            if (isLoading) return;

            setIsLoading(true);

            sortIdFunblocType(selectedSubTypeId, ids)
                .then(() => {
                    getFunblocTypes();
                    setShouldSort(false);
                })
                .catch((error) => {
                    console.error(error);
                    setIsLoading(false);
                    setShouldSort(false);
                });

        },
        [isLoading, getFunblocTypes]
    );

    useEffect(() => {

        if (shouldSort) {
            const myMainSet = new Set();
            sortedMainData.forEach((subType) => {
                myMainSet.add(subType.id);
            });
            handleSort([...myMainSet]);
            setSubSecondaryTypes(sortedData)

        }
    }, [handleSort, sortedMainData, setSubMainTypes]);

    useEffect(() => {

        if (shouldSort) {

            const mySecSet = new Set();


            subSecondaryTypes.forEach((subSecondaryTypes) => {
                if (subSecondaryTypes.id === selectedTypeId)
                    mySecSet.add(subSecondaryTypes.subTypeId);
            });
            handleSort2([...mySecSet]);
        }
    }, [handleSort2, selectedTypeId, setSubSecondaryTypes, subSecondaryTypes]);

    useEffect(() => {
        getFunblocTypes();
    }, [getFunblocTypes]);

    useEffect(() => {
        (async () => {
            if (selectedTypeId) {
                await getFunblocTypeDetail(selectedTypeId, selectedSubTypeId);
            }
        })();
    }, [getFunblocTypeDetail, selectedTypeId, selectedSubTypeId]);

    return (
        <div className="container-fluid p-5">
            <div className="d-flex justify-content-between align-items-center">
                <BackBtn
                    text={"回列表"}
                    onClickCallback={() => navigate("/manager/funbloc")}
                />
            </div>

            <div className="d-flex justify-content-center">
                <ProductTab className="active">販團分類</ProductTab>
            </div>
            <div className="d-flex">

                <ContentWrapperClass className="py-5 mx-3 px-3 ">
                    <ContentWrapperTitle className="row mb-3 mx-1">
                        主分類
                        <div className="col text-end">
                            <ContentWrapperButton
                                className="pb-1"
                                onClick={() => {
                                    setModal("create");
                                    setShouldOpenModal(true);
                                }}
                            >
                                +
                            </ContentWrapperButton>
                        </div>
                    </ContentWrapperTitle>
                    <div className="row">

                        <div className="col-12">
                            <SortableTable
                                heads={[
                                    "編輯",
                                    "分類代碼",
                                    "分類名稱",
                                    "次分類代碼",
                                    "次分類名稱",
                                    "設定",
                                    "刪除",
                                ]}
                                data={sortedMainData}
                                handleSort={setSubMainTypes}
                                selectedTypeId={selectedTypeId}
                                selectedSubTypeId={selectedSubTypeId}
                                onRowClicked={onSortableTableRowClicked}
                                openCreateSubTypeModal={() => {
                                    setModal(newSubTypeSetting);
                                    setShouldOpenModal(true);
                                }}
                                openDeleteSubTypeModal={(subType) => {
                                    setSubTypeObject({
                                        typeId: subType.id,
                                        id: subType.subTypeId,
                                        name: subType.subTypeName,
                                        num: subType.subTypeNum,
                                    });
                                    setModal(deleteTypeSetting);
                                    setShouldOpenModal(true);
                                }}
                                setShouldSort={setShouldSort}
                            />
                        </div>
                    </div>
                </ContentWrapperClass>
                <ContentWrapperClass className="py-5 mx-3 px-3 ">
                    <ContentWrapperTitle className="row mb-3 mx-1">
                        次分類
                        <div className="col text-end">
                        {selectedSubTypeId !== null ? <ContentWrapperButton
                                className="pb-1"
                                onClick={() => {
                                    setModal("subCreate");
                                    setShouldOpenModal(true);
                                }}
                            >
                                +
                            </ContentWrapperButton> : ""}
                        </div>
                    </ContentWrapperTitle>
                    <div className="row">

                        <div className="col-12">
                            <ClassSecondaryTypeSortableTable
                                heads={[
                                    "編輯",
                                    "分類代碼",
                                    "分類名稱",
                                    "次分類代碼",
                                    "次分類名稱",
                                    "設定",
                                    "刪除",
                                ]}
                                data={sortedData}
                                handleSort2={setSubSecondaryTypes}
                                selectedTypeId={selectedTypeId}
                                selectedSubTypeId={selectedSubTypeId}
                                onRowClicked={onSortableTableRowClicked}
                                openCreateSubTypeModal={() => {
                                    setModal(newSubTypeSetting);
                                    setShouldOpenModal(true);
                                }}
                                openDeleteSubTypeModal={(subType) => {
                                    setSubTypeObject({
                                        typeId: subType.id,
                                        id: subType.subTypeId,
                                        name: subType.subTypeName,
                                        num: subType.subTypeNum,
                                    });
                                    setModal(deleteSubTypeSetting);
                                    setShouldOpenModal(true);
                                }}
                                setShouldSort={setShouldSort}
                            />
                        </div>
                    </div>
                </ContentWrapperClass>
            </div>
            {shouldOpenModal && modal === "delete" && (
                <Dialog onClose={closeModal}>
                    <DialogContentWrapper className="p-3" width={488} height={248}>
                        <DialogTitle className="mb-4">是否確認刪除分類</DialogTitle>
                        <div>
                            <DialogButton
                                className="btn-secondary cancel"
                                onClick={closeModal}
                            >
                                取消
                            </DialogButton>
                            <DialogButton
                                className="btn-primary"
                                disabled={isLoading}
                                onClick={handleDelete}
                            >
                                確認
                            </DialogButton>
                        </div>
                    </DialogContentWrapper>
                </Dialog>
            )}

            {shouldOpenModal && modal === "deleted" && (
                <CancelledDialog closeModal={closeModal} text={"已刪除分類"} />
            )}

            {shouldOpenModal && modal === "create" && (
                <CreateAndEditModal
                    closeModal={closeModal}
                    funblocTypeObject={funblocTypeObject}
                    setFunblocTypeObject={setFunblocTypeObject}
                    title={"新增主分類"}
                >
                    <div>
                        <DialogButton className="btn-secondary cancel" onClick={closeModal}>
                            取消
                        </DialogButton>
                        <DialogButton
                            className="btn-primary"
                            disabled={isLoading}
                            onClick={handleCreate}
                        >
                            確認
                        </DialogButton>
                    </div>
                </CreateAndEditModal>
            )}
            {shouldOpenModal && modal === "subCreate" && (
                <CreateAndEditModal
                    closeModal={closeModal}
                    funblocTypeObject={funblocTypeObject}
                    setFunblocTypeObject={setFunblocTypeObject}
                    title={"新增次分類"}
                >
                    <div>
                        <DialogButton className="btn-secondary cancel" onClick={closeModal}>
                            取消
                        </DialogButton>
                        <DialogButton
                            className="btn-primary"
                            disabled={isLoading}
                            onClick={handleSubCreate}
                        >
                            確認
                        </DialogButton>
                    </div>
                </CreateAndEditModal>
            )}
            {shouldOpenModal && modal === "created" && (
                <DoneDialog closeModal={closeModal} text={"已新增分類"} />
            )}

            {shouldOpenModal && modal === "edit" && (
                <CreateAndEditModal
                    closeModal={closeModal}
                    funblocTypeObject={funblocTypeObject}
                    setFunblocTypeObject={setFunblocTypeObject}
                    title={"編輯分類"}
                >
                    <div>
                        <DialogButton className="btn-secondary cancel" onClick={closeModal}>
                            取消
                        </DialogButton>
                        <DialogButton
                            className="btn-primary"
                            disabled={isLoading}
                            onClick={handleEdit}
                        >
                            確認
                        </DialogButton>
                    </div>
                </CreateAndEditModal>
            )}

            {shouldOpenModal && modal === "edited" && (
                <DoneDialog closeModal={closeModal} text={"已編輯分類"} />
            )}

            {shouldOpenModal && modal === newSubTypeSetting && (
                <Dialog>
                    <DialogContentWrapper className="py-4">
                        <DialogTitle className="mb-4 text-primary">新增次分類</DialogTitle>
                        <div className="container px-5">
                            <div className="row mb-3">
                                <ClassifyLabel className="col-4 text-indent">
                                    上層分類
                                </ClassifyLabel>
                                <div className="col">
                                    <StyledSelect
                                        className="form-select border-primary"
                                        value={subTypeObject.typeId || "-"}
                                        onChange={(e) => {
                                            setSubTypeObject((prev) => ({
                                                ...prev,
                                                typeId: e.target.value,
                                            }));
                                        }}
                                    >
                                        <option value="-" disabled>
                                            請選擇
                                        </option>
                                        {types.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </StyledSelect>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <ClassifyLabel className="col-4 text-indent">
                                    次分類名稱
                                </ClassifyLabel>
                                <div className="col">
                                    <ClassifyInput
                                        type="text"
                                        className="form-control border-primary"
                                        value={subTypeObject.name}
                                        onChange={(e) => {
                                            setSubTypeObject((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <ClassifyLabel className="col-4 text-indent">
                                    次分類代碼
                                </ClassifyLabel>

                                <div className="col">
                                    <ClassifyInput
                                        type="text"
                                        className="form-control border-primary"
                                        value={subTypeObject.num}
                                        onChange={(e) => {
                                            setSubTypeObject((prev) => ({
                                                ...prev,
                                                num: e.target.value,
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <ClassifyLabel className="col-4 text-indent">
                                    備註說明
                                </ClassifyLabel>
                                <div className="col">
                                    <ClassifyTextarea
                                        type="text"
                                        rows="4"
                                        className="form-control border-primary"
                                        value={subTypeObject.note}
                                        onChange={(e) => {
                                            setSubTypeObject((prev) => ({
                                                ...prev,
                                                note: e.target.value,
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-3">
                            <DialogButton
                                className="btn-secondary cancel"
                                onClick={closeModal}
                            >
                                取消
                            </DialogButton>
                            <DialogButton
                                className="btn-primary"
                                disabled={isLoading}
                                onClick={createNewSubType}
                            >
                                確認
                            </DialogButton>
                        </div>
                    </DialogContentWrapper>
                </Dialog>
            )}

            {shouldOpenModal && modal === createdNewSubType && (
                <DoneDialog closeModal={closeModal} text={"已新增次分類"} />
            )}

            {shouldOpenModal && modal === editSubTypeSetting && (
                <Dialog>
                    <DialogContentWrapper>
                        <DialogTitle className="mb-4 text-primary">次分類設定</DialogTitle>
                        <div className="container px-5">
                            <div className="row mb-3">
                                <ClassifyLabel className="col-4 text-indent">
                                    次分類代碼
                                </ClassifyLabel>
                                <div className="col">
                                    <ClassifyInput
                                        type="text"
                                        className="form-control border-primary"
                                        value={subTypeObject.num}
                                        onChange={(e) => {
                                            setSubTypeObject((prev) => ({
                                                ...prev,
                                                num: e.target.value,
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <ClassifyLabel className="col-4 text-indent">
                                    次分類名稱
                                </ClassifyLabel>
                                <div className="col">
                                    <ClassifyInput
                                        type="text"
                                        className="form-control border-primary"
                                        value={subTypeObject.name}
                                        onChange={(e) => {
                                            setSubTypeObject((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <DialogButton
                                className="btn-secondary cancel"
                                onClick={closeModal}
                            >
                                取消
                            </DialogButton>
                            <DialogButton
                                className="btn-primary"
                                disabled={isLoading}
                                onClick={editSubType}
                            >
                                確認
                            </DialogButton>
                        </div>
                    </DialogContentWrapper>
                </Dialog>
            )}
            {shouldOpenModal && modal === editTypeSetting && (
                <Dialog>
                    <DialogContentWrapper>
                        <DialogTitle className="mb-4 text-primary">主分類設定</DialogTitle>
                        <div className="container px-5">
                            <div className="row mb-3">
                                <ClassifyLabel className="col-4 text-indent">
                                    主分類代碼
                                </ClassifyLabel>
                                <div className="col">
                                    <ClassifyInput
                                        type="text"
                                        className="form-control border-primary"
                                        value={subTypeObject.num}
                                        onChange={(e) => {
                                            setSubTypeObject((prev) => ({
                                                ...prev,
                                                num: e.target.value,
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <ClassifyLabel className="col-4 text-indent">
                                    主分類名稱
                                </ClassifyLabel>
                                <div className="col">
                                    <ClassifyInput
                                        type="text"
                                        className="form-control border-primary"
                                        value={subTypeObject.name}
                                        onChange={(e) => {
                                            setSubTypeObject((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <DialogButton
                                className="btn-secondary cancel"
                                onClick={closeModal}
                            >
                                取消
                            </DialogButton>
                            <DialogButton
                                className="btn-primary"
                                disabled={isLoading}
                                onClick={editType}
                            >
                                確認
                            </DialogButton>
                        </div>
                    </DialogContentWrapper>
                </Dialog>
            )}
            {shouldOpenModal && modal === editedSubType && (
                <DoneDialog closeModal={closeModal} text={"已編輯次分類"} />
            )}
            {shouldOpenModal && modal === deleteTypeSetting && (
                <Dialog onClose={closeModal}>
                    <DialogContentWrapper className="p-3" width={488} height={248}>
                        <DialogTitle className="mb-4">是否確認刪除主分類</DialogTitle>
                        <div>
                            <DialogButton
                                className="btn-secondary cancel"
                                onClick={closeModal}
                            >
                                取消
                            </DialogButton>
                            <DialogButton
                                className="btn-primary"
                                disabled={isLoading}
                                onClick={deleteType}
                            >
                                確認
                            </DialogButton>
                        </div>
                    </DialogContentWrapper>
                </Dialog>
            )}
            {shouldOpenModal && modal === deleteSubTypeSetting && (
                <Dialog onClose={closeModal}>
                    <DialogContentWrapper className="p-3" width={488} height={248}>
                        <DialogTitle className="mb-4">是否確認刪除次分類</DialogTitle>
                        <div>
                            <DialogButton
                                className="btn-secondary cancel"
                                onClick={closeModal}
                            >
                                取消
                            </DialogButton>
                            <DialogButton
                                className="btn-primary"
                                disabled={isLoading}
                                onClick={deleteSubType}
                            >
                                確認
                            </DialogButton>
                        </div>
                    </DialogContentWrapper>
                </Dialog>
            )}

            {shouldOpenModal && modal === deletedSubType && (
                <CancelledDialog closeModal={closeModal} text={"已刪除次分類"} />
            )}
        </div>
    );
};

export default ClassifyFunbloc;
