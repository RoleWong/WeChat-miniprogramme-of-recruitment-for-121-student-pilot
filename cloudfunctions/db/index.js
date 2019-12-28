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
        backgroundInvestigation: {},
        ielts: "waiting",
        ieltsScore: 0,
        finalInterviewOrderId: 0,
        finalIntervIewPass: "waiting",
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
}

function getUserinfo(event, context) {
  const wxContext = cloud.getWXContext()
  return db.collection('userinfo').where({
    openid: wxContext.OPENID,
  }).get()
};

function getCV(event, context) {
  const wxContext = cloud.getWXContext()
  return db.collection('cv').where({
    openid: wxContext.OPENID,
  }).get()
};

async function getInterview(event, context) {
  // 【有待完善】最好能实现按照顺序，自动屏蔽前序工作未完成时的场次
  console.log(event.session)
  var allInterview = await db.collection(event.session).get();
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

  // 判断场次写入预约场次ID
  if (event.session === "firstinterview") {
    await db.collection('status').where({
        openid: wxContext.OPENID,
      })
      .update({
        data: {
          firstInterviewOrderId: event.pick,
        },
      });
  };
  if (event.session === "secondinterview") {
    await db.collection('status').where({
        openid: wxContext.OPENID,
      })
      .update({
        data: {
          secondInterviewOrderId: event.pick,
        },
      });
  };
  if (event.session === "finalinterview") {
    await db.collection('status').where({
        openid: wxContext.OPENID,
      })
      .update({
        data: {
          finalInterviewOrderId: event.pick,
        },
      });
  };
  if (event.session === "firstphysicalcheck") {
    await db.collection('status').where({
        openid: wxContext.OPENID,
      })
      .update({
        data: {
          firstPhysicalCheckId: event.pick,
        },
      });
  };
  if (event.session === "secondphysicalcheck") {
    await db.collection('status').where({
        openid: wxContext.OPENID,
      })
      .update({
        data: {
          secondPhysicalCheckId: event.pick,
        },
      });
  };



  //场次自身计数器增加

  let currentInterviewStatus = await db.collection(event.session).where({
    _id: event.pick,
  }).get();

  var newApplicantsNumber = currentInterviewStatus.data[0].applicants + 1;

  console.log('准备将该场次的报名人数调整为', newApplicantsNumber);

  db.collection(event.session).where({
      _id: event.pick,
    })
    .update({
      data: {
        applicants: newApplicantsNumber,
      },
    });
};

function writeBackgroundInvestigation(event, context) {
  console.log('开始录入背调信息', event);
  const wxContext = cloud.getWXContext();
  //这里踩过的坑，node.js不能自动将云数据库中的原string类型'backgroundInvestigation'转换为object对象backgroundInvestigation，会导致promise被reject。后期将初始化时该变量定义为object类型，解决问题。

  db.collection('status').where({
      openid: wxContext.OPENID,
    })
    .update({
      data: {
        backgroundInvestigation: event.uploadPhotos
      },
    });

  return '下次一定要注意变量类型哦~'
}

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

  //若雅思成绩达标，直接写入status表
  if (event.form.englishLevel === "2" && event.form.englishScore >= 5.5) {
    db.collection('status').where({
        openid: wxContext.OPENID,
      })
      .update({
        data: {
          cv: 'pass',
          ielts: "pass",
          ieltsScore: event.form.englishScore,
        },
      });

  } else {
    db.collection('status').where({
        openid: wxContext.OPENID,
      })
      .update({
        data: {
          cv: 'pass'
        },
      });
  }

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

