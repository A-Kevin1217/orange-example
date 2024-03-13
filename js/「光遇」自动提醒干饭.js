import fetch from "node-fetch";
import schedule from "node-schedule";
import moment from "moment";

const _path = process.cwd();
const Textreply = '还有五分钟就到饭点了\n老奶奶喊你来干饭了！';
const imgreply = 'http://kevin-study.top/d/%E6%9C%BA%E5%99%A8%E4%BA%BA%E6%96%87%E4%BB%B6/%E5%9B%BE%E7%89%87/food.jpg?sign=J08FmUenceU6KVpXlTrvNfVjWpdb4bwBM575QHONv2c=:0'
const 禁止meme = '另外还有五分钟小孩姐也要上岗了，请各位恪守本分不要随意触发我的表情包功能，想玩的话请移步玩机器人的群：950610361 谢谢配合！';
const test = '测试定时推送功能\n鸣谢：小莫、古希腊小孩姐';
let Gruop  = [860171010];
/** 推送群号,多个群用英文逗号','隔开 */
async function sleep(ms) {
   return new Promise((resolve) => setTimeout(resolve, ms));
}
/** cron表达式定义推送时间 (秒 分 时 日 月 星期) */
schedule.scheduleJob('0 58 7,9,11,15,17,19 * * *', async()=>{ 
   let time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
   let hours =(new Date(time).getHours());
   let msg;
   switch(hours){
      case 7:msg = [
         imgreply ? segment.image(imgreply) : "",
         Textreply ? Textreply : "",
      ]
      break;
      case 9:msg = [
         imgreply ? segment.image(imgreply) : "",
         Textreply ? Textreply : "",
      ]
      break;
      case 11:msg = [
         imgreply ? segment.image(imgreply) : "",
         Textreply ? Textreply : "",
      ]
      break;
      case 15:msg = [
         imgreply ? segment.image(imgreply) : "",
         Textreply ? Textreply : "",
      ]
      break;
      case 17:msg = [
         imgreply ? segment.image(imgreply) : "",
         Textreply ? Textreply : "",
      ]
      break;
      case 19:msg = [
         imgreply ? segment.image(imgreply) : "",
         Textreply ? Textreply : "",
         禁止meme ? 禁止meme : "",
      ]
   }
   console.log(msg)
   for (var key of Gruop) {
      Bot.pickGroup(key * 1).sendMsg(msg);
      await sleep(10000) 
   }
});
