const fetch = require('node-fetch')

const TPDNE_URL = 'https://thispersondoesnotexist.com/image'
const MAX_CASH_SIZE = 20

const cash = []

function generatePerson () {
  return fetch(TPDNE_URL).then(res => res.buffer())
}

setInterval(async () => {
  if (cash.length >= MAX_CASH_SIZE) return
  const person = await generatePerson()
  cash.push(person)
}, 5000)

exports.getPhoto = () => (cash.length ? { source: cash.pop() } : { url: TPDNE_URL })
