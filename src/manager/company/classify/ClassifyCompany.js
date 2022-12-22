import React, { useCallback, useEffect, useMemo, useState } from 'react'
import BackBtn from "../../components/general/BackBtn"
import { useNavigate } from "react-router-dom"
import {
    ClassifyInput,
    ClassifyLabel,
    ClassifyTextarea,
    CreateButton,
    DeleteButton,
    EditButton,
    Label,
    Title,
    Value
} from "../../product/classify/ClassifyProductStyle"
import { ContentWrapper } from "../../../component/StyledComponent"
import {
    createCompanyType,
    deleteCompanyType,
    editCompanyType,
    fetchCompanyTypeDetail,
    fetchCompanyTypes,
    sortCompanyType
} from "../../../api/Company"
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


const ClassifyCompany = () => {
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)

    const [modal, setModal] = useState(null)
    const [shouldOpenModal, setShouldOpenModal] = useState(false)

    const [types, setTypes] = useState([])
    const [selectedTypeId, setSelectedTypeId] = useState(null)
    const [currentTypeDetail, setCurrentTypeDetail] = useState({})

    const [editCompanyTypeId, setEditCompanyTypeId] = useState('')
    const [companyTypeObject, setCompanyTypeObject] = useState(() => generateCreateTypeObject())

    const [pageObject, setPageObject] = useState({})
    const [currentPage, setCurrentPage] = useState(1)

    const [inputKey, setInputKey] = useState('')
    const [keyword, setKeyword] = useState('')

    const [shouldSort, setShouldSort] = useState(false)


    const getCompanyTypes = useCallback((currentPage, keyword) => {
        setIsLoading(true)
        fetchCompanyTypes({ page: currentPage, keyword })
            .then(res => {
                setTypes(res.data)
                setSelectedTypeId(res.data[0].id)
                setPageObject(res.meta)
            })
            .catch(error => console.error(error))
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    const getCompanyTypeDetail = useCallback((selectedTypeId) => {
        setIsLoading(true)

        return new Promise((resolve) => {
            fetchCompanyTypeDetail(selectedTypeId)
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


    const closeModal = () => {
        setShouldOpenModal(false)
        setCompanyTypeObject(generateCreateTypeObject())
    }

    const handleCreate = () => {
        setIsLoading(true)

        const { note, num, name } = companyTypeObject

        createCompanyType(num, name, note)
            .then(() => {
                getCompanyTypes(currentPage, keyword)
                setModal('created')
            })
            .catch(error => {
                console.error(error)
            })
            .finally(() => setIsLoading(false))
    }

    const handleEdit = () => {
        setIsLoading(true)
        const { note, num, name } = companyTypeObject

        editCompanyType(editCompanyTypeId, num, name, note)
            .then(() => {
                getCompanyTypes(currentPage, keyword)
                getCompanyTypeDetail(editCompanyTypeId)
                setModal('edited')
            })
            .catch(error => {
                console.error(error)
            })
            .finally(() => setIsLoading(false))
    }

    const handleDelete = () => {
        setIsLoading(true)

        deleteCompanyType(selectedTypeId)
            .then(() => {
                getCompanyTypes(currentPage, keyword)
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
                        const res = await getCompanyTypeDetail(type.id)
                        setCompanyTypeObject({
                            num: type.num,
                            name: type.name,
                            note: res.note
                        })
                        setSelectedTypeId(type.id)
                        setEditCompanyTypeId(type.id)
                        setModal('edit')
                        setShouldOpenModal(true)
                    })(e)

                }}>
                    <i className="bi bi-pen" />
                    編輯
                </EditButton>
            })
        })
    }, [getCompanyTypeDetail, types])

    const handleSort = useCallback((types) => {
        if (isLoading) return

        setIsLoading(true)

        const ids = types.map(type => type.id)

        sortCompanyType(ids)
            .then(() => {
                getCompanyTypes(currentPage, keyword)
                setShouldSort(false)
            })
            .catch(error => {
                console.error(error)
                setIsLoading(false)
                setShouldSort(false)
            })

    }, [isLoading, getCompanyTypes, currentPage, keyword])

    useEffect(() => {
        if (shouldSort) {
            handleSort(types)
        }
    }, [shouldSort, handleSort, types])


    useEffect(() => {
        getCompanyTypes(currentPage, keyword)
    }, [getCompanyTypes, currentPage, keyword])

    useEffect(() => {
        (async () => {
            if (selectedTypeId) {
                await getCompanyTypeDetail(selectedTypeId)
            }
        })()
    }, [getCompanyTypeDetail, selectedTypeId])

    return (
        <div className="container-fluid p-5">
            <div className="d-flex justify-content-between align-items-center">
                <BackBtn text={'回列表'} onClickCallback={() => navigate('/manager/company')} />
            </div>

            <Title>廠商分類</Title>

            <ContentWrapper className="py-5 pe-5" style={{ paddingLeft: '100px' }}>
                <div className="row mb-3">
                    <div className="offset-5 col-3">
                        <input type="text"
                               className="form-control border-primary"
                               placeholder="關鍵字搜尋"
                               value={inputKey}
                               onKeyUp={e => {
                                   if (e.key === 'Enter') {
                                       setCurrentPage(1)
                                       setKeyword(inputKey)
                                   }
                               }}
                               onChange={e => {
                                   setInputKey(e.target.value)
                               }} />
                    </div>
                    <div className="col text-end">
                        <CreateButton onClick={() => {
                            setModal('create')
                            setShouldOpenModal(true)
                        }}>新增</CreateButton>
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
                        <DeleteButton disabled={isLoading} onClick={() => {
                            setModal('delete')
                            setShouldOpenModal(true)
                        }}>刪除分類</DeleteButton>
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
                                    typeObject={companyTypeObject}
                                    setTypeObject={setCompanyTypeObject}>
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
                                    typeObject={companyTypeObject}
                                    setTypeObject={setCompanyTypeObject}>
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

export default ClassifyCompany