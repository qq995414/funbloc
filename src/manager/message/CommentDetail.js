import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import { ContentWrapper } from "../../component/StyledComponent"
import { BackWrapper, ContentRow, Label, Text, Time } from "./MessageStyle"
import BackBtn from "../components/general/BackBtn"
import { fetchComment } from "../../api/message/ManagerMessage"
import { MessageTab } from "./Message"

const CommentDetail = () => {
    const navigate = useNavigate()

    const { commentId } = useParams()

    const [isLoading, setIsLoading] = useState(false)


    const [comment, setComment] = useState({})


    useEffect(() => {

        setIsLoading(true)

        fetchComment(commentId)
            .then(res => {
                setComment(res.data)
            })
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false))
    }, [])


    return (
        <div className="container-fluid p-5">
            <div className="row mb-4 align-items-center">
                <div className="ms-auto col-2 position-relative" />
            </div>

            <ContentWrapper>
                <ContentRow>
                    <div className="col-8">
                        <div className="row mb-3">
                            <div className="col-2">
                                <Label className="label">訊息時間</Label>
                            </div>
                            <div className="col">
                                <Time>{comment.created_at}</Time>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-2">
                                <Label className="label">小販名稱</Label>
                            </div>
                            <div className="col">
                                <Text>{comment.hawkerName}</Text>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-2">
                                <Label className="label">訊息內容</Label>
                            </div>
                            <div className="col">
                                <Text className="value">{comment.contact}</Text>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <img src={comment.photo} alt="message-image" className="w-100" />
                    </div>
                </ContentRow>
            </ContentWrapper>

            <BackWrapper className="text-center">
                <BackBtn text={'回列表'}
                         onClickCallback={() => navigate('/manager/message', { state: { tab: MessageTab.feedback.key } })} />
            </BackWrapper>
        </div>
    )
}

export default CommentDetail