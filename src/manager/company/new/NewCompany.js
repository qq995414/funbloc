import React, { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from "react-router-dom"
import _ from 'lodash'
import { ContentWrapper } from "../../../component/StyledComponent"
import BackBtn from "../../components/general/BackBtn"
import {
    ClearButton,
    EditRow,
    EditTitle,
    EditWrapper,
    Label,
    SaveButton,
    StyledInput,
    StyledSelect
} from "./NewCompanyStyle"
import Dialog, { DoneDialog } from "../../../component/dialog/Dialog"
import { DialogButton, DialogContentWrapper, DialogTitle } from "../../../component/dialog/DialogStyle"
import { createCompany, fetchCompanyTypes } from "../../../api/Company"

const NewCompany = () => {
    const navigate = useNavigate()
    const bankObject = useOutletContext()

    const [isLoading, setIsLoading] = useState(false)

    const [companyTypes, setCompanyTypes] = useState([])

    const [name, setName] = useState('')
    const [window, setWindow] = useState('')
    const [selectedType, setSelectedType] = useState('-')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [bankCode, setBankCode] = useState('-')
    const [bankAccount, setBankAccount] = useState('')
    const [checkout, setCheckout] = useState('-')

    const [shouldOpenModal, setShouldOpenModal] = useState(false)
    const [modal, setModal] = useState(null)

    const closeModal = () => {
        setShouldOpenModal(false)
    }

    const canProceed = () => {
        if (name === '') return false
        if (isLoading) return false

        return true
    }

    const reset = () => {
        setName('')
        setWindow('')
        setPhone('')
        setAddress('')
        setBankCode('-')
        setBankAccount('')
        setCheckout('-')
    }

    const create = () => {
        setIsLoading(true)

        createCompany({
            name,
            window,
            type: selectedType,
            phone,
            address,
            bank_code: bankCode,
            bank_account: bankAccount,
            checkout
        })
            .then(() => {
                setModal('created')
                reset()

            })
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        fetchCompanyTypes({ page: 1 })
            .then(res => setCompanyTypes(res.data))
            .catch(error => console.error(error))
    }, [])

    return (
        <div className="container-fluid p-5 text-center">
            <div className="d-flex justify-content-between align-items-center">
                <BackBtn text={'回列表'} onClickCallback={() => navigate('/manager/company')} />

            </div>

            <EditTitle>新增廠商</EditTitle>
            <ContentWrapper>
                <EditWrapper>
                    <EditRow>
                        <div className="col-2">
                            <Label>廠商名稱</Label>
                        </div>
                        <div className="col">
                            <StyledInput type="text" className="form-control border-primary"
                                         value={name}
                                         onChange={e => setName(e.target.value)} />
                        </div>
                    </EditRow>
                    <EditRow>
                        <div className="col-2">
                            <Label>窗&emsp;&emsp;口</Label>
                        </div>
                        <div className="col">
                            <StyledInput type="text" className="form-control border-primary"
                                         value={window}
                                         onChange={e => setWindow(e.target.value)} />
                        </div>
                    </EditRow>
                    <EditRow>
                        <div className="col-2">
                            <Label>分&emsp;&emsp;類</Label>
                        </div>
                        <div className="col">
                            <StyledSelect className="form-select border-primary"
                                          value={selectedType}
                                          onChange={e => setSelectedType(e.target.value)}>
                                <option value="-" disabled={true}>請選擇</option>
                                {
                                    companyTypes.map(type => {
                                        return <option key={type.id} value={type.id}>{type.name}</option>
                                    })
                                }
                            </StyledSelect>
                        </div>
                    </EditRow>
                    <EditRow>
                        <div className="col-2">
                            <Label>聯絡電話</Label>
                        </div>
                        <div className="col">
                            <StyledInput type="text" className="form-control border-primary"
                                         value={phone}
                                         onChange={e => setPhone(e.target.value.replace(/\D+/g, ''))} />
                        </div>
                    </EditRow>
                    <EditRow>
                        <div className="col-2">
                            <Label>地&emsp;&emsp;址</Label>
                        </div>
                        <div className="col">
                            <StyledInput type="text" className="form-control border-primary"
                                         value={address}
                                         onChange={e => setAddress(e.target.value)} />
                        </div>
                    </EditRow>
                    <EditRow>
                        <div className="col-2">
                            <Label>銀行代碼</Label>
                        </div>
                        <div className="col">
                            <StyledSelect className="form-select border-primary w-50"
                                          value={bankCode}
                                          onChange={e => setBankCode(e.target.value)}>
                                <option value="-" disabled>請選擇</option>
                                {
                                    !_.isEmpty(bankObject) && bankObject.banks.map(bank => <option key={bank.bank_code}
                                                                                                   value={bank.bank_code}>{bank.bank_code} {bank.name}</option>)
                                }
                            </StyledSelect>
                        </div>
                    </EditRow>
                    <EditRow>
                        <div className="col-2">
                            <Label>銀行帳戶</Label>
                        </div>
                        <div className="col">
                            <StyledInput type="text" className="form-control border-primary"
                                         value={bankAccount}
                                         onChange={e => setBankAccount(e.target.value.replace(/\D+/g, ''))} />
                        </div>
                    </EditRow>
                    <EditRow>
                        <div className="col-2">
                            <Label>結帳方式 </Label>
                        </div>
                        <div className="col">
                            <StyledSelect className="form-select border-primary w-50"
                                          value={checkout}
                                          onChange={e => setCheckout(e.target.value)}>
                                <option value="-" disabled>請選擇</option>
                                <option value="單筆結帳">單筆結帳</option>
                                <option value="月結">月結</option>
                            </StyledSelect>
                        </div>
                    </EditRow>
                </EditWrapper>
            </ContentWrapper>

            <ClearButton disabled={isLoading} onClick={reset}>清除資訊</ClearButton>
            <SaveButton disabled={!canProceed()} onClick={() => {
                setModal('create')
                setShouldOpenModal(true)
            }}>確認新增</SaveButton>


            {
                modal === 'create' && shouldOpenModal && <Dialog>
                    <DialogContentWrapper width={488} height={248}>
                        <DialogTitle className="mb-5">是否新增此廠商</DialogTitle>
                        <div>
                            <DialogButton className="btn-secondary cancel" onClick={closeModal}>取消</DialogButton>
                            <DialogButton className="btn-primary"
                                          disabled={isLoading}
                                          onClick={create}>確認</DialogButton>
                        </div>
                    </DialogContentWrapper>
                </Dialog>
            }


            {
                modal === 'created' && shouldOpenModal &&
                <DoneDialog closeModal={() => {
                    closeModal()
                    navigate('/manager/company')
                }} text={'已新增廠商'} />
            }

        </div>
    )
}

export default NewCompany