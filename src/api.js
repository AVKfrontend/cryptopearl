const subscriptionList = {}
const subscriptionChannel = '5~CCCAGG~'
const KEY = 'ff22f3e7002848a426b497013ca0accce8dca58176a61a63c9562b81093a4c2d'
const url = `wss://streamer.cryptocompare.com/v2?api_key=${KEY}`

const wsconnection = new WebSocket(url)

function sendMessageToWS (action, coin) {
  const message = {}
  message.action = action
  message.subs = [`${subscriptionChannel}${coin}~USD`]
  const messageToSend = JSON.stringify(message)
  if (wsconnection.readyState === WebSocket.OPEN) {
    wsconnection.send(messageToSend)
    return
  }
  wsconnection.addEventListener('open', () => {
    wsconnection.send(JSON.stringify(message))
  },
  { once: true })
}
if (wsconnection) {
  wsconnection.onmessage = (messageFromWS) => {
    messageFromWS = JSON.parse(messageFromWS.data)
    if (messageFromWS.TYPE !== subscriptionChannel[0] || !messageFromWS.PRICE) return
    const coinToEdit = messageFromWS.FROMSYMBOL
    const newPrice = messageFromWS.PRICE
    subscriptionList[coinToEdit](coinToEdit, newPrice)
  }
}

function subscribeToPrice (coin, collback) {
  subscriptionList[coin] = collback
  const action = 'SubAdd'
  sendMessageToWS(action, coin)
}
function unSubscribe (coinToRemove) {
  const action = 'SubRemove'
  sendMessageToWS(action, coinToRemove)
  delete subscriptionList[coinToRemove]
}

export { subscribeToPrice, unSubscribe }
