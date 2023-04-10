import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Portfolio from '../components/Portfolio';
import WatchList from '../components/WatchList';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();

  const key = 'pk_c227bbfffc334f619036e0e3d8679fb5';

  const fetchStockInfo = async function (stock) {
    try {
      const res = await axios.get(
        `https://cloud.iexapis.com/stable/stock/${stock.ticker}/quote?token=${key}`
      );
      const data = res.data;
      return data;
    } catch (err) {
      console.log(`${err.name} while fetching ${stock.ticker}`);
    }
  };

  const [portfolio, setPortfolio] = useState([]);

  const { user } = useSelector((state) => state.auth);
  if (!user) {
    navigate('/login');
  }

  const calculatePortfolioWeights = (updatedPortfolio) => {
    const totalPortfolioValue = updatedPortfolio.reduce(
      (accumulator, ticker) => {
        return accumulator + (Number(ticker.marketValue) || 0);
      },
      0
    );

    return updatedPortfolio.map((ticker) => {
      let portfolioWeight = 0;
      if (
        !isNaN(ticker.marketValue) &&
        !isNaN(totalPortfolioValue) &&
        totalPortfolioValue > 0
      ) {
        portfolioWeight = (ticker.marketValue / totalPortfolioValue) * 100;
      }
      return { ...ticker, portfolioWeight };
    });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user.token;

    const config = {
      headers: {
        Authorization: `Bearer ${token || ''}`,
      },
    };

    const fetchData = async () => {
      const response = await axios.get('/api/users/me', config);

      const updatedPortfolio = await Promise.all(
        response.data.portfolio.map(async (position) => {
          const stockInfo = await fetchStockInfo({ ticker: position.ticker });
          return {
            ...position,
            stockInfo,
            marketPrice: stockInfo.latestPrice,
            marketValue: stockInfo.latestPrice * position.numShares,
            dailyPnl: stockInfo.change * position.numShares,
            dailyPercent: stockInfo.changePercent * 100,
            overallPerformance:
              stockInfo.latestPrice * position.numShares -
              position.entryPrice * position.numShares,
            overallPercent:
              ((stockInfo.latestPrice * position.numShares -
                position.entryPrice * position.numShares) /
                (position.entryPrice * position.numShares)) *
              100,
          };
        })
      );

      setPortfolio(calculatePortfolioWeights(updatedPortfolio));
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 3600000);

    // Cleanup function to clear the interval when the component is unmounted
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <section className='heading'>
        <h2> Welcome {user && user.name} </h2>
        <Portfolio portfolio={portfolio} setPortfolio={setPortfolio} />
        <WatchList portfolio={portfolio} />
      </section>
    </>
  );
}

export default Dashboard;
