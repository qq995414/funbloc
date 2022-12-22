import React from 'react'
import * as ExcelJs from "exceljs"
import { DownloadButton } from "./OrderDetailStyle"

const DownloadOrderButton = ({ order }) => {

    function onClick() {
        const workbook = new ExcelJs.Workbook() // 創建試算表檔案
        const sheet = workbook.addWorksheet('工作表範例1') //在檔案中新增工作表 參數放自訂名稱

        sheet.columns = [
            { header: '訂單編號', key: 'num', width: 15 },
            { header: '收件人', key: 'receiverName', width: 10 },
            { header: '地址', key: 'receiverAddress', width: 25 },
            { header: '電話', key: 'receiverPhone', width: 10 },
            { header: '備註', key: 'note', width: 10 },
            { header: '購買人', key: 'orderName', width: 15 },
            { header: '進貨總價', key: 'countCost', width: 10 },
            { header: '售貨總價', key: 'countMyPrice', width: 10 },
            { header: '商品名稱', key: 'productName', width: 10 },
            { header: '數量', key: 'amount', width: 10 },
            { header: '進價', key: 'quote', width: 10 },
            { header: '我的售價', key: 'myPrice', width: 10 },
            { header: '進價總額', key: 'totalQuote', width: 10 },
            { header: '我的售價總額', key: 'totalMyPrice', width: 15 }
        ]

        Object.entries(order.list).map(([key, value]) => {

            const firstRowConfig = {
                num: order.num,
                receiverName: value.receiverName,
                receiverAddress: value.receiverAddress,
                receiverPhone: value.receiverPhone,
                note: value.note,
                orderName: value.orderName,
                countCost: value.orderCount.countCost,
                countMyPrice: value.orderCount.countMyPrice
            }

            value.orderProducts.forEach(({
                                             productName,
                                             amount,
                                             quote,
                                             myPrice
                                         }, idx) => {
                if (idx === 0) {
                    sheet.addRow({
                        ...firstRowConfig,
                        productName: productName,
                        amount: amount,
                        quote: quote,
                        myPrice: myPrice,
                        totalQuote: amount * quote,
                        totalMyPrice: amount * myPrice
                    })
                } else {
                    sheet.addRow({
                        productName: productName,
                        amount: amount,
                        quote: quote,
                        myPrice: myPrice,
                        totalQuote: amount * quote,
                        totalMyPrice: amount * myPrice
                    })
                }


            })
        })

        // 表格裡面的資料都填寫完成之後，訂出下載的callback function
        // 異步的等待他處理完之後，創建url與連結，觸發下載
        workbook.xlsx.writeBuffer().then((content) => {
            const link = document.createElement("a")
            const blobData = new Blob([content], {
                type: "application/vnd.ms-excel;charset=utf-8;"
            })
            link.download = '訂購單.xlsx'
            link.href = URL.createObjectURL(blobData)
            link.click()
        })
    }

    return (
        <DownloadButton onClick={onClick}><i className="bi bi-download me-2" />下載訂購單</DownloadButton>
    )
}

export default DownloadOrderButton