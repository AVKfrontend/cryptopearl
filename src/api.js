const subscriptionList = {}

function subscribeToPrice (coin, collback) {
  subscriptionList[coin] = collback
  getTikerPrice(coin)
}
function unSubscribe (coin) {
  delete subscriptionList[coin]
}

function getTikerPrice (t) {
  const KEY = '832618b174de4f9d1f3af9bff9522282d9a2ddf35167de1f620dc8a9ca7875c7'
  const url = `https://min-api.cryptocompare.com/data/price?fsym=${t}&tsyms=USD&api_key={${KEY}}`

  const getPrice = setInterval(
    async () => {
      if (subscriptionList[t]) {
        const resp = await fetch(url)
        let resPrice = await resp.json()
        resPrice = resPrice.USD
        console.log(`${t}: ${resPrice}`)
        subscriptionList[t](t, resPrice)
      } else clearInterval(getPrice)
    }
    , 5000
  )
}

export { subscribeToPrice, unSubscribe }
