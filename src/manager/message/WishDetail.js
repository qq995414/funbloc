import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import { ContentWrapper } from "../../component/StyledComponent"
import { BackWrapper, ContentRow, Label, Text, Time } from "./MessageStyle"
import BackBtn from "../components/general/BackBtn"
import { fetchWish } from "../../api/message/ManagerMessage"
import { MessageTab } from "./Message"

const CommentDetail = () => {
    const navigate = useNavigate()

    const { wishId } = useParams()

    const [isLoading, setIsLoading] = useState(false)

    const [inputKeyword, setInputKeyword] = useState('')
    const [keyword, setKeyword] = useState('')

    const [wish, setWish] = useState({})


    useEffect(() => {

        setIsLoading(true)

        fetchWish(wishId)
            .then(res => {
                setWish(res.data)
            })
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false))
    }, [])


    return (
        <div className="container-fluid p-5">
            <div className="row mb-4 align-items-center">
                <div className="ms-auto col-2 position-relative">
                    {/*<SearchInput type="text"*/}
                    {/*             value={inputKeyword}*/}
                    {/*             onChange={(e) => setInputKeyword(e.target.value)}*/}
                    {/*             placeholder="關鍵字搜尋..." />*/}
                    {/*<SearchIcon onClick={() => setKeyword(inputKeyword)}>*/}
                    {/*    <i className="bi bi-search" />*/}
                    {/*</SearchIcon>*/}
                </div>
            </div>

            <ContentWrapper>
                <ContentRow>
                    <div className="col-8">
                        <div className="row mb-3">
                            <div className="col-2">
                                <Label className="label">訊息時間</Label>
                            </div>
                            <div className="col">
                                <Time>{wish.created_at}</Time>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-2">
                                <Label className="label">小販名稱</Label>
                            </div>
                            <div className="col">
                                <Text>{wish.hawkerName}</Text>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-2">
                                <Label className="label">訊息內容</Label>
                            </div>
                            <div className="col">
                                <Text className="value">{wish.contact}</Text>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <img src={wish.photo} alt="message-image" className="w-100" />
                    </div>
                </ContentRow>
            </ContentWrapper>

            <BackWrapper className="text-center">
                <BackBtn text={'回列表'}
                         onClickCallback={() => navigate('/manager/message', { state: { tab: MessageTab.wish.key } })} />
            </BackWrapper>
        </div>
    )
}

export default CommentDetail