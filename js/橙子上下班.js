import plugin from '../../lib/plugins/plugin.js';
import YAML from 'yaml'
import fs from 'fs'

let cfg_group_filePath = `./config/config/group.yaml`
let def_group_filePath = `./config/default_config/group.yaml`
let bakcfg_group_filePath = `./data/BotOnOff/group.yaml.bak`

//在此处输入测试群群号，下班后不影响测试群使用机器人，可不填（填写格式：let test = [123456789, 群号2]）
let whiteGroup = [950610361,583254736,626700697]


export class example2 extends plugin {
    constructor () {
      super({
        name: '机器人上下班',
        dsc: '机器人上下班（@千奈千祁）',
        event: 'message',
        priority: 5000,
        rule: [
          {
            reg: '^(#)?狗东西(上班|开机|关机|下班)$',
            fnc: '云崽上下班_千奈千祁'
          }
        ]
      })
    }
    async 云崽上下班_千奈千祁(e){
        if(!fs.existsSync(`./data/BotOnOff`)){
            //写个错误处理
            try {
                fs.mkdirSync(`./data/BotOnOff`)
            } catch(error) {
                logger.error(`创建备份文件夹时出错！\n` + error)
                return false;
            }
        }
        if(!e.isMaster) return false;
        let msg = e.msg.match(/^狗东西(上班|开机|关机|下班)$/)
        if(msg[1] == `关机` || msg[1] == `下班`) {
            this.BotOff_QianNQQ()
        } else if(msg[1] == `开机` || msg[1] == `上班`) {
            this.BotOn_QianNQQ()
        }
    }
    async BotOn_QianNQQ(){
        if(!fs.existsSync(bakcfg_group_filePath)) return true
        let config = fs.readFileSync(bakcfg_group_filePath, `utf-8`)
        fs.writeFileSync(cfg_group_filePath, config)
        this.reply(`臭伐龙，小橙子我又上班了！`)
        this.BotOff = true
        fs.unlinkSync(bakcfg_group_filePath)
    }
    async BotOff_QianNQQ(){
        if(fs.existsSync(bakcfg_group_filePath)) return true
        let config
        try {
            config = fs.readFileSync(cfg_group_filePath, `utf-8`)
            fs.writeFileSync(bakcfg_group_filePath, config, `utf-8`)
        } catch(error) {
            logger.error(`备份配置文件时出错！\n` + error)
            return false
        }
        config = fs.readFileSync(def_group_filePath, `utf-8`)
        config = YAML.parse(config)
        let enable = [`机器人上下班`]
        config.default.enable = enable
        for (let item of whiteGroup) {
            config[item] = { enable: `` }
        }
        config = YAML.stringify(config)
        fs.writeFileSync(cfg_group_filePath, config, `utf-8`)
        this.reply(`怎么又下班？我下我下！`)
    }
}
