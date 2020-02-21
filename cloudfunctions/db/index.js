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
        ieltsScore: {},
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

function getStaffInfo(event, context) {
  const wxContext = cloud.getWXContext()
  return db.collection('staff').where({
    openid: wxContext.OPENID,
  }).get()
};

function getStatus(event, context) {
  const wxContext = cloud.getWXContext()
  return db.collection('status').where({
    openid: wxContext.OPENID,
  }).get()
};

function confirmOffer(event, context) {
  const wxContext = cloud.getWXContext()
  db.collection('status').where({
      openid: wxContext.OPENID,
    })
    .update({
      data: {
        offer: 'pass'
      },
      success: function(res) {
        return "confirmSuccess!"
      }
    })
}

function getCV(event, context) {
  const wxContext = cloud.getWXContext()
  return db.collection('cv').where({
    openid: wxContext.OPENID,
  }).get()
};

async function getPilot(event, context) {
  // 【TODO】最好能实现按照顺序，自动屏蔽前序工作未完成时的场次
  var allInterview = await db.collection('pilotschool').get();
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

async function getAllInterview(event, context) {
  let firstInterview = await db.collection("firstinterview").get();
  let firstInterviewAmount = 0
  firstInterview.data.forEach((item, index) => {
    firstInterviewAmount += item.applicants
    const date = new Date(item.date);
    item.timeInfo = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate(),
      hours: date.getHours(),
      minutes: fixZero(date.getMinutes())
    };
  });

  let secondInterview = await db.collection("secondinterview").get();
  let secondInterviewAmount = 0
  secondInterview.data.forEach((item, index) => {
    secondInterviewAmount += item.applicants
    const date = new Date(item.date);
    item.timeInfo = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate(),
      hours: date.getHours(),
      minutes: fixZero(date.getMinutes())
    };
  });

  let finalInterview = await db.collection("finalinterview").get();
  let finalInterviewAmount = 0
  finalInterview.data.forEach((item, index) => {
    finalInterviewAmount += item.applicants
    const date = new Date(item.date);
    item.timeInfo = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate(),
      hours: date.getHours(),
      minutes: fixZero(date.getMinutes())
    };
  });
  console.log(firstInterview, secondInterview, finalInterview)
  return [firstInterview, secondInterview, finalInterview, firstInterviewAmount, secondInterviewAmount, finalInterviewAmount]

};

async function getAllPhysicalCheck(event, context) {

  let firstPhysicalCheck = await db.collection("firstphysicalcheck").get();
  let firstPhysicalCheckAmount = 0
  let totalPhysicalCheckSessionAmount = 0
  firstPhysicalCheck.data.forEach((item, index) => {
    totalPhysicalCheckSessionAmount++
    firstPhysicalCheckAmount += item.applicants
    const date = new Date(item.date);
    item.timeInfo = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate(),
      hours: date.getHours(),
      minutes: fixZero(date.getMinutes())
    };
  });

  let secondPhysicalCheck = await db.collection("secondphysicalcheck").get();
  let secondPhysicalCheckAmount = 0
  secondPhysicalCheck.data.forEach((item, index) => {
    totalPhysicalCheckSessionAmount++
    secondPhysicalCheckAmount += item.applicants
    const date = new Date(item.date);
    item.timeInfo = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate(),
      hours: date.getHours(),
      minutes: fixZero(date.getMinutes())
    };
  });

  console.log(firstPhysicalCheck, secondPhysicalCheck)
  return [firstPhysicalCheck, secondPhysicalCheck, firstPhysicalCheckAmount, secondPhysicalCheckAmount, totalPhysicalCheckSessionAmount]

}

async function getAllPilotSchool(event, context) {
  let pilotCheck = await db.collection("pilotschool").get();
  let domesticAmount = 0
  let foreignAmount = 0
  let totalSessionAmount = 0
  pilotCheck.data.forEach((item, index) => {
    totalSessionAmount++
    if (item.type === "国内") {
      domesticAmount += item.applicants
    } else {
      foreignAmount += item.applicants
    }
    const date = new Date(item.date);
    item.timeInfo = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate(),
      hours: date.getHours(),
      minutes: fixZero(date.getMinutes())
    };
  });

  console.log(pilotCheck)
  return [pilotCheck, domesticAmount, foreignAmount, totalSessionAmount]
}


