async function getCoinList () {
  const res = await fetch('https://min-api.cryptocompare.com/data/all/coinlist?summary=true')
  const fullList = await res.json()
  return Object.keys(fullList.Data).sort()
}
export { getCoinList }
