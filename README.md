## 姓名
張子泓

## 你所實作的網站如何被測試
使用 npm 的測試功能

## 你所實作的加分作業項目，以及如何觸發它你所實作的加分作業項目，以及如何觸發它
- 對所有與線條相關的操作提供撤銷/重做功能
    - 對待線條用和矩形、橢圓相同的方法，將他們都視為物件處理有關創造、刪除、改變顏色等操作。
- 撤銷、重作鍵盤快捷鍵實現
    - 使用 componentDidMount, componentWillUnmount 方法在 App component 裡註冊 event listener
    - 請用 ^z, ^y 觸發
- 增加命令列表區塊
    - 增加一個 command list 的 component，並且將 commandList, currentCommand 加入 context 裡往下傳
- 為所有編輯操作添加重複操作
    - 修改 command object 裡的 repeat 方法。repeat 會重新呼叫 App 中對物件進行操作的方法，並進而創建新的 command object
    - 點擊 Repeat 按鈕按鈕可以重複右方命令列表區塊顯示的當前操作
- 添加四個輕推 (nudge) 移動操作
無
- 使用直接逆模型 (direct inverse model) 添加對選擇性撤消和選擇性重複的支持
無

## 認為此作業最難實作的部分與原因
覺得難做的部份是關於分配在 App.js 中原本的函數要操作哪些 model，command object 要操作哪些 model。而因為 command object 要進行操作是在 App.js 中被創造，關於要傳哪些 get/set 方法考慮較久。原因可能是因為不太熟悉做 object-oriented 的事情。

## 其他與軟體設計相關之感興趣內容
應該是有關測試以及佈署的部份。像是 XTest, Selenium 或是 k8s 等這些工具。
