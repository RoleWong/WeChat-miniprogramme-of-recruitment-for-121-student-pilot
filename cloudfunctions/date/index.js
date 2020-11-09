// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

function ieltsValidate(event, context) {
  let date = new Date();
  var originalDateString = (event.date).split('-')
  var originalYear = Number(originalDateString[0])
  var originalMonth = Number(originalDateString[1])-1
  var originalDay = Number(originalDateString[2])
  let originalDate = new Date()
  originalDate.setFullYear(originalYear, originalMonth, originalDay)
  console.log(date, originalDate)
  date = Date.parse(date)
  originalDate = Date.parse(originalDate)
  console.log(date, originalDate)
  const timeSpan = Math.abs(date - originalDate); 
  const daySpan = Math.floor(timeSpan / (24 * 3600 * 1000)); 
  console.log(daySpan)
  return (daySpan < 640)



  //判断成绩公布时期是否还有最少两个月有效期
  //TODO：进入2020后该算法失效，需重做
  // if (year - originalYear === 0) {
  //   return true
  // } else {
  //   if (month - originalMonth < 10 && year - originalYear === 1) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }


};


// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()


  if (event.type === 'ieltsValidate') {
    return ieltsValidate(event, context);
  } else {
    var date = new Date();
    return {
      openid: wxContext.OPENID,
      date: date,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds()
    }

  }
}