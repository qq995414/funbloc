import React, { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from "react-router-dom"
import BackBtn from "../../components/general/BackBtn"
import { EditTitle } from "../../product/edit/EditProductStyle"
import { ContentWrapper } from "../../../component/StyledComponent"
import {
    ClearButton,
    CreateHawkerContainer,
    ErrorMessage,
    Label,
    SaveButton,
    StyledDate,
    StyledInput,
    StyledRow,
    StyledSelect,
    StyledTextarea
} from "./NewHawkerStyle"
import _ from "lodash"
import { SingleDatePicker } from "../../../component/datepicker/DatePicker"
import { createHawker, fetchHawkerTypes } from "../../../api/hawker/ManagerHawker"
import moment from "moment"
import Dialog, { DoneDialog } from "../../../component/dialog/Dialog"
import { DialogButton, DialogContentWrapper, DialogTitle } from "../../../component/dialog/DialogStyle"


const initErrorMessage = () => ({
    name: '',
    phone: '',
    address: '',
    bankCode: '',
    bankAccount: '',
    type: '',
    note: '',
    account: '',
    password: '',
})

const NewHawker = () => {
    const navigate = useNavigate()
    const bankObject = useOutletContext()

    const [hawkerTypes, setHawkerTypes] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [modal, setModal] = useState(null)
    const [shouldOpenModal, setShouldOpenModal] = useState(false)

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [bankCode, setBankCode] = useState('-')
    const [bankAccount, setBankAccount] = useState('')
    const [type, setType] = useState('-')
    const [note, setNote] = useState('')
    const [account, setAccount] = useState('')
    const [password, setPassword] = useState('')
    const [joinAt, setJoinAt] = useState(new Date())

    const [errorMessages, setErrorMessages] = useState(initErrorMessage())

    const closeModal = () => {
        setShouldOpenModal(false)
    }

    const canProceed = () => {
        let flag = true
        let text = '此欄位必填'

        if (name === '') {
            flag = false
            setErrorMessages(prev => ({ ...prev, name: text }))
        }
        if (phone === '') {
            flag = false
            setErrorMessages(prev => ({ ...prev, phone: text }))
        }
        if (address === '') {
            flag = false
            setErrorMessages(prev => ({ ...prev, address: text }))
        }
        if (bankCode === '-') {
            flag = false
            setErrorMessages(prev => ({ ...prev, bankCode: text }))
        }
        if (bankAccount === '') {
            flag = false
            setErrorMessages(prev => ({ ...prev, bankAccount: text }))
        }
        if (type === '-') {
            flag = false
            setErrorMessages(prev => ({ ...prev, type: text }))
        }
        if (note === '') {
            flag = false
            setErrorMessages(prev => ({ ...prev, note: text }))
        }
        if (account === '') {
            flag = false
            setErrorMessages(prev => ({ ...prev, account: text }))
        }
        if (password === '' || password.length < 6) {
            flag = false
            setErrorMessages(prev => ({ ...prev, password: `${text}或長度不足6碼` }))
        }

        if (isLoading) {
            flag = false
        }

        return flag
    }

    const reset = () => {
        setName('')
        setPhone('')
        setAddress('')
        setBankCode('-')
        setBankAccount('')
        setType('-')
        setNote('')
        setAccount('')
        setPassword('')
        setJoinAt(new Date())

        setErrorMessages(initErrorMessage())
    }

    const create = () => {
        setIsLoading(true)
        createHawker({
            name,
            phone,
            address,
            joinAt: moment(joinAt).format('YYYY/MM/DD'),
            bankCode,
            bankAccount,
            type,
            note,
            account,
            password
        })
            .then(() => {
                setModal('created')
                reset()
            })
            .catch(error => {
                console.error(error)
            })
            .finally(() => setIsLoading(false))
    }


    useEffect(() => {
        fetchHawkerTypes({ page: 1, perPage: 1000 })
            .then(res => setHawkerTypes(res.data))
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false))
    }, [])


    return (
        <div className="container-fluid p-5 text-center">
            <div className="d-flex justify-content-between align-items-center">
                <BackBtn text={'回列表'} onClickCallback={() => navigate('/manager/hawker')} />
            </div>

            <EditTitle>新增小販</EditTitle>

            <ContentWrapper>
                <CreateHawkerContainer>
                    <StyledRow>
                        <div className="col-2">
                            <Label>姓&emsp;&emsp;名</Label>
                        </div>
                        <div className="col">
                            <StyledInput type="text"
                                         className={`form-control ${errorMessages.name ? 'border-danger' : 'border-primary'}`}
                                         value={name}
                                         onChange={(e) => {
                                             setErrorMessages(initErrorMessage())
                                             setName(e.target.value)
                                         }} />
                        </div>
                        <div className="col-2">
                            <ErrorMessage>{errorMessages.name}</ErrorMessage>
                        </div>
                    </StyledRow>
                    <StyledRow>
                        <div className="col-2">
                            <Label>連絡電話</Label>
                        </div>
                        <div className="col">
                            <StyledInput type="text"
                                         className={`form-control ${errorMessages.phone ? 'border-danger' : 'border-primary'}`}
                                         value={phone}
                                         onChange={e => {
                                             setErrorMessages(initErrorMessage())
                                             setPhone(e.target.value.replace(/\D+/g, ''))
                                         }} />
                        </div>
                        <div className="col-2">
                            <ErrorMessage>{errorMessages.phone}</ErrorMessage>
                        </div>
                    </StyledRow>
                    <StyledRow>
                        <div className="col-2">
                            <Label>通訊地址</Label>
                        </div>
                        <div className="col">
                            <StyledInput type="text"
                                         className={`form-control ${errorMessages.address ? 'border-danger' : 'border-primary'}`}
                                         value={address}
                                         onChange={e => {
                                             setErrorMessages(initErrorMessage())
                                             setAddress(e.target.value)
                                         }} />
                        </div>
                        <div className="col-2">
                            <ErrorMessage>{errorMessages.address}</ErrorMessage>
                        </div>
                    </StyledRow>
                    <StyledRow>
                        <div className="col-2">
                            <Label>加入日期</Label>
                        </div>
                        <div className="col-8">
                            <StyledDate>
                                <i className="bi bi-calendar text-primary" />
                                <SingleDatePicker startDate={joinAt} setStartDate={setJoinAt} />
                            </StyledDate>
                        </div>
                    </StyledRow>
                    <StyledRow>
                        <div className="col-2">
                            <Label>銀行代碼</Label>
                        </div>
                        <div className="col-8">
                            <StyledSelect value={bankCode}
                                          className={`form-select ${errorMessages.bankCode ? 'border-danger' : 'border-primary'}`}
                                          onChange={e => {
                                              setErrorMessages(initErrorMessage())
                                              setBankCode(e.target.value)
                                          }}>
                                <option value="-" disabled>請選擇</option>
                                {
                                    !_.isEmpty(bankObject) && bankObject.banks.map(bank => <option key={bank.bank_code}
                                                                                                   value={bank.bank_code}>{bank.bank_code} {bank.name}</option>)
                                }
                            </StyledSelect>
                        </div>
                        <div className="col-2">
                            <ErrorMessage>{errorMessages.bankCode}</ErrorMessage>
                        </div>
                    </StyledRow>
                    <StyledRow>
                        <div className="col-2">
                            <Label>銀行帳戶</Label>
                        </div>
                        <div className="col">
                            <StyledInput type="text" s
                                         className={`form-control w-60 ${errorMessages.bankAccount ? 'border-danger' : 'border-primary'}`}
                                         value={bankAccount}
                                         onChange={e => {
                                             setErrorMessages(initErrorMessage())
                                             setBankAccount(e.target.value.replace(/\D+/g, ''))
                                         }} />
                        </div>
                        <div className="col-2">
                            <ErrorMessage>{errorMessages.bankAccount}</ErrorMessage>
                        </div>
                    </StyledRow>
                    <StyledRow>
                        <div className="col-2">
                            <Label>分&emsp;&emsp;類</Label>
                        </div>
                        <div className="col">
                            <StyledSelect value={type}
                                          className={`form-select ${errorMessages.type ? 'border-danger' : 'border-primary'}`}
                                          onChange={e => {
                                              setErrorMessages(initErrorMessage())
                                              setType(e.target.value)
                                          }}>
                                <option value="-" disabled>請選擇</option>
                                {
                                    hawkerTypes.map(hawkerType => <option key={hawkerType.id}
                                                                          value={hawkerType.id}>{hawkerType.name}</option>)
                                }
                            </StyledSelect>
                        </div>
                        <div className="col-2">
                            <ErrorMessage>{errorMessages.type}</ErrorMessage>
                        </div>
                    </StyledRow>
                    <div className="row align-items-start mx-auto mb-3 w-50">
                        <div className="col-2">
                            <Label>備&emsp;&emsp;註</Label>
                        </div>
                        <div className="col">
                            <StyledTextarea
                                error={errorMessages.note}
                                rows={6} value={note}
                                onChange={e => {
                                    setErrorMessages(initErrorMessage())
                                    setNote(e.target.value)
                                }} />
                        </div>
                        <div className="col-2">
                            <ErrorMessage>{errorMessages.note}</ErrorMessage>
                        </div>
                    </div>
                    <StyledRow>
                        <div className="col-2">
                            <Label>帳&emsp;&emsp;號</Label>
                        </div>
                        <div className="col">
                            <StyledInput type="text"
                                         className={`form-control w-60 ${errorMessages.account ? 'border-danger' : 'border-primary'}`}
                                         value={account}
                                         onChange={e => {
                                             setErrorMessages(initErrorMessage())
                                             setAccount(e.target.value)
                                         }} />
                        </div>
                        <div className="col-2">
                            <ErrorMessage>{errorMessages.account}</ErrorMessage>
                        </div>
                    </StyledRow>
                    <StyledRow>
                        <div className="col-2">
                            <Label>密&emsp;&emsp;碼</Label>
                        </div>
                        <div className="col">
                            <StyledInput type="password"
                                         className={`form-control w-60 ${errorMessages.password ? 'border-danger' : 'border-primary'}`}
                                         value={password}
                                         onChange={e => {
                                             setErrorMessages(initErrorMessage())
                                             setPassword(e.target.value)
                                         }} />
                        </div>
                        <div className="col-2">
                            <ErrorMessage>{errorMessages.password}</ErrorMessage>
                        </div>
                    </StyledRow>

                </CreateHawkerContainer>
            </ContentWrapper>
            <ClearButton onClick={reset}>清除資訊</ClearButton>
            <SaveButton onClick={() => {
                if (!canProceed()) {
                    return
                }
                setModal('create')
                setShouldOpenModal(true)
            }}>確認新增</SaveButton>

            {
                modal === 'create' && shouldOpenModal && <Dialog>
                    <DialogContentWrapper width={488} height={248}>
                        <DialogTitle className="mb-5">是否新增此小販</DialogTitle>
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
                    navigate('/manager/hawker')
                }} text={'已完成新增'} />
            }

        </div>
    )
}

export default NewHawker