import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from "react-router-dom"
import BackBtn from "../../components/general/BackBtn"
import {
    ClassifyInput,
    ClassifyLabel,
    ClassifyTextarea,
    CreateButton,
    EditButton,
    Label,
    Title,
    Value
} from "../../product/classify/ClassifyProductStyle"
import { ContentWrapper } from "../../../component/StyledComponent"
import {
    createHawkerType,
    deleteHawkerType,
    editHawkerType,
    fetchHawkerTypeDetail,
    fetchHawkerTypes,
    sortHawkerType
} from "../../../api/hawker/ManagerHawker"
import Dialog, { CancelledDialog, DoneDialog } from "../../../component/dialog/Dialog"
import { DialogButton, DialogContentWrapper, DialogTitle } from "../../../component/dialog/DialogStyle"
import SortableTable from "../../../component/table/SortableTable"

const generateCreateTypeObject = () => ({
    num: '',
    name: '',
    note: ''
})


const CreateAndEditModal = ({ closeModal, typeObject, setTypeObject, title, children }) => {
    return <Dialog onClose={closeModal}>
        <DialogContentWrapper className="p-3" width={500} height={450}>
            <DialogTitle className="mb-4 text-primary">{title}</DialogTitle>
            <div className="container mb-5 px-5">
                <div className="row mb-3">
                    <ClassifyLabel className="col-4 text-end">分類代碼</ClassifyLabel>
                    <div className="col">
                        <ClassifyInput type="text" className="form-control border-primary"
                                       value={typeObject.num}
                                       onChange={e => setTypeObject(prev => ({
                                           ...prev,
                                           num: e.target.value
                                       }))} />
                    </div>
                </div>
                <div className="row mb-3">
                    <ClassifyLabel className="col-4 text-end">分類名稱</ClassifyLabel>
                    <div className="col">
                        <ClassifyInput type="text" className="form-control border-primary"
                                       value={typeObject.name}
                                       onChange={e => setTypeObject(prev => ({
                                           ...prev,
                                           name: e.target.value
                                       }))} />
                    </div>
                </div>
                <div className="row">
                    <ClassifyLabel className="col-4 text-end">備註說明</ClassifyLabel>
                    <div className="col">
                        <ClassifyTextarea type="text" rows="4" className="form-control border-primary"
                                          value={typeObject.note}
                                          onChange={e => setTypeObject(prev => ({
                                              ...prev,
                                              note: e.target.value
                                          }))} />
                    </div>
                </div>
            </div>
            {children}
        </DialogContentWrapper>
    </Dialog>
}


