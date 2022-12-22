import React from 'react'
import { ContentWrapper } from "../../component/StyledComponent"
import { AccordionBody, AccordionHeader, QaContentWrapper, Title } from "./QaStyle"
import { Accordion } from "react-bootstrap"

const Qa = () => {
    return (
        <div className="container-fluid p-5">
            <ContentWrapper className="mt-5">
                <QaContentWrapper>
                    <Title>關於小販團的常見問題</Title>

                    <Accordion flush>
                        {
                            Array.from(Array(10)).map((item, idx) => {
                                return <Accordion.Item className="mb-4 border border-primary rounded-3 overflow-hidden"
                                                       eventKey={idx}>
                                    <AccordionHeader>麵食主義者的最愛，牛頭牌乾拌麵系列上架囉！可從查看商品詳細資訊了解商品價格以及商品的成分與介紹。</AccordionHeader>
                                    <AccordionBody>
                                        麵食主義者的最愛，牛頭牌乾拌麵系列上架囉！可從查看商品詳細資訊了解商品價格以及商品的成分與介紹。麵食主義者的最愛，牛頭牌乾拌麵系列上架囉！可從查看商品詳細資訊了解商品價格以及商品的成分與介紹。麵食主義者的最愛，牛頭牌乾拌麵系列上架囉！可從查看商品詳細資訊了解商品價格以及商品的成分與介紹。麵食主義者的最愛，牛頭牌乾拌麵系列上架囉！可從查看商品詳細資訊了解商品價格以及商品的成分與介紹。麵食主義者的最愛，牛頭牌乾拌麵系列上架囉！可從查看商品詳細資訊了解商品價格以及商品的成分與介紹。
                                    </AccordionBody>
                                </Accordion.Item>
                            })
                        }
                    </Accordion>

                </QaContentWrapper>
            </ContentWrapper>
        </div>
    )
}

export default Qa