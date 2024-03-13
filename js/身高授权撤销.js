import plugin from '../../lib/plugins/plugin.js';
import fetch from "node-fetch";
import fs from 'fs'

/** 文件夹及文件 */
let Data_folder = "plugins/example/国服身高查询"
let Authorization_data = '授权.json'


/** 判断文件是否存在，不存在则自动创建 */
if (!fs.existsSync(Data_folder)){fs.mkdirSync(Data_folder)}
if (!fs.existsSync(Data_folder + "/" + Authorization_data)) {fs.writeFileSync(Data_folder + "/" + Authorization_data, JSON.stringify({}))}


export class 身高授权撤销 extends plugin {
  constructor() {
    super({
      name: '身高授权撤销',
      dsc: '身高授权撤销',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: /^#(取消|撤销)授权(.*)$/,
          fnc: 'accredit'
        }
      ]
    });
  }

  
  async accredit(e) {
    /** 判断是否是主人 */
    if (!await checkAuth(e)) return

    const ID = (e.at ? e.at : e.user_id)
    const 给予授权 = 0
    const data = { "授权状态": 给予授权 }

    const json = JSON.parse(fs.readFileSync(Data_folder + "/" + Authorization_data, "utf8"));json[ID] = data
    fs.writeFileSync(Data_folder + "/" + Authorization_data, JSON.stringify(json, null, "\t"));

    e.reply('取消授权成功')
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
