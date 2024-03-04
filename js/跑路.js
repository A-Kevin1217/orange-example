import plugin from '../../lib/plugins/plugin.js';
import fetch from "node-fetch";


export class 跑路 extends plugin {
  constructor() {
    super({
      name: '跑路',
      dsc: '跑路',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: /^跑路$/,
          fnc: 'accredit'
        }
      ]
    });
  }

  
  async accredit(e) {
    /** 判断是否是主人 */
    if (!await checkAuth(e)) return

    e.reply('Gitee删除中.....\nGitee删除完成\nGitHub删除中.....\nGitHub删除完成\nMySQL清除中......\nMySQL清除成功\n正在执行命令：sudo rm -rf ./Yunzai-Bot\n指令执行成功\n\n跑路完成，用时5.418秒')
  }
}
  
const checkAuth = async function (e) {
  if (!e.isMaster) {
    e.reply(`你也配让我跑路?`)
    return false
  }
  return true
}