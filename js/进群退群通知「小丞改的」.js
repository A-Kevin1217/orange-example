export class newcomer extends plugin {
  constructor() {
    super({
      name: "欢迎新人",
      dsc: "新人入群欢迎",
      event: "notice.group.increase",
    })
  }

  /** 接受到消息都会执行一次 */
  async accept() {
    if (this.e.user_id == this.e.self_id) return

    /** 定义入群欢迎内容 */
    let msg = "欢迎新人！"
    /** 冷却cd 30s */
    let cd = 0

    /** cd */
    let key = `Yz:newcomers:${this.e.group_id}`
    if (await redis.get(key)) return
    redis.set(key, "1", { EX: cd })

    /** 回复 */
    await this.reply([
      segment.at(this.e.user_id),
      // segment.image(),
      msg
    ])
  }
}

export class outNotice extends plugin {
  constructor() {
    super({
      name: "退群通知",
      dsc: "xx退群了",
      event: "notice.group.decrease"
    })

    /** 退群提示词 */
    this.tips = "退群了"
  }

  async accept() {
    if (this.e.user_id == this.e.self_id) return

    let name, msg
    if (this.e.member) {
      name = this.e.member.card || this.e.member.nickname
    }

    if (name) {
      msg = `${name}(${this.e.user_id}) ${this.tips}`
    } else {
      msg = `${this.e.user_id} ${this.tips}`
    }
    const thanks = `感谢你为 ${this.e.group_name} 的世界带来温暖`;
    logger.mark(`[退出通知]${this.e.logText} ${msg}`)
    const music = '/root/TRSS_AllBot/TRSS-Yunzai/plugins/example/test/relife.mp3';
	  await this.reply(segment.record(music));
    await this.reply(msg)
    await this.reply(thanks)
  }
}