async function getInterview(event, context) {
  // 【TODO】最好能实现按照顺序，自动屏蔽前序工作未完成时的场次
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
  if (event.session === "pilotschool") {
    await db.collection('status').where({
        openid: wxContext.OPENID,
      })
      .update({
        data: {
          pilotSchoolId: event.pick,
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



  //场次自身计数器增加（使用新方法）

  const _ = db.command
  db.collection(event.session).where({
      _id: event.pick
    })
    .update({
      data: {
        applicants: _.inc(1)
      },
    })

  //以下是原先获取，服务端+1，再录入的方法
  // let currentInterviewStatus = await db.collection(event.session).where({
  //   _id: event.pick,
  // }).get();

  // var newApplicantsNumber = currentInterviewStatus.data[0].applicants + 1;

  // console.log('准备将该场次的报名人数调整为', newApplicantsNumber);

  // db.collection(event.session).where({
  //     _id: event.pick,
  //   })
  //   .update({
  //     data: {
  //       applicants: newApplicantsNumber,
  //     },
  //   });
};

async function getProcessAmount(event, context) {
  //获取面试待结论数量
  let firstInterview = await db.collection("firstinterview").where({}).get();
  let firstInterviewAmount = 0
  for (index in (firstInterview.data)) {
    firstInterviewAmount = firstInterview.data[index].applicants + firstInterviewAmount
  }
  console.log("firstInterviewAmount", firstInterviewAmount)

  let secondInterview = await db.collection("secondinterview").where({}).get();
  let secondInterviewAmount = 0
  for (index in (secondInterview.data)) {
    secondInterviewAmount = secondInterview.data[index].applicants + secondInterviewAmount
  }
  console.log("secondInterviewAmount", secondInterviewAmount)

  let finalInterview = await db.collection("finalinterview").where({}).get();
  let finalInterviewAmount = 0
  for (index in (finalInterview.data)) {
    finalInterviewAmount = finalInterview.data[index].applicants + finalInterviewAmount
  }
  console.log("finalInterviewAmount", finalInterviewAmount)

  totalInterviewAmount = firstInterviewAmount + secondInterviewAmount + finalInterviewAmount
  console.log('totalInterview', totalInterviewAmount)

  //获取体检待结论数量
  let firstPhysicalCheck = await db.collection("firstphysicalcheck").where({}).get();
  let firstPhysicalCheckAmount = 0
  for (index in (firstPhysicalCheck.data)) {
    firstPhysicalCheckAmount = firstPhysicalCheck.data[index].applicants + firstPhysicalCheckAmount
  }
  console.log("firstPhysicalCheckAmount", firstPhysicalCheckAmount)

  let secondPhysicalCheck = await db.collection("secondphysicalcheck").where({}).get();
  let secondPhysicalCheckAmount = 0
  for (index in (secondPhysicalCheck.data)) {
    secondPhysicalCheckAmount = secondPhysicalCheck.data[index].applicants + secondPhysicalCheckAmount
  }
  console.log("secondPhysicalCheckAmount", secondPhysicalCheckAmount)

  totalPhysicalCheckAmount = firstPhysicalCheckAmount + secondPhysicalCheckAmount
  console.log('totalPhysicalCheck', totalPhysicalCheckAmount)

  //获取待航校结论数量
  let pilotschool = await db.collection("pilotschool").where({}).get();
  let pilotschoolAmount = 0
  for (index in (pilotschool.data)) {
    pilotschoolAmount = pilotschool.data[index].applicants + pilotschoolAmount
  }
  console.log("pilotschool", pilotschoolAmount)
  return {
    interview: totalInterviewAmount,
    pyhicalcheck: totalPhysicalCheckAmount,
    pilotschool: pilotschoolAmount
  }
}

function writeBackgroundInvestigation(event, context) {
  console.log('开始录入背调信息', event);
  const wxContext = cloud.getWXContext();
  // 这里踩过的坑，node.js不能自动将云数据库中的原string类型'backgroundInvestigation'转换为object对象backgroundInvestigation，会导致promise被reject。后期将初始化时该变量定义为object类型，解决问题。
  // const _ = db.command
  return db.collection('status').where({
      openid: wxContext.OPENID,
    })
    .update({
      data: {
        backgroundInvestigation: event.uploadPhotos
      },
    });
}

function writeIELTS(event, context) {
  console.log('开始录入IELTS', event)
  const wxContext = cloud.getWXContext();
  db.collection('status').where({
      openid: wxContext.OPENID,
    })
    .update({
      data: {
        ielts: "pass",
        ieltsScore: event.form,
      },
    });
}

function jumpIELTS(event, context) {
  console.log('开始跳过雅思', event)
  const wxContext = cloud.getWXContext();

  db.collection('status').where({
      openid: wxContext.OPENID,
    })
    .update({
      data: {
        ielts: 'jump',
      },
    });
}

function writeAddress(event, context) {
  console.log('开始写入邮寄地址', event)
  const wxContext = cloud.getWXContext();

  db.collection('status').where({
      openid: wxContext.OPENID,
    })
    .update({
      data: {
        offerAddress: event.address,
      },
    });
}

async function writeCV(event, context) {
  console.log('开始录入面试简历', event)
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
          ielts: "pass",
          ieltsScore: {
            total: event.form.englishScore
          },
          cv: 'pass'
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

async function getOriginalSessionData(event, context) {
  if (event.sessionType === "初面") {
    var originalSessionData = await db.collection('firstinterview').where({
      _id: event.id
    }).get()
    var returnType = 0
  }
  if (event.sessionType === "领导面") {
    var originalSessionData = await db.collection('secondinterview').where({
      _id: event.id
    }).get()
    var returnType = 1
  }
  if (event.sessionType === "终审考核") {
    var originalSessionData = await db.collection('finalinterview').where({
      _id: event.id
    }).get()
    var returnType = 2
  }
  if (event.sessionType === "上站初检") {
    var originalSessionData = await db.collection('firstphysicalcheck').where({
      _id: event.id
    }).get()
    var returnType = 0
  }
  if (event.sessionType === "上站复检") {
    var originalSessionData = await db.collection('secondphysicalcheck').where({
      _id: event.id
    }).get()
    var returnType = 1
  }
  if (event.sessionType === "航校面试") {
    var originalSessionData = await db.collection('pilotschool').where({
      _id: event.id
    }).get()
    var returnType = 0
  }
  originalSessionData.data.forEach((item, index) => {
    const date = new Date(item.date);
    item.txdate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    item.txtime = `${date.getHours()}:${fixZero(date.getMinutes())}`
    item.timeInfo = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate(),
      hours: date.getHours(),
      minutes: fixZero(date.getMinutes())
    };
  });
  return [originalSessionData, '这个位没用了', returnType];
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

  if (currentStatusCode === 14) {
    //领导面试的等待结果页面数据
    let status = await db.collection('status').where({
      openid: wxContext.OPENID,
    }).get();
    var chooseSectionID = status.data[0].pilotSchoolId
    let information = await db.collection('pilotschool').where({
      _id: chooseSectionID
    }).get();

    console.log('information', information)

    let remind = ["1. 面试持续一整天，请自行安排行程。", "2. 请携带身份证原件、雅思成绩单及一支黑色签字笔。", "3. 请着深色西装外套、西裤、白色衬衣及皮鞋。", "4. 本轮航校面试食宿及交通自理。", "5. 本次选择将直接关系到学飞所在地及培养方式，如需修改意愿航校，请直接联系工作人员。"]

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
      type: "航校面试"
    }
  }

  if (currentStatusCode === 12) {
    //领导面试的等待结果页面数据
    let status = await db.collection('status').where({
      openid: wxContext.OPENID,
    }).get();
    var chooseSectionID = status.data[0].finalInterviewOrderId
    let information = await db.collection('finalinterview').where({
      _id: chooseSectionID
    }).get();

    console.log('information', information)

    let remind = ["1. 面试持续半天，请自行安排行程。", "2. 请携带身份证原件及一支黑色签字笔。", "3. 请着深色西装外套、西裤、白色衬衣及皮鞋。", "4. 本轮面试食宿及交通自理。", "5. 请携带合格的雅思成绩单至现场提交。若还未系统中上传，请确保自己的雅思成绩可用。"]

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
      type: "终审考核"
    }
  }
}

function failedProcess(event, context) {
  console.log('failedProcess', event)

  if (event.sessionType === "firstinterview") {
    db.collection('status').where({
        openid: event.openid,
      })
      .update({
        data: {
          firstintervIewPass: "failed",
        },
      });
    const _ = db.command
    db.collection('firstinterview').where({
        _id: event.sessionId
      })
      .update({
        data: {
          applicants: _.inc(-1)
        },
      })
  }

  if (event.sessionType === "secondinterview") {
    db.collection('status').where({
        openid: event.openid,
      })
      .update({
        data: {
          secondintervIewPass: "failed",
        },
      });
    const _ = db.command
    db.collection('secondinterview').where({
        _id: event.sessionId
      })
      .update({
        data: {
          applicants: _.inc(-1)
        },
      })
  }

  if (event.sessionType === "finalinterview") {
    db.collection('status').where({
        openid: event.openid,
      })
      .update({
        data: {
          finalIntervIewPass: "failed",
        },
      });
    const _ = db.command
    db.collection('finalinterview').where({
        _id: event.sessionId
      })
      .update({
        data: {
          applicants: _.inc(-1)
        },
      })
  }

  if (event.sessionType === "firstphysicalcheck") {
    db.collection('status').where({
        openid: event.openid,
      })
      .update({
        data: {
          firstPhysicalCheckPass: "failed",
        },
      });
    const _ = db.command
    db.collection('firstphysicalcheck').where({
        _id: event.sessionId
      })
      .update({
        data: {
          applicants: _.inc(-1)
        },
      })
  }

  if (event.sessionType === "secondphysicalcheck") {
    db.collection('status').where({
        openid: event.openid,
      })
      .update({
        data: {
          secondPhysicalCheckPass: "failed",
        },
      });
    const _ = db.command
    db.collection('secondphysicalcheck').where({
        _id: event.sessionId
      })
      .update({
        data: {
          applicants: _.inc(-1)
        },
      })
  }

  if (event.sessionType === "pilotschool") {
    db.collection('status').where({
        openid: event.openid,
      })
      .update({
        data: {
          pilotSchoolPass: "failed",
        },
      });
    const _ = db.command
    db.collection('pilotschool').where({
        _id: event.sessionId
      })
      .update({
        data: {
          applicants: _.inc(-1)
        },
      })
  }
}

function passProcess(event, context) {
  console.log('passProcess', event)

  if (event.sessionType === "firstinterview") {
    db.collection('status').where({
        openid: event.openid,
      })
      .update({
        data: {
          firstintervIewPass: "pass",
        },
      });
    const _ = db.command
    db.collection('firstinterview').where({
        _id: event.sessionId
      })
      .update({
        data: {
          applicants: _.inc(-1)
        },
      })
  }

  if (event.sessionType === "secondinterview") {
    db.collection('status').where({
        openid: event.openid,
      })
      .update({
        data: {
          secondintervIewPass: "pass",
        },
      });
    const _ = db.command
    db.collection('secondinterview').where({
        _id: event.sessionId
      })
      .update({
        data: {
          applicants: _.inc(-1)
        },
      })
  }

  if (event.sessionType === "finalinterview") {
    db.collection('status').where({
        openid: event.openid,
      })
      .update({
        data: {
          finalIntervIewPass: "pass",
        },
      });
    const _ = db.command
    db.collection('finalinterview').where({
        _id: event.sessionId
      })
      .update({
        data: {
          applicants: _.inc(-1)
        },
      })
  }

  if (event.sessionType === "firstphysicalcheck") {
    db.collection('status').where({
        openid: event.openid,
      })
      .update({
        data: {
          firstPhysicalCheckPass: "pass",
        },
      });
    const _ = db.command
    db.collection('firstphysicalcheck').where({
        _id: event.sessionId
      })
      .update({
        data: {
          applicants: _.inc(-1)
        },
      })
  }

  if (event.sessionType === "secondphysicalcheck") {
    db.collection('status').where({
        openid: event.openid,
      })
      .update({
        data: {
          secondPhysicalCheckPass: "pass",
        },
      });
    const _ = db.command
    db.collection('secondphysicalcheck').where({
        _id: event.sessionId
      })
      .update({
        data: {
          applicants: _.inc(-1)
        },
      })
  }

  if (event.sessionType === "pilotschool") {
    db.collection('status').where({
        openid: event.openid,
      })
      .update({
        data: {
          pilotSchoolPass: "pass",
        },
      });
    const _ = db.command
    db.collection('pilotschool').where({
        _id: event.sessionId
      })
      .update({
        data: {
          applicants: _.inc(-1)
        },
      })
  }

}

function addSession(event, context) {
  if (event.currentAction === 2) {
    //这一坨用于编辑现有场次，event.currentAction为2。
    console.log('update', event)
    if (event.sessionType === "初面") {
      console.log('准备更新初面数据', event.content)
      console.log('将要更新的场次ID为', event.needUpdateId)
      db.collection('firstinterview').where({
          _id: event.needUpdateId
        })
        .update({
          data: {
            address: event.content.address,
            city: event.content.city,
            date: event.content.date,
            place: event.content.place,
            liaisonOfficer: event.content.liaisonOfficer,
            location: {
              latitude: event.content.location.latitude,
              longitude: event.content.location.longitude,
              name: event.content.location.name
            }
          },
        })
    }
    if (event.sessionType === "领导面") {
      console.log('准备更新领导面数据', event.content)
      console.log('将要更新的场次ID为', event.needUpdateId)
      db.collection('secondinterview').where({
          _id: event.needUpdateId
        })
        .update({
          data: {
            address: event.content.address,
            city: event.content.city,
            date: event.content.date,
            place: event.content.place,
            liaisonOfficer: event.content.liaisonOfficer,
            location: {
              latitude: event.content.location.latitude,
              longitude: event.content.location.longitude,
              name: event.content.location.name
            }
          },
        })
    }
    if (event.sessionType === "终审考核") {
      console.log('准备更新终审考核数据', event.content)
      console.log('将要更新的场次ID为', event.needUpdateId)
      db.collection('finalinterview').where({
          _id: event.needUpdateId
        })
        .update({
          data: {
            address: event.content.address,
            city: event.content.city,
            date: event.content.date,
            place: event.content.place,
            liaisonOfficer: event.content.liaisonOfficer,
            location: {
              latitude: event.content.location.latitude,
              longitude: event.content.location.longitude,
              name: event.content.location.name
            }
          },
        })
    }
    if (event.sessionType === "上站初检") {
      console.log('准备更新上站初检数据', event.content)
      console.log('将要更新的场次ID为', event.needUpdateId)
      db.collection('firstphysicalcheck').where({
          _id: event.needUpdateId
        })
        .update({
          data: {
            address: event.content.address,
            city: event.content.city,
            date: event.content.date,
            place: event.content.place,
            liaisonOfficer: event.content.liaisonOfficer,
            location: {
              latitude: event.content.location.latitude,
              longitude: event.content.location.longitude,
              name: event.content.location.name
            }
          },
        })
    }
    if (event.sessionType === "上站复检") {
      console.log('准备更新上站复检数据', event.content)
      console.log('将要更新的场次ID为', event.needUpdateId)
      db.collection('secondphysicalcheck').where({
          _id: event.needUpdateId
        })
        .update({
          data: {
            address: event.content.address,
            city: event.content.city,
            date: event.content.date,
            place: event.content.place,
            liaisonOfficer: event.content.liaisonOfficer,
            location: {
              latitude: event.content.location.latitude,
              longitude: event.content.location.longitude,
              name: event.content.location.name
            }
          },
        })
    }
    if (event.sessionType === "航校面试") {
      console.log('准备更新航校面试数据', event.content)
      console.log('将要更新的场次ID为', event.needUpdateId)
      db.collection('pilotschool').where({
          _id: event.needUpdateId
        })
        .update({
          data: {
            address: event.content.address,
            city: event.content.city,
            date: event.content.date,
            place: event.content.place,
            liaisonOfficer: event.content.liaisonOfficer,
            type: event.content.type,
            location: {
              latitude: event.content.location.latitude,
              longitude: event.content.location.longitude,
              name: event.content.location.name
            },
            schoolname: event.content.schoolname,
            schooladdress: event.content.schooladdress
          },
        })
    }

  } else {

    //这一坨用于录入场次，event.currentAction为1，因只有1/2两种状态，直接用else。
    console.log('add', event)
    if (event.sessionType === "初面") {
      console.log('准备新增初面数据', event.content)
      db.collection('firstinterview').add({
          data: {
            address: event.content.address,
            applicants: 0,
            city: event.content.city,
            date: event.content.date,
            place: event.content.place,
            liaisonOfficer: event.content.liaisonOfficer,
            location: {
              latitude: event.content.location.latitude,
              longitude: event.content.location.longitude,
              name: event.content.location.name
            }
          }
        })
        .then(res => {
          console.log(res)
        })
    }
    if (event.sessionType === "领导面") {
      console.log('准备新增初面数据', event.content)
      db.collection('secondinterview').add({
          data: {
            address: event.content.address,
            applicants: 0,
            city: event.content.city,
            date: event.content.date,
            place: event.content.place,
            liaisonOfficer: event.content.liaisonOfficer,
            location: {
              latitude: event.content.location.latitude,
              longitude: event.content.location.longitude,
              name: event.content.location.name
            }
          }
        })
        .then(res => {
          console.log(res)
        })
    }
    if (event.sessionType === "终审考核") {
      console.log('准备新增初面数据', event.content)
      db.collection('finalinterview').add({
          data: {
            address: event.content.address,
            applicants: 0,
            city: event.content.city,
            date: event.content.date,
            place: event.content.place,
            liaisonOfficer: event.content.liaisonOfficer,
            location: {
              latitude: event.content.location.latitude,
              longitude: event.content.location.longitude,
              name: event.content.location.name
            }
          }
        })
        .then(res => {
          console.log(res)
        })
    }
    if (event.sessionType === "上站初检") {
      console.log('准备新增上站初检数据', event.content)
      db.collection('firstphysicalcheck').add({
          data: {
            address: event.content.address,
            applicants: 0,
            city: event.content.city,
            date: event.content.date,
            place: event.content.place,
            liaisonOfficer: event.content.liaisonOfficer,
            location: {
              latitude: event.content.location.latitude,
              longitude: event.content.location.longitude,
              name: event.content.location.name
            }
          }
        })
        .then(res => {
          console.log(res)
        })
    }
    if (event.sessionType === "上站复检") {
      console.log('准备新增上站复检数据', event.content)
      db.collection('secondphysicalcheck').add({
          data: {
            address: event.content.address,
            applicants: 0,
            city: event.content.city,
            date: event.content.date,
            place: event.content.place,
            liaisonOfficer: event.content.liaisonOfficer,
            location: {
              latitude: event.content.location.latitude,
              longitude: event.content.location.longitude,
              name: event.content.location.name
            }
          }
        })
        .then(res => {
          console.log(res)
        })
    }
    if (event.sessionType === "航校面试") {
      console.log('准备新增航校面试数据', event.content)
      db.collection('pilotschool').add({
          data: {
            address: event.content.address,
            city: event.content.city,
            date: event.content.date,
            place: event.content.place,
            applicants: 0,
            liaisonOfficer: event.content.liaisonOfficer,
            type: event.content.type,
            location: {
              latitude: event.content.location.latitude,
              longitude: event.content.location.longitude,
              name: event.content.location.name
            },
            schoolname: event.content.schoolname,
            schooladdress: event.content.schooladdress
          }
        })
        .then(res => {
          console.log(res)
        })
    }
  }
}

async function deleteSession(event, context) {
  const wxContext = cloud.getWXContext()
  if (event.sessionType === "初面") {
    var sessionApplicantsAmount = await db.collection('firstinterview').where({
      _id: event._id
    }).get();
    if (sessionApplicantsAmount.data[0].applicants !== 0) {
      return [0, `该场次目前仍有${sessionApplicantsAmount.data[0].applicants}名候选人仍未处理，无法操作下线。`]
    } else {
      try {
        return [1, await db.collection('firstinterview').where({
          _id: event._id
        }).remove()]
      } catch (e) {
        console.error(e)
      }
    }
  }
  if (event.sessionType === "领导面") {
    var sessionApplicantsAmount = await db.collection('secondinterview').where({
      _id: event._id
    }).get();
    if (sessionApplicantsAmount.data[0].applicants !== 0) {
      return [0, `该场次目前仍有${sessionApplicantsAmount.data[0].applicants}名候选人仍未处理，无法操作下线。`]
    } else {
      try {
        return [1, await db.collection('secondinterview').where({
          _id: event._id
        }).remove()]
      } catch (e) {
        console.error(e)
      }
    }
  }
  if (event.sessionType === "终审考核") {
    var sessionApplicantsAmount = await db.collection('finalinterview').where({
      _id: event._id
    }).get();
    if (sessionApplicantsAmount.data[0].applicants !== 0) {
      return [0, `该场次目前仍有${sessionApplicantsAmount.data[0].applicants}名候选人仍未处理，无法操作下线。`]
    } else {
      try {
        return [1, await db.collection('finalinterview').where({
          _id: event._id
        }).remove()]
      } catch (e) {
        console.error(e)
      }
    }
  }
  if (event.sessionType === "上站初检") {
    var sessionApplicantsAmount = await db.collection('firstphysicalcheck').where({
      _id: event._id
    }).get();
    if (sessionApplicantsAmount.data[0].applicants !== 0) {
      return [0, `该场次目前仍有${sessionApplicantsAmount.data[0].applicants}名候选人仍未处理，无法操作下线。`]
    } else {
      try {
        return [1, await db.collection('firstphysicalcheck').where({
          _id: event._id
        }).remove()]
      } catch (e) {
        console.error(e)
      }
    }
  }
  if (event.sessionType === "上站复检") {
    var sessionApplicantsAmount = await db.collection('secondphysicalcheck').where({
      _id: event._id
    }).get();
    if (sessionApplicantsAmount.data[0].applicants !== 0) {
      return [0, `该场次目前仍有${sessionApplicantsAmount.data[0].applicants}名候选人仍未处理，无法操作下线。`]
    } else {
      try {
        return [1, await db.collection('secondphysicalcheck').where({
          _id: event._id
        }).remove()]
      } catch (e) {
        console.error(e)
      }
    }
  }
  if (event.sessionType === "航校面试") {
    var sessionApplicantsAmount = await db.collection('pilotschool').where({
      _id: event._id
    }).get();
    if (sessionApplicantsAmount.data[0].applicants !== 0) {
      return [0, `该场次目前仍有${sessionApplicantsAmount.data[0].applicants}名候选人仍未处理，无法操作下线。`]
    } else {
      try {
        return [1, await db.collection('pilotschool').where({
          _id: event._id
        }).remove()]
      } catch (e) {
        console.error(e)
      }
    }
  }

}

async function getStudentList(event, context) {
  console.log(event.needtype)
  let needtype = event.needtype
  let waitingReturnData = {
    //这里面搜集每一类学生的openid，后续根据openid获取学生CV并返回
    firstinterview: [],
    secondinterview: [],
    finalinterview: [],
    firstphysicalcheck: [],
    secondphysicalcheck: [],
    pilotschool: [],
    offer: [],
    failed: []
  }
  let waitingReturnSessionData = {
    firstinterview: [],
    secondinterview: [],
    finalinterview: [],
    firstphysicalcheck: [],
    secondphysicalcheck: [],
    pilotschool: [],
    offer: [],
    failed: []
  }
  let offerAmount = 0
  let failedAmount = 0
  let processAmount = 0
  let studentList = await db.collection('status').get();
  console.log(studentList.data)
  studentList.data.forEach((item, index) => {
    processAmount++
    //循环所有的status，为每个学生分配到不同的状态，将openid装入waitingReturnData
    if (item.firstintervIewPass === "failed" || item.firstPhysicalCheckPass === "failed" || item.secondintervIewPass === "failed" || item.secondPhysicalCheckPass === "failed" || item.finalIntervIewPass === "failed" || item.pilotSchoolPass === "failed") {
      waitingReturnData.failed.push(item.openid)
      failedAmount++

    } else if (item.offer === "pass") {
      waitingReturnData.offer.push(item.openid) //已确认offer学生
      offerAmount++

    } else if (item.pilotSchoolId != 0 && item.pilotSchoolPass === 'waiting') {
      waitingReturnData.pilotschool.push(item.openid) //状态：待航校面试结论
      waitingReturnSessionData.pilotschool.push(item.pilotSchoolId)

    } else if (item.finalInterviewOrderId != 0 && item.finalIntervIewPass === 'waiting') {
      waitingReturnData.finalinterview.push(item.openid) //状态：待终审考核结论
      waitingReturnSessionData.finalinterview.push(item.finalInterviewOrderId)

    } else if (item.secondPhysicalCheckId != 0 && item.secondPhysicalCheckPass === 'waiting') {
      waitingReturnData.secondphysicalcheck.push(item.openid) //状态：待上站复检结论
      waitingReturnSessionData.secondphysicalcheck.push(item.secondPhysicalCheckId)

    } else if (item.secondInterviewOrderId != 0 && item.secondintervIewPass === 'waiting') {
      waitingReturnData.secondinterview.push(item.openid) //状态：待领导面结论
      waitingReturnSessionData.secondinterview.push(item.secondInterviewOrderId)

    } else if (item.firstPhysicalCheckId != 0 && item.firstPhysicalCheckPass === 'waiting') {
      waitingReturnData.firstphysicalcheck.push(item.openid) //状态：待上站初检结论
      waitingReturnSessionData.firstphysicalcheck.push(item.firstPhysicalCheckId)

    } else if (item.firstInterviewOrderId != 0 && item.firstintervIewPass === 'waiting') {
      waitingReturnData.firstinterview.push(item.openid) //状态：待初面结论
      waitingReturnSessionData.firstinterview.push(item.firstInterviewOrderId)
    }
  })
  console.log(waitingReturnData)
  if (needtype === 'interview') {
    //返回等待面试结论学生信息
    let returnfirstinterviewOpenid = []
    let returnsecondinterviewOpenid = []
    let returnfinalinterviewOpenid = []
    let returnfirstinterviewInfo = []
    let returnsecondinterviewInfo = []
    let returnfinalinterviewInfo = []
    let returnfirstinterviewIdentificationPhoto = []
    let returnsecondinterviewIdentificationPhoto = []
    let returnfinalinterviewIdentificationPhoto = []
    let amountInsidePromise = 0
    let returnfinalinterview = []
    let returnfirstinterview = []
    let returnsecondinterview = []
    let returnfinalinterviewSession = []
    let returnfirstinterviewSession = []
    let returnsecondinterviewSession = []

    return new Promise(async(resolve, reject) => {
        if (waitingReturnData.firstinterview.length === 0) {
          amountInsidePromise++
          console.log(amountInsidePromise)
          if (amountInsidePromise === 3) {
            resolve()
            amountInsidePromise++
          }
        } else {
          //留底一份foreach循环的代码
          // waitingReturnData.firstinterview.forEach(async(item, index) => {
          //   console.log(item, index, waitingReturnData.firstinterview.length - 1)
          //   let cvdata = await db.collection('cv').where({
          //     openid: item,
          //   }).get();

          //   let sessiondata = await db.collection('firstinterview').where({
          //     _id: waitingReturnSessionData.firstinterview[index]
          //   }).get();
          //   await sessiondata.data.forEach((item, index) => {
          //     //呈现出最终格式的时间
          //     const date = new Date(item.date);
          //     item.timeInfo = {
          //       year: date.getFullYear(),
          //       month: date.getMonth() + 1,
          //       date: date.getDate(),
          //       hours: date.getHours(),
          //       minutes: fixZero(date.getMinutes())
          //     };
          //     item.dateFormat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
          //     item.timeFormat = `${date.getHours()}:${fixZero(date.getMinutes())}:${fixZero(date.getSeconds())}`
          //   })
          //   console.log('初面待装入数据', cvdata.data[0], sessiondata.data[0])
          //   returnfirstinterviewOpenid.push(cvdata.data[0].openid)
          //   returnfirstinterviewInfo.push(cvdata.data[0].cv_document)
          //   returnfirstinterviewIdentificationPhoto.push(cvdata.data[0].cv_identificationPhoto)
          //   returnfirstinterviewSession.push(sessiondata.data[0])
          //   if (index === waitingReturnData.firstinterview.length - 1) {
          //     amountInsidePromise++
          //     console.log(amountInsidePromise)
          //     if (amountInsidePromise === 3) {
          //       resolve()
          //     }
          //   }
          // })
          for (let index = 0; index < waitingReturnData.firstinterview.length; index++) {
            console.log(waitingReturnData.firstinterview[index], index, waitingReturnData.firstinterview.length)
            let cvdata = await db.collection('cv').where({
              openid: waitingReturnData.firstinterview[index],
            }).get();
            let sessiondata = await db.collection('firstinterview').where({
              _id: waitingReturnSessionData.firstinterview[index]
            }).get();
            sessiondata.data.forEach((item, index) => {
              //呈现出最终格式的时间
              const date = new Date(item.date);
              item.timeInfo = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                date: date.getDate(),
                hours: date.getHours(),
                minutes: fixZero(date.getMinutes())
              };
              item.dateFormat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
              item.timeFormat = `${date.getHours()}:${fixZero(date.getMinutes())}:${fixZero(date.getSeconds())}`
            })
            console.log('初面待装入数据', cvdata.data[0], sessiondata.data[0])
            returnfirstinterviewOpenid.push(cvdata.data[0].openid)
            returnfirstinterviewInfo.push(cvdata.data[0].cv_document)
            returnfirstinterviewIdentificationPhoto.push(cvdata.data[0].cv_identificationPhoto)
            returnfirstinterviewSession.push(sessiondata.data[0])
            if (index === waitingReturnData.firstinterview.length - 1) {
              amountInsidePromise++
              console.log(amountInsidePromise)
              if (amountInsidePromise === 3) {
                resolve()
              }
            }
          }
        }


        if (waitingReturnData.secondinterview.length === 0) {
          amountInsidePromise++
          console.log(amountInsidePromise)
          if (amountInsidePromise === 3) {
            resolve()
            amountInsidePromise++
          }
        } else {
          for (let index = 0; index < waitingReturnData.secondinterview.length; index++) {
            console.log(waitingReturnData.secondinterview[index], index, waitingReturnData.secondinterview.length)
            let cvdata = await db.collection('cv').where({
              openid: waitingReturnData.secondinterview[index],
            }).get();
            let sessiondata = await db.collection('secondinterview').where({
              _id: waitingReturnSessionData.secondinterview[index]
            }).get();
            sessiondata.data.forEach((item, index) => {
              //呈现出最终格式的时间
              const date = new Date(item.date);
              item.timeInfo = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                date: date.getDate(),
                hours: date.getHours(),
                minutes: fixZero(date.getMinutes())
              };
              item.dateFormat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
              item.timeFormat = `${date.getHours()}:${fixZero(date.getMinutes())}:${fixZero(date.getSeconds())}`
            })
            console.log('领导面考核待装入数据', cvdata.data[0], sessiondata.data[0])
            returnsecondinterviewOpenid.push(cvdata.data[0].openid)
            returnsecondinterviewInfo.push(cvdata.data[0].cv_document)
            returnsecondinterviewIdentificationPhoto.push(cvdata.data[0].cv_identificationPhoto)
            returnsecondinterviewSession.push(sessiondata.data[0])
            if (index === waitingReturnData.secondinterview.length - 1) {
              amountInsidePromise++
              console.log(amountInsidePromise)
              if (amountInsidePromise === 3) {
                resolve()
              }
            }
          }
        }

        if (waitingReturnData.finalinterview.length === 0) {
          amountInsidePromise++
          console.log(amountInsidePromise)
          if (amountInsidePromise === 3) {
            resolve()
            amountInsidePromise++
          }
        } else {
          //踩过的坑：FOReach循环内部是异步不按顺序执行，很可能导致resolve时前序还未完成，所以全部换成原生for循环
          for (let index = 0; index < waitingReturnData.finalinterview.length;index++){
            console.log(waitingReturnData.finalinterview[index], index, waitingReturnData.finalinterview.length)
            let cvdata = await db.collection('cv').where({
              openid: waitingReturnData.finalinterview[index],
            }).get();
            let sessiondata = await db.collection('finalinterview').where({
              _id: waitingReturnSessionData.finalinterview[index]
            }).get();
            sessiondata.data.forEach((item, index) => {
              //呈现出最终格式的时间
              const date = new Date(item.date);
              item.timeInfo = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                date: date.getDate(),
                hours: date.getHours(),
                minutes: fixZero(date.getMinutes())
              };
              item.dateFormat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
              item.timeFormat = `${date.getHours()}:${fixZero(date.getMinutes())}:${fixZero(date.getSeconds())}`
            })
            console.log('终审考核待装入数据', cvdata.data[0], sessiondata.data[0])
            returnfinalinterviewOpenid.push(cvdata.data[0].openid)
            returnfinalinterviewInfo.push(cvdata.data[0].cv_document)
            returnfinalinterviewIdentificationPhoto.push(cvdata.data[0].cv_identificationPhoto)
            returnfinalinterviewSession.push(sessiondata.data[0])
            if (index === waitingReturnData.finalinterview.length - 1) {
              amountInsidePromise++
              console.log(amountInsidePromise)
              if (amountInsidePromise === 3) {
                resolve()
              }
            }
          }
       
        }
      }).then(() => {
        console.log('resolve666', returnfirstinterviewOpenid)
        for (let i = 0; i < returnfirstinterviewOpenid.length; i++) {
          let returndata = {
            openid: returnfirstinterviewOpenid[i],
            info: returnfirstinterviewInfo[i],
            identicationPhoto: returnfirstinterviewIdentificationPhoto[i],
            session: returnfirstinterviewSession[i]
          }
          returnfirstinterview.push(returndata)

        }
        console.log('可以返回的初面名单', returnfirstinterview)

        for (let i = 0; i < returnsecondinterviewOpenid.length; i++) {
          let returndata = {
            openid: returnsecondinterviewOpenid[i],
            info: returnsecondinterviewInfo[i],
            identicationPhoto: returnsecondinterviewIdentificationPhoto[i],
            session: returnsecondinterviewSession[i]
          }
          returnsecondinterview.push(returndata)

        }
        console.log('可以返回的领导面名单', returnsecondinterview)

        for (let i = 0; i < returnfinalinterviewOpenid.length; i++) {
          let returndata = {
            openid: returnfinalinterviewOpenid[i],
            info: returnfinalinterviewInfo[i],
            identicationPhoto: returnfinalinterviewIdentificationPhoto[i],
            session: returnfinalinterviewSession[i]
          }
          returnfinalinterview.push(returndata)
        }
        console.log('可以返回的终审考核名单', returnfinalinterview)
        console.log(['最终返回面试数据resolve', returnfirstinterview, returnsecondinterview, returnfinalinterview])
        processAmount = processAmount - offerAmount - failedAmount
        return [returnfirstinterview, returnsecondinterview, returnfinalinterview, processAmount, offerAmount, failedAmount]
      })
      .catch(() => {
        console.log('reject')
        console.log(['最终返回面试数据reject', returnfirstinterview, returnsecondinterview, returnfinalinterview])
        processAmount = processAmount - offerAmount - failedAmount
        return [returnfirstinterview, returnsecondinterview, returnfinalinterview, processAmount, offerAmount, failedAmount]
      })
  }
  if (needtype === 'pilotschool') {
    //返回等待航校面试结论学生信息，调试可用
    let returnpilotschoolOpenid = []
    let returnpilotschoolInfo = []
    let returnpilotschoolIdentificationPhoto = []
    let returnpilotschoolSession = []
    let returnpilotschool = []

    return new Promise(async(resolve, reject) => {
      if (waitingReturnData.pilotschool.length === 0) {
        return reject()
      }
      for (let index = 0; index < waitingReturnData.pilotschool.length; index++) {
        console.log(waitingReturnData.finalinterview[index], index, waitingReturnData.pilotschool.length - 1)
        let cvdata = await db.collection('cv').where({
          openid: waitingReturnData.pilotschool[index],
        }).get();
        let sessiondata = await db.collection('pilotschool').where({
          _id: waitingReturnSessionData.pilotschool[index]
        }).get();
        await sessiondata.data.forEach((item, index) => {
          //呈现出最终格式的时间
          const date = new Date(item.date);
          item.timeInfo = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            date: date.getDate(),
            hours: date.getHours(),
            minutes: fixZero(date.getMinutes())
          };
          item.dateFormat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
          item.timeFormat = `${date.getHours()}:${fixZero(date.getMinutes())}:${fixZero(date.getSeconds())}`
        })
        console.log('航校面试待装入数据', cvdata.data[0], sessiondata.data[0])
        returnpilotschoolOpenid.push(cvdata.data[0].openid)
        returnpilotschoolInfo.push(cvdata.data[0].cv_document)
        returnpilotschoolIdentificationPhoto.push(cvdata.data[0].cv_identificationPhoto)
        returnpilotschoolSession.push(sessiondata.data[0])
        if (index === waitingReturnData.pilotschool.length - 1) {
          return resolve()
        }

      }
      //保留一份foreach代码留底
      // waitingReturnData.pilotschool.forEach(async(item, index) => {
      //   console.log(item, index, waitingReturnData.pilotschool.length - 1)
      //   let cvdata = await db.collection('cv').where({
      //     openid: item,
      //   }).get();
      //   let sessiondata = await db.collection('pilotschool').where({
      //     _id: waitingReturnSessionData.pilotschool[index]
      //   }).get();
      //   await sessiondata.data.forEach((item, index) => {
      //     //呈现出最终格式的时间
      //     const date = new Date(item.date);
      //     item.timeInfo = {
      //       year: date.getFullYear(),
      //       month: date.getMonth() + 1,
      //       date: date.getDate(),
      //       hours: date.getHours(),
      //       minutes: fixZero(date.getMinutes())
      //     };
      //     item.dateFormat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      //     item.timeFormat = `${date.getHours()}:${fixZero(date.getMinutes())}:${fixZero(date.getSeconds())}`
      //   })
      //   console.log('航校面试待装入数据', cvdata.data[0], sessiondata.data[0])
      //   returnpilotschoolOpenid.push(cvdata.data[0].openid)
      //   returnpilotschoolInfo.push(cvdata.data[0].cv_document)
      //   returnpilotschoolIdentificationPhoto.push(cvdata.data[0].cv_identificationPhoto)
      //   returnpilotschoolSession.push(sessiondata.data[0])
      //   if (index === waitingReturnData.pilotschool.length - 1) {
      //     return resolve()
      //   }
      // })
    }).then(() => {
      for (let i = 0; i < returnpilotschoolOpenid.length; i++) {
        let returndata = {
          openid: returnpilotschoolOpenid[i],
          info: returnpilotschoolInfo[i],
          identicationPhoto: returnpilotschoolIdentificationPhoto[i],
          session: returnpilotschoolSession[i]
        }
        returnpilotschool.push(returndata)
      }
      console.log('可以返回的航校面试名单', returnpilotschool)
      processAmount = processAmount - offerAmount - failedAmount
      return [returnpilotschool, processAmount, offerAmount, failedAmount]
    }).catch(() => {
      processAmount = processAmount - offerAmount - failedAmount
      return [returnpilotschool, processAmount, offerAmount, failedAmount]
    })
  }

  if (needtype === 'physicalcheck') {
    //返回等待体检结论学生信息
    let returnfirstphysicalcheckOpenid = []
    let returnsecondphysicalcheckOpenid = []
    let returnfirstphysicalcheckInfo = []
    let returnsecondphysicalcheckInfo = []
    let returnfirstphysicalcheckIdentificationPhoto = []
    let returnsecondphysicalcheckIdentificationPhoto = []
    let amountInsidePromise = 0
    let returnsecondphysicalcheck = []
    let returnfirstphysicalcheck = []
    let returnfirstphysicalcheckSession = []
    let returnsecondphysicalcheckSession = []

    return new Promise(async(resolve, reject) => {
        if (waitingReturnData.firstphysicalcheck.length === 0) {
          amountInsidePromise++
          console.log(amountInsidePromise)
          if (amountInsidePromise === 2) {
            resolve()
            amountInsidePromise++
          }
        } else {
          //留底一份可用的foreach代码
          // waitingReturnData.firstphysicalcheck.forEach(async(item, index) => {
          //   console.log(item, index, waitingReturnData.firstphysicalcheck.length - 1)
          //   let cvdata = await db.collection('cv').where({
          //     openid: item,
          //   }).get();
          //   let sessiondata = await db.collection('firstphysicalcheck').where({
          //     _id: waitingReturnSessionData.firstphysicalcheck[index]
          //   }).get();
          //   console.log('sessiondatatest', sessiondata, waitingReturnSessionData.firstphysicalcheck[index])
          //   await sessiondata.data.forEach((item, index) => {
          //     //呈现出最终格式的时间
          //     const date = new Date(item.date);
          //     item.timeInfo = {
          //       year: date.getFullYear(),
          //       month: date.getMonth() + 1,
          //       date: date.getDate(),
          //       hours: date.getHours(),
          //       minutes: fixZero(date.getMinutes())
          //     };
          //     item.dateFormat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
          //     item.timeFormat = `${date.getHours()}:${fixZero(date.getMinutes())}:${fixZero(date.getSeconds())}`
          //   })
          //   console.log('上站初检待装入数据', cvdata.data[0], sessiondata.data[0])
          //   returnfirstphysicalcheckOpenid.push(cvdata.data[0].openid)
          //   returnfirstphysicalcheckInfo.push(cvdata.data[0].cv_document)
          //   returnfirstphysicalcheckIdentificationPhoto.push(cvdata.data[0].cv_identificationPhoto)
          //   returnfirstphysicalcheckSession.push(sessiondata.data[0])
          //   if (index === waitingReturnData.firstphysicalcheck.length - 1) {
          //     amountInsidePromise++
          //     console.log(amountInsidePromise)
          //     if (amountInsidePromise === 2) {
          //       resolve()
          //       amountInsidePromise++
          //     }
          //   }
          // })
          for (let index = 0; index < waitingReturnData.firstphysicalcheck.length; index++) {
            console.log(waitingReturnData.firstphysicalcheck[index], index, waitingReturnData.firstphysicalcheck.length)
            let cvdata = await db.collection('cv').where({
              openid: waitingReturnData.firstphysicalcheck[index],
            }).get();
            let sessiondata = await db.collection('firstphysicalcheck').where({
              _id: waitingReturnSessionData.firstphysicalcheck[index]
            }).get();
            sessiondata.data.forEach((item, index) => {
              //呈现出最终格式的时间
              const date = new Date(item.date);
              item.timeInfo = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                date: date.getDate(),
                hours: date.getHours(),
                minutes: fixZero(date.getMinutes())
              };
              item.dateFormat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
              item.timeFormat = `${date.getHours()}:${fixZero(date.getMinutes())}:${fixZero(date.getSeconds())}`
            })
            console.log('上站初检待装入数据', cvdata.data[0], sessiondata.data[0])
            returnfirstphysicalcheckOpenid.push(cvdata.data[0].openid)
            returnfirstphysicalcheckInfo.push(cvdata.data[0].cv_document)
            returnfirstphysicalcheckIdentificationPhoto.push(cvdata.data[0].cv_identificationPhoto)
            returnfirstphysicalcheckSession.push(sessiondata.data[0])
            if (index === waitingReturnData.firstphysicalcheck.length - 1) {
              amountInsidePromise++
              console.log(amountInsidePromise)
              if (amountInsidePromise === 2) {
                resolve()
              }
            }
          }
        }


        if (waitingReturnData.secondphysicalcheck.length === 0) {
          amountInsidePromise++
          console.log(amountInsidePromise)
          if (amountInsidePromise === 2) {
            resolve()
          }
        } else {
          for (let index = 0; index < waitingReturnData.secondphysicalcheck.length; index++) {
            console.log(waitingReturnData.secondphysicalcheck[index], index, waitingReturnData.secondphysicalcheck.length)
            let cvdata = await db.collection('cv').where({
              openid: waitingReturnData.secondphysicalcheck[index],
            }).get();
            let sessiondata = await db.collection('secondphysicalcheck').where({
              _id: waitingReturnSessionData.secondphysicalcheck[index]
            }).get();
            sessiondata.data.forEach((item, index) => {
              //呈现出最终格式的时间
              const date = new Date(item.date);
              item.timeInfo = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                date: date.getDate(),
                hours: date.getHours(),
                minutes: fixZero(date.getMinutes())
              };
              item.dateFormat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
              item.timeFormat = `${date.getHours()}:${fixZero(date.getMinutes())}:${fixZero(date.getSeconds())}`
            })
            console.log('上站复检待装入数据', cvdata.data[0], sessiondata.data[0])
            returnsecondphysicalcheckOpenid.push(cvdata.data[0].openid)
            returnsecondphysicalcheckInfo.push(cvdata.data[0].cv_document)
            returnsecondphysicalcheckIdentificationPhoto.push(cvdata.data[0].cv_identificationPhoto)
            returnsecondphysicalcheckSession.push(sessiondata.data[0])
            if (index === waitingReturnData.secondphysicalcheck.length - 1) {
              amountInsidePromise++
              console.log(amountInsidePromise)
              if (amountInsidePromise === 2) {
                resolve()
              }
            }
          }
        }
      }).then(() => {
        console.log('resolve666', returnfirstphysicalcheckOpenid)
        for (let i = 0; i < returnfirstphysicalcheckOpenid.length; i++) {
          let returndata = {
            openid: returnfirstphysicalcheckOpenid[i],
            info: returnfirstphysicalcheckInfo[i],
            identicationPhoto: returnfirstphysicalcheckIdentificationPhoto[i],
            session: returnfirstphysicalcheckSession[i]
          }
          returnfirstphysicalcheck.push(returndata)

        }
        console.log('可以返回的上站初检名单', returnfirstphysicalcheck)

        for (let i = 0; i < returnsecondphysicalcheckOpenid.length; i++) {
          let returndata = {
            openid: returnsecondphysicalcheckOpenid[i],
            info: returnsecondphysicalcheckInfo[i],
            identicationPhoto: returnsecondphysicalcheckIdentificationPhoto[i],
            session: returnsecondphysicalcheckSession[i]
          }
          returnsecondphysicalcheck.push(returndata)
        }
        console.log('可以返回的上站复检名单', returnsecondphysicalcheck)
        console.log(['最终返回上站体检数据resolve', returnfirstphysicalcheck, returnsecondphysicalcheck])
        processAmount = processAmount - offerAmount - failedAmount
        return [returnfirstphysicalcheck, returnsecondphysicalcheck, processAmount, offerAmount, failedAmount]
      })
      .catch(() => {
        console.log('reject')
        console.log(['最终返回上站体检数据reject', returnfirstphysicalcheck, returnsecondphysicalcheck])
        processAmount = processAmount - offerAmount - failedAmount
        return [returnfirstphysicalcheck, returnsecondphysicalcheck, processAmount, offerAmount, failedAmount]
      })
  }

  if (needtype === 'offer') {
    //返回等待航校面试结论学生信息，调试可用
    let returnofferOpenid = []
    let returnofferInfo = []
    let returnofferIdentificationPhoto = []
    let returnoffer = []


    return new Promise(async(resolve, reject) => {
      if (waitingReturnData.offer.length === 0) {
        return reject()
      }
      for (let index = 0; index < waitingReturnData.offer.length; index++) {
        console.log(waitingReturnData.offer[index], index, waitingReturnData.offer.length - 1)
        let cvdata = await db.collection('cv').where({
          openid: waitingReturnData.offer[index],
        }).get();
        console.log('已确认OFFER待装入数据', cvdata.data[0])
        returnofferOpenid.push(cvdata.data[0].openid)
        returnofferInfo.push(cvdata.data[0].cv_document)
        returnofferIdentificationPhoto.push(cvdata.data[0].cv_identificationPhoto)
        if (index === waitingReturnData.offer.length - 1) {
          return resolve()
        }

      }
    }).then(() => {
      for (let i = 0; i < returnofferOpenid.length; i++) {
        let returndata = {
          openid: returnofferOpenid[i],
          info: returnofferInfo[i],
          identicationPhoto: returnofferIdentificationPhoto[i]
        }
        returnoffer.push(returndata)
      }
      console.log('可以返回的已确认offer名单', returnoffer)
      processAmount = processAmount - offerAmount - failedAmount
      return [returnoffer, processAmount, offerAmount, failedAmount]
    }).catch(() => {
      processAmount = processAmount - offerAmount - failedAmount
      return [returnoffer, processAmount, offerAmount, failedAmount]
    })
  }

  if (needtype === 'failed') {
    //返回等待航校面试结论学生信息，调试可用
    let returnfailedOpenid = []
    let returnfailedInfo = []
    let returnfailedIdentificationPhoto = []
    let returnfailed = []

    return new Promise(async(resolve, reject) => {
      if (waitingReturnData.failed.length === 0) {
        return reject()
      }
      for (let index = 0; index < waitingReturnData.failed.length; index++) {
        console.log(waitingReturnData.failed[index], index, waitingReturnData.failed.length - 1)
        let cvdata = await db.collection('cv').where({
          openid: waitingReturnData.failed[index],
        }).get();
        console.log('已确认failed待装入数据', cvdata.data[0])
        returnfailedOpenid.push(cvdata.data[0].openid)
        returnfailedInfo.push(cvdata.data[0].cv_document)
        returnfailedIdentificationPhoto.push(cvdata.data[0].cv_identificationPhoto)
        if (index === waitingReturnData.failed.length - 1) {
          return resolve()
        }
      }
    }).then(() => {
      for (let i = 0; i < returnfailedOpenid.length; i++) {
        let returndata = {
          openid: returnfailedOpenid[i],
          info: returnfailedInfo[i],
          identicationPhoto: returnfailedIdentificationPhoto[i]
        }
        returnfailed.push(returndata)
      }
      console.log('可以返回的被刷掉名单', returnfailed)
      processAmount = processAmount - offerAmount - failedAmount
      return [returnfailed, processAmount, offerAmount, failedAmount]
    }).catch(() => {
      processAmount = processAmount - offerAmount - failedAmount
      return [returnfailed, processAmount, offerAmount, failedAmount]
    })
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
    if (Object.keys(currentApllicantStatus.data[0].backgroundInvestigation).length !== 0) {
      //利用ES6新特性Object.keys判断对象是否为空
      statusCode = 10;
    }
    if (currentApllicantStatus.data[0].ielts === "pass" || currentApllicantStatus.data[0].ielts === "jump") {
      if (Object.keys(currentApllicantStatus.data[0].backgroundInvestigation).length !== 0) {
        //利用ES6新特性Object.keys判断对象是否为空
        statusCode = 11;
      }
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
    if (currentApllicantStatus.data[0].firstintervIewPass === "failed" || currentApllicantStatus.data[0].firstPhysicalCheckPass === "failed" || currentApllicantStatus.data[0].secondintervIewPass === "failed" || currentApllicantStatus.data[0].secondPhysicalCheckPass === "failed" || currentApllicantStatus.data[0].finalIntervIewPass === "failed" || currentApllicantStatus.data[0].pilotSchoolPass === "failed") {
      statusCode = 555;
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
  if (event.type === 'writeIELTS') {
    return writeIELTS(event, context)
  }
  if (event.type === 'jumpIELTS') {
    return jumpIELTS(event, context)
  }
  if (event.type === 'getPilot') {
    return getPilot(event, context)
  }
  if (event.type === "confirmOffer") {
    return confirmOffer(event, context)
  }
  if (event.type === "writeAddress") {
    return writeAddress(event, context)
  }
  if (event.type === "getStatus") {
    return getStatus(event, context)
  }
  if (event.type === "getStaffInfo") {
    return getStaffInfo(event, context)
  }
  if (event.type === "getProcessAmount") {
    return getProcessAmount(event, context)
  }
  if (event.type === "getAllInterview") {
    return getAllInterview(event, context)
  }
  if (event.type === "addSession") {
    return addSession(event, context)
  }
  if (event.type === "getOriginalSessionData") {
    return getOriginalSessionData(event, context)
  }
  if (event.type === "deleteSession") {
    return deleteSession(event, context)
  }
  if (event.type === "getAllPhysicalCheck") {
    return getAllPhysicalCheck(event, context)
  }
  if (event.type === "getAllPilotSchool") {
    return getAllPilotSchool(event, context)
  }
  if (event.type === "getStudentList") {
    return getStudentList(event, context)
  }
  if (event.type === "passProcess") {
    return passProcess(event, context)
  }
  if (event.type === "failedProcess") {
    return failedProcess(event, context)
  }

}