// const key = process.env.REACT_APP_IEX_API_KEY;
const key = pk_417e21df67634240aaeae995c9f760df;

export const fetchStockInfo = async function (stock) {
  try {
    const res = await fetch(
      `https://cloud.iexapis.com/stable/stock/${stock.ticker}/quote?token=${key}`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(`${err.name} while fetching ${stock.ticker}`);
  }
};

export const chart = async function (stockTicker) {
  try {
    const res = await fetch(
      `https://cloud.iexapis.com/stable/stock/${stockTicker}/intraday-prices?token=${key}&chartInterval=3`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err.name);
  }
};
