function workerFN () {
  self.onconnect = function (event) {
    const port = event.ports[0]

    const subscriptionChannel = '5~CCCAGG~'
    const KEY = 'ff22f3e7002848a426b497013ca0accce8dca58176a61a63c9562b81093a4c2d'
    const url = `wss://streamer.cryptocompare.com/v2?api_key=${KEY}`

    const wsconnection = new WebSocket(url)

    if (wsconnection) {
      wsconnection.onmessage = (messageFromWS) => {
        messageFromWS = JSON.parse(messageFromWS.data)
        console.log(messageFromWS)
        port.postMessage(messageFromWS)
      }
    }
    port.onmessage = function (event) {
      // let action, coin, toCoin
      const action = event.data[0]
      const coin = event.data[1]
      const toCoin = event.data[2]
      // [action, coin, toCoin] = event.data
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
  }
}
export { workerFN }
