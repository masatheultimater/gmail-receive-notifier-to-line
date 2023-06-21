let targetLabel = ''
const lineNotifyApi = PropertiesService.getScriptProperties().getProperty("lineNotifyApi")
const udemyUrl = PropertiesService.getScriptProperties().getProperty("udemyUrl")


function notifyToLine(data, line_token) {
  let options = {
  "method": "post",
  "payload": {"message": data},
  "headers": {"Authorization": "Bearer " + line_token}
  } 
  UrlFetchApp.fetch(lineNotifyApi, options)
}


function udemy_sale_mail_notify() {
  targetLabel = 'Udemy セール・クーポン'
  const query = 'label:' + targetLabel + ' AND newer_than:1d AND is:unread'
  const threads = GmailApp.search(query)
  const line_token = PropertiesService.getScriptProperties().getProperty("udemySaleNotifyLineToken")

  threads.forEach(thread =>{
    const messages = thread.getMessages()

    messages.forEach(message =>{
      message.markRead()
      
      let data = ""
      let date = Utilities.formatDate(message.getDate(), "JST","yyyy/MM/dd")
      let subject = message.getSubject()
      let form = [date, subject]

      form.forEach(element =>{
        data += element + ' \n '
      })

      data += udemyUrl

      console.log(JSON.stringify(data))
      notifyToLine(data, line_token)
    })
    
  })
}

