import puppeteer from '../../lib/puppeteer/puppeteer.js'

export class example extends plugin {
    constructor() {
        super({
            name: 'Git访问量',
            dsc: 'example',
            event: 'message',
            priority: 1,
            rule: [
                {
                    reg: /^(#)?(查看)?访问量$/,
                    fnc: 'View_visits'
                }
            ]
        })
    }
    async View_visits(e) {
        // 设置页面属性
        const browser = await puppeteer.browserInit();
        const page = await browser.newPage();
        await page.setViewport({
            width: 1280,
            height: 1320
        });

        const pageLinks = [
            'https://count.kjchmc.cn/get/@orange-example?theme=rule34',
            // 根据需求添加更多的页面链接
        ];

        let REPLY = []
        for (let i = 0; i < pageLinks.length; i++) {
            await page.goto(pageLinks[i]);

            let buff = null;

            buff = await page.screenshot({
                clip: {
                    x: 1,
                    y: 1,
                    width: 320,
                    height: 110
                }
            });
            let name = pageLinks[i].replace(/https:\/\/count.kjchmc.cn\/get\/|\\?theme=rule34/g, "").replace(/\?/g, "");
            REPLY.push([`${name} 访问量信息：\n`, segment.image(buff)]);
        }
        e.reply(REPLY);
        page.close().catch((err) => logger.error(err));
    }
}
