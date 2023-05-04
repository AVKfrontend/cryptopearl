// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!./websocketworker'

const subscriptionList = {}
const subscriptionCrosList = {}
let BTCUSD

const wsworker = new Worker()

// wsworker.port.onmessage = (messageFromWorker) => {
wsworker.onmessage = (messageFromWorker) => {
  const messageFromWS = messageFromWorker.data
  messageFromWS.TYPE === '500' && messageFromWS.MESSAGE === 'INVALID_SUB' ? hendlerMessage500(messageFromWS) : hendlerMessage(messageFromWS)
}
function hendlerMessage (messageFromWS) {
  if (messageFromWS.TYPE !== '5' || !messageFromWS.PRICE) return
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
  if (Object.keys(subscriptionCrosList).length === 0 && !subscriptionList.BTC) sendMessageToWorker(['SubAdd', 'BTC', 'USD'])
  subscriptionCrosList[coin] = '-'
  const action = 'SubAdd'
  sendMessageToWorker([action, coin, 'BTC'])
}

function returnNewPriceToApp (coin, newPrice) {
  subscriptionList[coin](coin, newPrice)
}
function subscribeToPrice (coin, collback) {
  subscriptionList[coin] = collback
  if (Object.keys(subscriptionCrosList).length !== 0 && coin === 'BTC') return
  const action = 'SubAdd'
  sendMessageToWorker([action, coin, 'USD'])
}
function unSubscribe (coinToRemove) {
  const action = 'SubRemove'
  let coinPair = 'USD'
  delete subscriptionList[coinToRemove]
  const lastCrosPrice = subscriptionCrosList[coinToRemove]
  if (lastCrosPrice) {
    coinPair = 'BTC'
    delete subscriptionCrosList[coinToRemove]
    if (Object.keys(subscriptionCrosList).length === 0 && !subscriptionList.BTC) sendMessageToWorker(['SubRemove', 'BTC', 'USD'])
    if (lastCrosPrice === '-') return
  }
  sendMessageToWorker([action, coinToRemove, coinPair])
}
function sendMessageToWorker (message) {
  wsworker.postMessage(message)
  // wsworker.port.postMessage(message)
}

export { subscribeToPrice, unSubscribe }
