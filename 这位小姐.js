import plugin from '../../lib/plugins/plugin.js';
import fetch from "node-fetch";


export class 这位小姐 extends plugin {
  constructor() {
    super({
      name: '这位小姐',
      dsc: '这位小姐',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: /^这位小姐？$/,
          fnc: 'this'
        }
      ]
    });
  }

  
  async this(e) {
	const mic = 'http://kevin-study.top/d/%E6%9C%BA%E5%99%A8%E4%BA%BA%E6%96%87%E4%BB%B6/%E5%AA%92%E4%BD%93/this_sister.mp3?sign=uTKCQIC3O5iMeJkyefmErGCJ0IZWvw1APGjHSW-yPd4=:0';
	e.reply(segment.record(mic));
  }
}