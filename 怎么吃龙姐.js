let TitleTemplete = [["龙姐拌面"], ["龙姐炖肉"], ["刺头龙姐"], ["小炒龙姐"], ["凉拌龙姐"],["水煮龙姐"],["烧烤龙姐"],["龙姐烧麦"],["清蒸龙姐"],["红烧龙姐"],["醋溜龙姐"],["龙姐扣肉"],["龙姐腊肉"],["刺身龙姐"],["葱烧龙姐"],["干炸龙姐"],["酥炸龙姐"],["软炸龙姐"],["糖醋龙姐"],["拔丝龙姐"],["芝士焗龙姐"],["烟熏龙姐"],["浸炸龙姐"],["油炸伐龙薯条"],]
let random = 0
export class Givetitle extends plugin {
    constructor() 
    {
        super({
            name: '怎么吃龙姐',
            dsc: '怎么吃龙姐',
            event: 'message',
            priority: 233,
            rule: [
                {
                    reg: '^怎么吃(龙姐|伐龙|CareyJack|宋先生|careyjack|Careyjack|careyJack|Carey Jack|Carey jack|carey jack|宋崇杰)$',
                    fnc: 'how_to_eat'
                }
            ]
        })
    }

async how_to_eat(e){
    random = (random + Math.floor(Math.random() * (TitleTemplete.length - 1)) + 1) % TitleTemplete.length
    const title = TitleTemplete[random][0]
    e.reply(`${title}`)
    return true
    }
}