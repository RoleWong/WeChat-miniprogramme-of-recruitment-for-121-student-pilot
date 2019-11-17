const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
var db = cloud.database();

function fixZero(num) {
  return num < 10 ? '0' + num : num;
};

async function register(event, context) {
  const wxContext = cloud.getWXContext()
  let checkIfRegistered = await db.collection('userinfo').where({
    openid: wxContext.OPENID,
  }).get()

  if (!checkIfRegistered.data[0]) {
    console.log('开始执行新增注册用户信息步骤');
    return new Promise(function(resolve, reject) {
      var dataToUserinfo = {
        openid: wxContext.OPENID,
        nickName: event.nickName,
        gender: event.gender,
        avatar: event.avatarUrl,
        language: event.language,
        city: event.city,
        province: event.province
      };

      var dataToStatus = {
        openid: wxContext.OPENID,
        register: true,
        cv: "waiting",
        firstInterviewOrderId: 0,
        firstintervIewPass: "waiting",
        firstPhysicalCheckId: 0,
        firstPhysicalCheckPass: "waiting",
        secondInterviewOrderId: 0,
        secondintervIewPass: "waiting",
        secondPhysicalCheckId: 0,
        secondPhysicalCheckPass: "waiting",
        backgroundInvestigation: "waiting",
        ielts: "waiting",
        ieltsScore: 0,
        finalTest: "waiting",
        pilotSchoolId: 0,
        pilotSchoolPass: "waiting",
        offer: "waiting"
      };

      db.collection('status').add({
        data: dataToStatus,
        success: function(res) {
          console.log('状态初始化完成');
        },
        fail: function(err) {
          reject(err);
        }
      });
      db.collection('userinfo').add({
        data: dataToUserinfo,
        success: function(res) {
          console.log('公开信息写入完成');
        },
        fail: function(err) {
          reject(err);
        }
      });

    });
  }
};

function getUserinfo(event, context) {
  const wxContext = cloud.getWXContext()
  return db.collection('userinfo').where({
    openid: wxContext.OPENID,
  }).get()
};

async function getInterview(event, context) {
  var allInterview = await db.collection(event.session + 'interview').get();
  console.log('全部面试场次', allInterview);

  allInterview.data.forEach((item, index) => {
    const date = new Date(item.date);
    item.timeInfo = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate(),
      hours: date.getHours(),
      minutes: fixZero(date.getMinutes())
    };
    // allInterview.data[index].date = date;
  });

  return allInterview;
};

async function confirmInterview(event, context) {
  console.log('准备写入确认面试', event);
  const wxContext = cloud.getWXContext();

  await db.collection('status').where({
      openid: wxContext.OPENID,
    })
    .update({
      data: {
        firstInterviewOrderId: event.pick,
      },
    });

  //自身计数器增加功能还未完成

  // db.collection('firstinterview').where({
  //   _id: event.pick,
  // })
  //   .update({
  //     data: {
  //       firstInterviewOrderId: event.pick,
  //     },
  //   });
};

async function writeCV(event, context) {
  console.log('开始录入面试简历1', event);
  const wxContext = cloud.getWXContext();

  var cv = {
    openid: wxContext.OPENID,
    cv_document: event.form,
    cv_identificationPhoto: event.identificationPhoto
  };

  await db.collection('cv').add({
    data: cv,
    success: function(res) {
      console.log('简历信息已录入', res)
    },
    fail: function(err) {
      console.log('简历录入失败', err)
    }
  });
  console.log('录入成功');

  db.collection('status').where({
      openid: wxContext.OPENID,
    })
    .update({
      data: {
        cv: 'pass'
      },
    });
};

async function checkIfRegister(event, context) {
  const wxContext = cloud.getWXContext()
  let checkIfRegistered = await db.collection('userinfo').where({
    openid: wxContext.OPENID,
  }).get()
  if (!checkIfRegistered.data[0]) {
    return false;
  } else {
    return true;
  }
};

async function getStatusCode(event, context) {
  const wxContext = cloud.getWXContext()
  let currentApllicantStatus = await db.collection('status').where({
    openid: wxContext.OPENID,
  }).get();
  console.log(currentApllicantStatus.data[0]);

  var statusCode = 0;
  if (currentApllicantStatus.data[0]) {
    if (currentApllicantStatus.data[0].register === true) {
      statusCode = 0;
    }
    if (currentApllicantStatus.data[0].cv === "pass") {
      statusCode = 1;
    }
    if (currentApllicantStatus.data[0].firstInterviewOrderId != 0) {
      statusCode = 2;
    }
    if (currentApllicantStatus.data[0].firstintervIewPass === "pass") {
      statusCode = 3;
    }
    if (currentApllicantStatus.data[0].firstPhysicalCheckId != 0) {
      statusCode = 4;
    }
    if (currentApllicantStatus.data[0].firstPhysicalCheckPass === "pass") {
      statusCode = 5;
    }
    if (currentApllicantStatus.data[0].secondInterviewOrderId != 0) {
      statusCode = 6;
    }
    if (currentApllicantStatus.data[0].secondintervIewPass === "pass") {
      statusCode = 7;
    }
    if (currentApllicantStatus.data[0].secondPhysicalCheckId != 0) {
      statusCode = 8;
    }
    if (currentApllicantStatus.data[0].secondintervIewPass === "pass") {
      statusCode = 9;
    }
    if (currentApllicantStatus.data[0].backgroundInvestigation === "pass") {
      statusCode = 10;
    }
    if (currentApllicantStatus.data[0].ielts === "pass") {
      statusCode = 11;
    }
    if (currentApllicantStatus.data[0].finalTest === "pass") {
      statusCode = 12;
    }
    if (currentApllicantStatus.data[0].pilotSchoolId != 0) {
      statusCode = 13;
    }
    if (currentApllicantStatus.data[0].pilotSchoolPass === "pass") {
      statusCode = 14;
    }
    if (currentApllicantStatus.data[0].offer === "pass") {
      statusCode = 15;
    }
    return statusCode;
  } else {
    return 666;
  }

};

// 云函数入口函数
exports.main = async(event, context) => {
  console.log('云函数开始', event);
  if (event.type === 'register') {
    return register(event, context);
  }
  if (event.type === 'getUserinfo') {
    return getUserinfo(event, context);
  }
  if (event.type === 'checkIfRegister') {
    return checkIfRegister(event, context);
  }
  if (event.type === 'getStatusCode') {
    return getStatusCode(event, context);
  }
  if (event.type === 'writeCV') {
    return writeCV(event, context);
  }
  if (event.type === 'getInterview') {
    return getInterview(event, context);
  }
  if (event.type === 'confirmInterview') {
    return confirmInterview(event, context);
  }

}