async function getWaitingDetail(event, context) {
  const wxContext = cloud.getWXContext()
  var openid = wxContext.OPENID
  var currentStatusCode = await getStatusCode();
  console.log('获取到当前状态', currentStatusCode)


  if (currentStatusCode === 2) {
    //初面的等待结果页面数据
    let status = await db.collection('status').where({
      openid: wxContext.OPENID,
    }).get();
    var chooseSectionID = status.data[0].firstInterviewOrderId
    let information = await db.collection('firstinterview').where({
      _id: chooseSectionID
    }).get();

    let remind = ["（一）报名携带资料", "1. 彩色1寸免冠近照2张；黑色签字笔。", "2. 身份证；学生证（大三、大四在校生）；毕业证、学位证（往届生）；英语水平证书（如具备）。", "（二）面试注意事项", "1. 应聘者需着正装。", "2. 应聘者须在整个招聘过程中保持安静，不在招聘场地交头接耳、大声喧哗，手机开启震动模式。", "3. 各轮面试期间，应聘者请妥善保管私人物品，如有遗失自行负责。", "4. 面试各环节谢绝家属陪同。"]

    information.data.forEach((item, index) => {
      const date = new Date(item.date);
      item.timeInfo = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
        hours: date.getHours(),
        minutes: fixZero(date.getMinutes())
      };
      // information.data[index].date = date;
    });
    console.log('返回等待页面数据', information, remind)
    return {
      information: information.data[0],
      remind: remind,
      type: "初面"
    }
  }

  if (currentStatusCode === 4) {
    let status = await db.collection('status').where({
      openid: wxContext.OPENID,
    }).get();
    var chooseSectionID = status.data[0].firstPhysicalCheckId
    let information = await db.collection('firstphysicalcheck').where({
      _id: chooseSectionID
    }).get();

    information.data.forEach((item, index) => {
      const date = new Date(item.date);
      item.timeInfo = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
        hours: date.getHours(),
        minutes: fixZero(date.getMinutes())
      };
      // information.data[index].date = date;
    });

    const remind = []
    if (information.data[0].city === "广州") {

      this.remind = ["1. 请于" + information.data[0].timeInfo.year + "年" + information.data[0].timeInfo.month + "月" + information.data[0].timeInfo.date + "日" + "上午8点在民航广州医院门诊楼大厅集合，迟到超过30分钟取消体检资格；体检过程中严禁亲友陪同。", "2. 体检期间的交通及食宿由应聘人员自理。", "3. 请携带本人身份证、近期1寸免冠彩色照片3张及黑色签字笔1支。", "4. 体检实行单项淘汰制，任何一项没达到体检标准即被淘汰；如果完成所有体检项目需要两整天时间，回程尽量订可以改签的机票，以应对可能出现额外复查的情况。", "5. 体检前一日晚须洗澡并保证充足睡眠。体检第一日晚八点后直至体检第二日上午不得进食，可携带早餐于抽血及B超后进餐。"]
    } else if (information.data[0].city === "北京") {
      this.remind = ["1. 请于" + information.data[0].timeInfo.year + "年" + information.data[0].timeInfo.month + "月" + information.data[0].timeInfo.date + "日" + "上午8点在北京市朝阳区民航总医院民用航空人员体检鉴定所集合，迟到超过30分钟取消体检资格；体检过程中严禁亲友陪同。", "2. 体检期间的交通及食宿由应聘人员自理。", "3. 请携带本人身份证、近期1寸免冠彩色照片3张及黑色签字笔1支。", "4. 体检实行单项淘汰制，任何一项没达到体检标准即被淘汰；如果完成所有体检项目需要两整天时间，回程尽量订可以改签的机票，以应对可能出现额外复查的情况。", "5. 体检前一日晚须洗澡并保证充足睡眠。体检第一日晚八点后直至体检第二日上午不得进食，可携带早餐于抽血及B超后进餐。"]
    }

    console.log('返回等待页面数据', information, this.remind)
    return {
      information: information.data[0],
      remind: this.remind,
      type: "上站体检一检"
    }
  }

  if (currentStatusCode === 6) {
    //领导面试的等待结果页面数据
    let status = await db.collection('status').where({
      openid: wxContext.OPENID,
    }).get();
    var chooseSectionID = status.data[0].secondInterviewOrderId
    let information = await db.collection('secondinterview').where({
      _id: chooseSectionID
    }).get();

    console.log('information', information)

    let remind = ["1. 面试持续半天，请自行安排行程。", "2. 请携带身份证原件及一支黑色签字笔。", "3. 请着深色西装外套、西裤、白色衬衣及皮鞋。", "4. 本轮面试食宿及交通自理。"]

    information.data.forEach((item, index) => {
      const date = new Date(item.date);
      item.timeInfo = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
        hours: date.getHours(),
        minutes: fixZero(date.getMinutes())
      };
      // information.data[index].date = date;
    });
    console.log('返回等待页面数据', information, remind)
    return {
      information: information.data[0],
      remind: remind,
      type: "领导面试"
    }
  }

  if (currentStatusCode === 8) {
    //上站复检的等待结果页面数据
    let status = await db.collection('status').where({
      openid: wxContext.OPENID,
    }).get();
    var chooseSectionID = status.data[0].secondPhysicalCheckId
    let information = await db.collection('secondphysicalcheck').where({
      _id: chooseSectionID
    }).get();

    information.data.forEach((item, index) => {
      const date = new Date(item.date);
      item.timeInfo = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
        hours: date.getHours(),
        minutes: fixZero(date.getMinutes())
      };
      // information.data[index].date = date;
    });

    const remind = []
    if (information.data[0].city === "广州") {

      this.remind = ["1. 请于" + information.data[0].timeInfo.year + "年" + information.data[0].timeInfo.month + "月" + information.data[0].timeInfo.date + "日" + "上午8点在民航广州医院门诊楼大厅集合，迟到超过30分钟取消体检资格；体检过程中严禁亲友陪同。", "2. 体检期间的交通及食宿由应聘人员自理。", "3. 请携带本人身份证、近期1寸免冠彩色照片3张及黑色签字笔1支。", "4. 体检实行单项淘汰制，任何一项没达到体检标准即被淘汰；如果完成所有体检项目需要两整天时间，回程尽量订可以改签的机票，以应对可能出现额外复查的情况。", "5. 体检前一日晚须洗澡并保证充足睡眠。体检第一日晚八点后直至体检第二日上午不得进食，可携带早餐于抽血及B超后进餐。"]
    } else if (information.data[0].city === "北京") {
      this.remind = ["1. 请于" + information.data[0].timeInfo.year + "年" + information.data[0].timeInfo.month + "月" + information.data[0].timeInfo.date + "日" + "上午8点在北京市朝阳区民航总医院民用航空人员体检鉴定所集合，迟到超过30分钟取消体检资格；体检过程中严禁亲友陪同。", "2. 体检期间的交通及食宿由应聘人员自理。", "3. 请携带本人身份证、近期1寸免冠彩色照片3张及黑色签字笔1支。", "4. 体检实行单项淘汰制，任何一项没达到体检标准即被淘汰；如果完成所有体检项目需要两整天时间，回程尽量订可以改签的机票，以应对可能出现额外复查的情况。", "5. 体检前一日晚须洗澡并保证充足睡眠。体检第一日晚八点后直至体检第二日上午不得进食，可携带早餐于抽血及B超后进餐。"]
    }

    console.log('返回等待页面数据', information, this.remind)
    return {
      information: information.data[0],
      remind: this.remind,
      type: "上站体检复检"
    }
  }
}

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
    if (currentApllicantStatus.data[0].secondPhysicalCheckPass === "pass") {
      statusCode = 9;
    }
    if (currentApllicantStatus.data[0].backgroundInvestigation !== {}) {
      statusCode = 10;
    }
    if (currentApllicantStatus.data[0].ielts === "pass") {
      statusCode = 11;
    }
    if (currentApllicantStatus.data[0].finalInterviewOrderId != 0) {
      statusCode = 12;
    }
    if (currentApllicantStatus.data[0].finalIntervIewPass === "pass") {
      statusCode = 13;
    }
    if (currentApllicantStatus.data[0].pilotSchoolId != 0) {
      statusCode = 14;
    }
    if (currentApllicantStatus.data[0].pilotSchoolPass === "pass") {
      statusCode = 15;
    }
    if (currentApllicantStatus.data[0].offer === "pass") {
      statusCode = 16;
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
  if (event.type === 'getCV') {
    return getCV(event, context);
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
  if (event.type === 'getWaitingDetail') {
    return getWaitingDetail(event, context);
  }
  if (event.type === 'writeBackgroundInvestigation') {
    return writeBackgroundInvestigation(event, context)
  }

}