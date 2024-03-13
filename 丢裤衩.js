/* 
暂时只支持以下几种场景
喵崽的QQ群 私聊
时雨崽的QQ群 私聊 QQ频道插件
不支持喵崽的频道插件 时雨崽的gocq频道
支持新版频道插件
*/

import fs from 'fs'
import puppeteer from '../../lib/puppeteer/puppeteer.js'

const file = `${process.cwd()}/resources`

export class throw_away extends plugin {
  constructor() {
    super({
      name: '丢裤衩',
      dsc: '裤衩表情包生成',
      event: 'message',
      priority: -100,
      rule: [
        {
          reg: /^(丢|丟)(裤|褲)(衩|衩)$/,
          fnc: 'throw'
        }
      ]
    })
  }


  async throw(e) {
    /** 检测html是否存在 */
    if (!fs.existsSync(`${file}/throw/throw.html`)) html()
    /** 定义头像链接 */
    let url = e.author?.avatar || `https://q1.qlogo.cn/g?b=qq&s=0&nk=${e.user_id}`
    /** 存在at的时候处理链接 */
    if (e.at) {
      const mentions = e?.mentions
      if (mentions) {
        for (let i of mentions) if (i.id === e.at) url = i.avatar
      }
      else url = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${e.at}`
    }

    /** 定义基础参数 */
    const data = {
      imgurl: url,
      saveId: 'throw',
      _plugin: 'throw',
      tplFile: './resources/throw/throw.html',
    }
    return e.reply(await puppeteer.screenshot(`throw/throw`, data))
  }
}

function html() {
  if (!fs.existsSync(file + "/throw")) fs.mkdirSync(file + "/throw")

  const htmlContent = `<!DOCTYPE html>
    <html>
    
    <head>
      <meta http-equiv="content-type" content="text/html;charset=utf-8" />
      <style>
        html,
        body {
          margin: 0;
          padding: 0;
          width: auto;
          /* 固定宽度为500px */
          height: auto;
          /* 固定高度为500px */
        }
    
        body {
          transform-origin: 0 0;
          width: auto;
          height: auto;
          background-color: rgb(5, 18, 32);
          position: absolute;
          top: 0;
          left: 0;
          background-size: cover;
          /* 图片铺满body容器 */
        }
    
        .image-container {
          position: absolute;
          top: 145px;
          left: 105px;
          width: 485px;
          height: 300px;
          overflow: hidden;
          z-index: -1;
          /* 保证图片不超出容器尺寸 */
          transform: rotate(-40deg);
          /* 逆时针旋转45度 */
        }
    
        .image-container img {
          width: 100%;
          height: 100%;
          
          /* 图片铺满容器，保持比例 */
        }
      </style>
    </head>
    
    <body>
      <img src="http://kevin-study.top/d/%E6%9C%BA%E5%99%A8%E4%BA%BA%E6%96%87%E4%BB%B6/%E5%9B%BE%E7%89%87/underpants.jpg?sign=0u_i3QYCU4hhQwrETA_9EiOezblNvmf2BHQBR7Ml6cI=:0" alt="img">
      <div class="image-container">
        <img src="{{imgurl}}" alt="throw">
      </div>
    </body>
    
    </html>`

  if (!fs.existsSync(file + "/throw/throw.html")) fs.writeFileSync(file + "/throw/throw.html", htmlContent)
}