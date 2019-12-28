// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

function ieltsValidate(event, context) {
  var date = new Date();
  var originalDate = (event.date).split('-')
  var originalYear = Number(originalDate[0])
  var originalMonth = Number(originalDate[1])
  var originalDay = Number(originalDate[2])
  var year = Number(date.getFullYear())
  var month = Number(date.getMonth() + 1)
  var day = Number(date.getDate())

  //判断成绩公布时期是否还有最少两个月有效期
  if (year - originalYear === 0) {
    return true
  } else {
    if (month - originalMonth < 10 && year - originalYear === 1) {
      return true
    } else {
      return false
    }
  }
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