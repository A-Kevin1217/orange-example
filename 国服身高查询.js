import plugin from '../../lib/plugins/plugin.js';
import fetch from "node-fetch";
import fs from 'fs'

/** 文件夹及文件 */
let Data_folder = "plugins/example/国服身高查询"
let Usage_data = '身高查询使用次数.json'
let Authorization_data = '授权.json'
let User_data = 'Sky UID.json'

/** 判断文件是否存在，不存在则自动创建 */
if (!fs.existsSync(Data_folder)){fs.mkdirSync(Data_folder)}
if (!fs.existsSync(Data_folder + "/" + User_data)) {fs.writeFileSync(Data_folder + "/" + User_data, JSON.stringify({}))}
if (!fs.existsSync(Data_folder + "/" + Usage_data)) {fs.writeFileSync(Data_folder + "/" + Usage_data, JSON.stringify({}))}
if (!fs.existsSync(Data_folder + "/" + Authorization_data)) {fs.writeFileSync(Data_folder + "/" + Authorization_data, JSON.stringify({}))}

/** 应天API密钥 */
const 密钥 = 'WUDzjdSTUuNqaSGdnlN5OMOcPr'
/** https://api.vqqc.cn/ */
/** 在上方链接注册账号 */

export class 光遇_国服身高查询 extends plugin {
  constructor() {
    super({
      name: '光遇_国服身高查询',
      dsc: '光遇',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: /^#授权(.*)$/,
          fnc: 'accredit'
        },
        {
          reg: /^#(国服)?绑定(.*)$/,
          fnc: 'bind'
        },
        {
          reg: /^#(国服)?(身高查询|查询身高)$/,
          fnc: '身高查询文字'
        }
      ]
    });
  }

  async bind(e) {
    /** 提取用户消息 */
    const message = e.msg;

    /** 提取信息内的光遇ID */
    const Sky_Uid = message.replace(/#|国服绑定/g, "").trim();
    const data = { Sky_Uid }
    const 用户QQ = e.user_id
    const json = JSON.parse(fs.readFileSync(Data_folder + "/" + User_data, "utf8"));
    json[用户QQ] = data;
    fs.writeFileSync(Data_folder + "/" + User_data, JSON.stringify(json, null, "\t"));
    const msg = json.hasOwnProperty(用户QQ) ? "绑定成功！指令：#国服身高查询" : "绑定成功！指令：#国服身高查询";
    await this.reply(msg);
  }
  
  async accredit(e) {
    /** 判断是否是主人 */
    if (!await checkAuth(e)) return

    const ID = (e.at ? e.at : e.user_id)
    const 给予授权 = 1
    const data = { "授权状态": 给予授权 }

    const json = JSON.parse(fs.readFileSync(Data_folder + "/" + Authorization_data, "utf8"));json[ID] = data
    fs.writeFileSync(Data_folder + "/" + Authorization_data, JSON.stringify(json, null, "\t"));

    e.reply('授权成功')
  }
  

  async 身高查询文字(e) {
    const 用户QQ = e.user_id
    let 授权JSON = JSON.parse(fs.readFileSync(Data_folder + "/" + Authorization_data, "utf8"));

    /** 未找到用户授权信息，自动写入信息 */
    if (!授权JSON.hasOwnProperty(用户QQ)) {
      let 授权状态 = 0
      let data = {"授权状态": 授权状态}
      let json = JSON.parse(fs.readFileSync(Data_folder + "/" + Authorization_data, "utf8"));
      json[用户QQ] = data
      fs.writeFileSync(Data_folder + "/" + Authorization_data, JSON.stringify(json, null, "\t"));
    }

    /** 读取授权状态 */
    let 授权 = 授权JSON[用户QQ]["授权状态"]

    /** 授权为1，有授权 */
    logger.mark('授权状态：' + 授权)
    if (授权 === 1) {
      const 用户昵称 = e.sender.nickname;logger.mark("用户昵称：" + 用户昵称)
      const 用户群昵称 = e.sender.card;logger.mark("用户群昵称：" + 用户群昵称)
      const 使用群昵称 = e.group_name;logger.mark("使用群昵称：" + 使用群昵称)
    
      const 使用次数文件路径 = Data_folder + "/" + Usage_data;
      const userCounts = JSON.parse(fs.readFileSync(使用次数文件路径, "utf8"));

      const currentDate = getCurrentDate()
      logger.mark("今日日期：" + currentDate)
      const { 
        限制次数: userCount限制 = 0,
        总使用次数: userCount = 0,
        用户信息: userInfo = {},
        日期: userDate = ""
      } = userCounts[用户QQ] || {};
      
      /** 没有用户存档，自动写入基础存档 */
      if (!userCounts.hasOwnProperty(用户QQ)) {
        const newCount限制 = userCount限制 || 0; 
        const newCount = userCount || 0;
        userCounts[用户QQ] = {
          限制次数: newCount限制, 总使用次数: newCount, 用户信息:
          {
            ...userInfo,
            "用户QQ": 用户QQ,
            "用户昵称": 用户昵称,
            "用户群昵称": 用户群昵称,
            "使用群昵称": 使用群昵称,
          },
          日期: currentDate
        };
        fs.writeFileSync(使用次数文件路径, JSON.stringify(userCounts, null, "\t"));
      }

      /** 判断用户是否达到每日限制次数 */
      if (userDate && userDate === currentDate && userCount限制 >= 10) {
        await e.reply('您已达到使用次数限制');
      } else {
        const json = JSON.parse(fs.readFileSync(Data_folder + "/" + User_data, "utf8"));
        
        /** 判断是否绑定ID */
        if (json.hasOwnProperty(用户QQ)) {
          const 文字 = 'id已收录，正在查询...'
          const 消息 = [
            文字 ? 文字 : ""
          ];
          await e.reply(消息, false, { recallMsg: 20 }, true);
          const Sky_Uid = json[用户QQ].Sky_Uid;
          const response = await fetch(`https://api.t1qq.com/api/sky/sc/sg?key=${密钥}&cx=${Sky_Uid}`);
          const data = await response.json();

          /** 接口code返回200，查询成功 */
          if (data.code === 200) {
            logger.mark("查询状态：true")
            const newCount限制 = userCount限制 + 1; const newCount = userCount + 1; userCounts[用户QQ] = {
              限制次数: newCount限制, 总使用次数: newCount, 用户信息:
              {
                ...userInfo,
                "用户QQ": 用户QQ,
                "用户昵称": 用户昵称,
                "用户群昵称": 用户群昵称,
                "使用群昵称": 使用群昵称,
              },
              日期: currentDate
            };
            const 打开使用次数文件 = JSON.parse(fs.readFileSync(使用次数文件路径, "utf8"));
            const 使用次数 = 打开使用次数文件[用户QQ]["总使用次数"];
            let 限制次数 = 打开使用次数文件[用户QQ]["限制次数"];
            const 剩余次数 = 10 - 限制次数;
            const { scale, height, maxHeight, minHeight, currentHeight } = data.data;
            const 最高 = Math.floor(maxHeight * 100) / 100;
            const 最矮 = Math.floor(minHeight * 100) / 100;
            const 当前 = Math.floor(currentHeight * 100) / 100;
            const { hair, horn, mask, neck, pants, cloak, prop } = data.adorn;

            const 消息 = [
              segment.at(e.user_id),
              '\n------用户身高-----',
              '\n体型 S 值是：\n',scale,
              '\n身高 H 值是：\n',height,
              '\n最高是：',最高.toFixed(3),
              '号\n最矮是：',最矮.toFixed(3),
              '号\n目前身高：',当前.toFixed(3),
              '号\n------用户装扮-----',
              '\n发型：',hair,
              '\n头饰：',horn,
              '\n面具：',mask,
              '\n项链：',neck,
              '\n裤子：',pants,
              '\n斗篷：',cloak,
              '\n背饰：',prop,
              '\n------ORANGE BOT-----'
            ];
            await e.reply(消息);

            /** 接口code返回201，查询失败，ID错误 */
          } else if (data.code === 201) {
            const 文字 = '绑定id错误,请重新绑定';
            const 消息 = [文字 ? 文字 : ""];
            await e.reply(消息);

            /** 接口code返回403，查询失败，KEY错误 */
          } else if (data.code === 403) {
            await e.reply('请求密钥KEY不正确！请在用户控制台 https://api.t1qq.com/user/key 申请')
          }
        } else {
          const 文字 = '您还未绑定id，指令：#国服绑定+id';
          const 消息 = [文字 ? 文字 : ""];
          await e.reply(消息);
        }
      }
    } else {
      e.reply('查询失败，您尚未获得授权')
    }
  }

  async 重置次数(e) {
    if (!await checkAuth(e)) return
    const 使用次数文件路径 = Data_folder + "/" + Usage_data;
    const userCounts = JSON.parse(fs.readFileSync(使用次数文件路径, "utf8"));
    for (const 用户QQ in userCounts) {
      if (userCounts.hasOwnProperty(用户QQ)) {
        userCounts[用户QQ].限制次数 = 0;
      }
    }
    fs.writeFileSync(使用次数文件路径, JSON.stringify(userCounts, null, "\t"));
    await e.reply('所有用户的限制次数已重置');
  }
}

const checkAuth = async function (e) {
  if (!e.isMaster) {
    e.reply(`你想干森莫?`)
    return false
  }
  return true
}

function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
