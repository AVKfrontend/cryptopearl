const subscriptionList = {}
const subscriptionCrosList = {}
let BTCUSD
const subscriptionChannel = '5~CCCAGG~'
const KEY = 'ff22f3e7002848a426b497013ca0accce8dca58176a61a63c9562b81093a4c2d'
const url = `wss://streamer.cryptocompare.com/v2?api_key=${KEY}`

const wsconnection = new WebSocket(url)

function sendMessageToWS (action, coin, toCoin) {
  const message = {}
  message.action = action
  message.subs = [`${subscriptionChannel}${coin}~${toCoin}`]
  const messageToSend = JSON.stringify(message)
  if (wsconnection.readyState === WebSocket.OPEN) {
    wsconnection.send(messageToSend)
    return
  }
  wsconnection.addEventListener('open', () => {
    wsconnection.send(messageToSend)
  },
  { once: true })
}
if (wsconnection) {
  wsconnection.onmessage = (messageFromWS) => {
    messageFromWS = JSON.parse(messageFromWS.data)
    console.log(messageFromWS)
    hendlerMessage(messageFromWS)
  }
}
function hendlerMessage (messageFromWS) {
  if (messageFromWS.TYPE === '500' && messageFromWS.MESSAGE === 'INVALID_SUB') hendlerMessage500(messageFromWS)
  if (messageFromWS.TYPE !== subscriptionChannel[0] || !messageFromWS.PRICE) return
  const coinToEdit = messageFromWS.FROMSYMBOL
  const coinPair = messageFromWS.TOSYMBOL
  const newPrice = messageFromWS.PRICE
  if (coinToEdit === 'BTC' || coinPair === 'BTC') hendlerMessageBTC(coinToEdit, newPrice)
  if (coinToEdit !== 'BTC' && coinPair === 'USD') returnNewPriceToApp(coinToEdit, newPrice)
}
function hendlerMessageBTC (coin, newPrice) {
  if (coin === 'BTC') {
    subscriptionList.BTC?.(coin, newPrice)
    BTCUSD = newPrice
    Object.entries(subscriptionCrosList).forEach(el => {
      if (el[1] !== '-') returnNewPriceToApp(el[0], el[1] * newPrice)
    })
    return
  }
  subscriptionCrosList[coin] = newPrice
  returnNewPriceToApp(coin, newPrice * BTCUSD)
}
function hendlerMessage500 (message) {
  message = message.PARAMETER.split('~')
  const fromChange = message[2]
  const toChange = message[3]
  if (toChange === 'BTC') returnNewPriceToApp(fromChange, null)
  if (toChange === 'USD') subscribeToCross(fromChange)
}
function subscribeToCross (coin) {
  if (Object.keys(subscriptionCrosList).length === 0 && !subscriptionList.BTC) sendMessageToWS('SubAdd', 'BTC', 'USD')
  subscriptionCrosList[coin] = '-'
  const action = 'SubAdd'
  sendMessageToWS(action, coin, 'BTC')
}

function returnNewPriceToApp (coin, newPrice) {
  subscriptionList[coin](coin, newPrice)
}
function subscribeToPrice (coin, collback) {
  subscriptionList[coin] = collback
  if (Object.keys(subscriptionCrosList).length !== 0 && coin === 'BTC') return
  const action = 'SubAdd'
  sendMessageToWS(action, coin, 'USD')
}
function unSubscribe (coinToRemove) {
  const action = 'SubRemove'
  let coinPair = 'USD'
  delete subscriptionList[coinToRemove]
  const lastCrosPrice = subscriptionCrosList[coinToRemove]
  if (lastCrosPrice) {
    coinPair = 'BTC'
    delete subscriptionCrosList[coinToRemove]
    if (Object.keys(subscriptionCrosList).length === 0 && !subscriptionList.BTC) sendMessageToWS('SubRemove', 'BTC', 'USD')
    if (lastCrosPrice === '-') return
  }
  sendMessageToWS(action, coinToRemove, coinPair)
}

export { subscribeToPrice, unSubscribe }
