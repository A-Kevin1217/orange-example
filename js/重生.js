import plugin from '../../lib/plugins/plugin.js';
import fetch from "node-fetch";


export class 重生 extends plugin {
  constructor() {
    super({
      name: '重生',
      dsc: '重生',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: /^重生$/,
          fnc: 'relife'
        }
      ]
    });
  }

  
  async relife(e) {
	const music = 'http://kevin-study.top/d/%E6%9C%BA%E5%99%A8%E4%BA%BA%E6%96%87%E4%BB%B6/%E5%AA%92%E4%BD%93/relife.mp3?sign=awDaEpUhMuo9yIEPz9P9y6LnqPA8-L9keYfxXnbsb6I=:0';
	e.reply(segment.record(music));
  }
}