const ClassifyHawker = () => {
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)

    const [modal, setModal] = useState(null)
    const [shouldOpenModal, setShouldOpenModal] = useState(false)

    const [types, setTypes] = useState([])
    const [selectedTypeId, setSelectedTypeId] = useState(null)
    const [currentTypeDetail, setCurrentTypeDetail] = useState({})

    const [editHawkerTypeId, setEditHawkerTypeId] = useState('')
    const [hawkerTypeObject, setHawkerTypeObject] = useState(() => generateCreateTypeObject())

    const [shouldSort, setShouldSort] = useState(false)

    const closeModal = () => {
        setShouldOpenModal(false)
        setHawkerTypeObject(generateCreateTypeObject())
    }

    const getHawkerTypes = useCallback(() => {
        fetchHawkerTypes({ page: 1 })
            .then(res => {
                setTypes(res.data)
                setSelectedTypeId(res.data[0].id)
            })
            .catch(error => {
                console.error(error)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    const getHawkerTypeDetail = useCallback((selectedTypeId) => {
        setIsLoading(true)
        return new Promise((resolve) => {
            fetchHawkerTypeDetail(selectedTypeId)
                .then(res => {
                    setCurrentTypeDetail(res.data)
                    setIsLoading(false)
                    resolve(res.data)
                })
                .catch(error => {
                    console.error(error)
                    setIsLoading(false)
                })
        })
    }, [])

    const handleCreate = () => {
        setIsLoading(true)

        const { note, num, name } = hawkerTypeObject

        createHawkerType(num, name, note)
            .then(() => {
                getHawkerTypes()
                setModal('created')
            })
            .catch(error => {
                console.error(error)
            })
            .finally(() => setIsLoading(false))
    }

    const handleEdit = () => {
        setIsLoading(true)
        const { note, num, name } = hawkerTypeObject

        editHawkerType(editHawkerTypeId, num, name, note)
            .then(() => {
                getHawkerTypes()
                getHawkerTypeDetail(editHawkerTypeId)
                setModal('edited')
            })
            .catch(error => {
                console.error(error)
            })
            .finally(() => setIsLoading(false))
    }


    const handleDelete = () => {
        setIsLoading(true)

        deleteHawkerType(selectedTypeId)
            .then(() => {
                getHawkerTypes()
                setModal('deleted')
            })
            .catch(error => {
                console.error(error)
            })
            .finally(() => setIsLoading(false))
    }

    const onSortableTableRowClicked = (id) => {
        if (isLoading) return
        if (selectedTypeId === id) return
        setSelectedTypeId(id)
    }

    const sortedData = useMemo(() => {
        return types.map(type => {
            return ({
                ...type,
                button: <EditButton onClick={(e) => {
                    (async (e) => {
                        e.stopPropagation()
                        const res = await getHawkerTypeDetail(type.id)
                        setHawkerTypeObject({
                            num: type.num,
                            name: type.name,
                            note: res.note
                        })
                        setSelectedTypeId(type.id)
                        setEditHawkerTypeId(type.id)
                        setModal('edit')
                        setShouldOpenModal(true)
                    })(e)

                }}>
                    <i className="bi bi-pen" />
                    編輯
                </EditButton>
            })
        })
    }, [getHawkerTypeDetail, types])

    const handleSort = useCallback((types) => {
        if (isLoading) return

        setIsLoading(true)

        const ids = types.map(type => type.id)

        sortHawkerType(ids)
            .then(() => {
                getHawkerTypes()
                setShouldSort(false)
            })
            .catch(error => {
                console.error(error)
                setIsLoading(false)
                setShouldSort(false)
            })

    }, [isLoading, getHawkerTypes])

    useEffect(() => {
        if (shouldSort) {
            handleSort(types)
        }
    }, [shouldSort, handleSort, types])

    useEffect(() => {
        getHawkerTypes()
    }, [getHawkerTypes])

    useEffect(() => {
        (async () => {
            if (selectedTypeId) {
                await getHawkerTypeDetail(selectedTypeId)
            }
        })()
    }, [getHawkerTypeDetail, selectedTypeId])


    return (
        <div className="container-fluid p-5">
            <div className="d-flex justify-content-between align-items-center">
                <BackBtn text={'回列表'} onClickCallback={() => navigate('/manager/hawker')} />
            </div>

            <Title>小販分類</Title>
            <ContentWrapper className="py-5 pe-5" style={{ paddingLeft: '100px' }}>
                <div className="row mb-3">
                    <div className="col text-end">
                        {
                            sortedData.length < 4 && <CreateButton onClick={() => {
                                setModal('create')
                                setShouldOpenModal(true)
                            }}>新增</CreateButton>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-5">
                        <div className="d-flex align-items-center mb-4">
                            <Label>分類代碼</Label>
                            <Value>{currentTypeDetail.num}</Value>
                        </div>
                        <div className="d-flex align-items-center mb-4">
                            <Label>分類名稱</Label>
                            <Value>{currentTypeDetail.name}</Value>
                        </div>
                        <div>
                            <Label className="mb-4">備註說明</Label>
                            <Value
                                className="pe-5">{currentTypeDetail.note}</Value>
                        </div>
                    </div>
                    <div className="col-7">
                        <SortableTable heads={['編輯', '分類代碼', '分類名稱']}
                                       data={sortedData}
                                       handleSort={setTypes}
                                       selectedTypeId={selectedTypeId}
                                       onRowClicked={onSortableTableRowClicked}
                                       setShouldSort={setShouldSort} />
                    </div>

                </div>
            </ContentWrapper>

            {
                shouldOpenModal && modal === 'delete' && <Dialog onClose={closeModal}>
                    <DialogContentWrapper className="p-3" width={488} height={248}>
                        <DialogTitle className="mb-4">是否確認刪除分類</DialogTitle>
                        <div>
                            <DialogButton className="btn-secondary cancel" onClick={closeModal}>取消</DialogButton>
                            <DialogButton className="btn-primary"
                                          disabled={isLoading}
                                          onClick={handleDelete}>確認</DialogButton>
                        </div>
                    </DialogContentWrapper>
                </Dialog>
            }

            {
                shouldOpenModal && modal === 'deleted' && <CancelledDialog closeModal={closeModal} text={'已刪除分類'} />
            }


            {
                shouldOpenModal && modal === 'create' &&
                <CreateAndEditModal closeModal={closeModal}
                                    title={'新增分類'}
                                    typeObject={hawkerTypeObject}
                                    setTypeObject={setHawkerTypeObject}>
                    <div>
                        <DialogButton className="btn-secondary cancel" onClick={closeModal}>取消</DialogButton>
                        <DialogButton className="btn-primary"
                                      disabled={isLoading}
                                      onClick={handleCreate}>確認</DialogButton>
                    </div>
                </CreateAndEditModal>
            }

            {
                shouldOpenModal && modal === 'created' && <DoneDialog closeModal={closeModal} text={'已新增分類'} />
            }


            {
                shouldOpenModal && modal === 'edit' &&
                <CreateAndEditModal closeModal={closeModal}
                                    title={'編輯分類'}
                                    typeObject={hawkerTypeObject}
                                    setTypeObject={setHawkerTypeObject}>
                    <div>
                        <DialogButton className="btn-secondary cancel" onClick={closeModal}>取消</DialogButton>
                        <DialogButton className="btn-primary"
                                      disabled={isLoading}
                                      onClick={handleEdit}>確認</DialogButton>
                    </div>
                </CreateAndEditModal>
            }

            {
                shouldOpenModal && modal === 'edited' && <DoneDialog closeModal={closeModal} text={'已編輯分類'} />
            }
        </div>
    )
}

export default ClassifyHawker