import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLogo, FormInput, IconLock, IconPerson, LoginForm, LoginWrapper, logo1, logo2, Title } from "./LoginStyle"
import { managerLogin } from "../../api/login/ManagerLogin"

const Login = () => {
    const navigate = useNavigate()

    const [account, setAccount] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const submit = (e) => {
        e.preventDefault()

        setIsLoading(true)

        managerLogin(account, password)
            .then(() => {
                navigate('/manager/home', { replace: true })
            })
            .catch(error => {
                console.error(error)
                navigate('/manager', { replace: true })

            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <LoginWrapper className="d-flex flex-column justify-content-center" id="auth">
            <div className="align-items-center" id="auth-left">
                <AuthLogo className="auth-logo">
                    <div className="d-grid" style={{ justifyItems: 'center' }}>
                        <img src={logo2} alt="Logo" className="h-100" />
                        <img src={logo1} alt="Logo" className="h-75" />
                        <Title className="title font-bold text-primary">總後台管理系統</Title>
                    </div>
                </AuthLogo>

                <LoginForm className="form mx-auto" onSubmit={submit}>
                    <div className="form-group position-relative has-icon-left mb-3">
                        <FormInput type="text" className="form-control form-control-xl usr" value={account}
                            onChange={(e) => setAccount(e.target.value)} placeholder="Username" />
                        <IconPerson className="form-control-icon position-absolute icon-person">
                            <i className="bi bi-person-fill text-primary" />
                        </IconPerson>
                    </div>
                    <div className="form-group position-relative has-icon-left mb-3">
                        <FormInput type="password" className="form-control form-control-xl pwd" value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Password" />
                        <IconLock className="form-control-icon lock-icon position-absolute">
                            <i className="bi bi-unlock-fill text-primary" />
                        </IconLock>
                    </div>
                    <button className="btn btn-primary text-white w-100" disabled={isLoading}>LOGIN</button>
                </LoginForm>
            </div>
        </LoginWrapper>
    )
}

export default Login