require('dotenv').config()
const path = require('path')
const { default: Telegraf, Markup, session } = require('telegraf')
const TelegrafI18n = require('telegraf-i18n')
const persons = require('./persons')

const i18n = new TelegrafI18n({
  defaultLanguage: 'en',
  defaultLanguageOnMissing: true,
  useSession: true,
  directory: path.resolve(__dirname, 'locales')
})

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(session(), i18n)

bot.catch(err => console.trace(err))

bot.command(['start', 'help'], ({ i18n, replyWithHTML }) => replyWithHTML(i18n.t('greeting'), keyboard(i18n)))

bot.hears(buttonCommands('generate'), async ({ i18n, replyWithChatAction, replyWithPhoto, replyWithHTML }) => {
  const photo = persons.getPhoto()
  if (!photo) return
  await replyWithChatAction('upload_photo')
  await replyWithPhoto(photo, keyboard(i18n))
  if (Math.random(1) < 0.05) replyWithHTML(i18n.t('donate'))
})

bot.launch()

function keyboard (i18n) {
  return Markup.keyboard([i18n.t('buttons.generate')]).resize().extra() // prettier-ignore
}

function buttonCommands (key) {
  return (text, { i18n }) =>
    Object.values(i18n.repository)
      .map(({ buttons }) => buttons[key]())
      .includes(text)
}
