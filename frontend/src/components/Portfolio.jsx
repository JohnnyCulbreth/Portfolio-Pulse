import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TableBody,
  Button,
  Card,
} from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Container } from '@mui/system';
import { FaTrash } from 'react-icons/fa';

const Portfolio = () => {
  // const key = process.env.REACT_APP_IEX_API_KEY;
  const key = 'pk_b8445edb92244ad88a3de425568b1d07';

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
  const [ticker, setTicker] = useState('');
  const [numShares, setNumShares] = useState(0);
  const [entryPrice, setEntryPrice] = useState(0);

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

  const calculatePortfolioWeights = (updatedPortfolio) => {
    const totalPortfolioValue = updatedPortfolio.reduce(
      (accumulator, ticker) => {
        return accumulator + (ticker.marketValue || 0);
      },
      0
    );

    return updatedPortfolio.map((ticker) => {
      const portfolioWeight = (ticker.marketValue / totalPortfolioValue) * 100;
      return { ...ticker, portfolioWeight };
    });
  };

  const handleAddStock = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user.token;

    const config = {
      headers: {
        Authorization: `Bearer ${token || ''}`,
      },
    };

    const stockInfo = await fetchStockInfo({ ticker });
    const { latestPrice } = stockInfo;
    const costBasis = (entryPrice * numShares) / numShares;
    const marketPrice = latestPrice;
    const paidValue = costBasis * numShares;
    const marketValue = marketPrice * numShares;
    const dailyPercent = (stockInfo.changePercent * 10).toFixed(2);
    const dailyPnl = stockInfo.change * numShares;
    const overallPerformance = marketValue - paidValue;
    const overallPercent = (marketValue - paidValue) / paidValue;

    const totalPortfolioValue = portfolio.reduce(
      (accumulator, ticker) => accumulator + ticker.marketValue,
      0
    );

    const newTicker = {
      ticker,
      numShares,
      entryPrice,
      costBasis,
      marketPrice,
      paidValue,
      marketValue,
      dailyPnl,
      dailyPercent,
      overallPerformance,
      overallPercent,
      portfolioWeight: (marketValue / totalPortfolioValue) * 100,
    };

    try {
      const existingIndex = portfolio.findIndex(
        (position) => position.ticker === newTicker.ticker
      );

      if (existingIndex >= 0) {
        const existingPosition = portfolio[existingIndex];
        const updatedPosition = {
          ...existingPosition,
          numShares: Number(existingPosition.numShares) + Number(numShares),
          costBasis:
            (existingPosition.paidValue + paidValue) /
            (Number(existingPosition.numShares) + Number(numShares)),
          marketPrice: marketPrice,
          paidValue: existingPosition.paidValue + paidValue,
          marketValue: existingPosition.marketValue + marketValue,
          dailyPercent: dailyPercent,
          dailyPnl: existingPosition.dailyPnl + dailyPnl,
          overallPerformance:
            existingPosition.overallPerformance + overallPerformance,
          overallPercent:
            existingPosition.paidValue + paidValue !== 0
              ? (existingPosition.marketValue +
                  marketValue -
                  (existingPosition.paidValue + paidValue)) /
                (existingPosition.paidValue + paidValue)
              : 0,
          portfolioWeight:
            ((existingPosition.marketValue + marketValue) /
              (totalPortfolioValue + marketValue)) *
            100,
        };
        const updatedPortfolio = [...portfolio];
        updatedPortfolio[existingIndex] = updatedPosition;
        setPortfolio(calculatePortfolioWeights(updatedPortfolio));
      } else {
        const response = await axios.post('/api/tickers', newTicker, config);
        setPortfolio([...portfolio, response.data]);
      }

      setTicker('');
      setNumShares(0);
      setEntryPrice(0);
    } catch (error) {
      console.log(error);
    }
  };

  const totalPortfolioValue = portfolio.reduce((accumulator, ticker) => {
    return accumulator + (ticker.marketValue || 0);
  }, 0);

  const formatCurrency = (value) => {
    return value < 0
      ? `-$${Math.abs(value).toFixed(2)}`
      : `$${value.toFixed(2)}`;
  };

  return (
    <div>
      <Container
        maxWidth='md'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          mt: 5,
        }}
      >
        <Card sx={{ minWidth: 300 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <TextField
              label='Ticker'
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              sx={{ mr: 1 }}
            />
            <TextField
              label='Entry Price'
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              sx={{ mr: 1 }}
            />
            <TextField
              label='Number of Shares'
              value={numShares}
              onChange={(e) => setNumShares(e.target.value)}
              sx={{ mr: 1 }}
            />
            <Button
              variant='contained'
              onClick={handleAddStock}
              sx={{
                backgroundColor: '#c8e6c9',
                '&:hover': {
                  backgroundColor: '#a5d6a7',
                },
              }}
            >
              {' '}
              +{' '}
            </Button>
          </Box>
        </Card>

        <TableContainer
          component={Paper}
          sx={{ marginTop: 5, minWidth: '80vw' }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ticker</TableCell>
                <TableCell>Shares</TableCell>
                <TableCell>Cost Basis</TableCell>
                <TableCell>Market Price</TableCell>
                <TableCell>Paid Value</TableCell>
                <TableCell>Market Value</TableCell>
                <TableCell>Daily PnL</TableCell>
                <TableCell>Daily %</TableCell>
                <TableCell>Overall Performance</TableCell>
                <TableCell>Overall Performance %</TableCell>
                <TableCell>Portfolio Weight %</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolio.map((ticker, index) => {
                const dailyPnl = ticker.stockInfo.change * ticker.numShares;
                const dailyPercent = ticker.stockInfo.changePercent;
                const overallPerformance =
                  ticker.stockInfo.latestPrice * ticker.numShares -
                  ticker.entryPrice * ticker.numShares;
                const overallPercent =
                  (overallPerformance /
                    (ticker.entryPrice * ticker.numShares)) *
                  100;

                return (
                  <TableRow key={index}>
                    <TableCell>{ticker.stockInfo.symbol}</TableCell>
                    <TableCell>{ticker.numShares}</TableCell>
                    <TableCell
                      style={{
                        backgroundColor: '#c8e6c9',
                      }}
                    >
                      {ticker.entryPrice
                        ? formatCurrency(ticker.entryPrice)
                        : 'N/A'}
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor:
                          ticker.stockInfo.latestPrice > ticker.entryPrice
                            ? '#c8e6c9'
                            : '#ffcdd2',
                      }}
                    >
                      {ticker.stockInfo.latestPrice
                        ? formatCurrency(ticker.stockInfo.latestPrice)
                        : 'N/A'}
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: '#c8e6c9',
                      }}
                    >
                      {ticker.entryPrice * ticker.numShares
                        ? formatCurrency(ticker.entryPrice * ticker.numShares)
                        : 'N/A'}
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor:
                          ticker.stockInfo.latestPrice * ticker.numShares >
                          ticker.entryPrice * ticker.numShares
                            ? '#c8e6c9'
                            : '#ffcdd2',
                      }}
                    >
                      {ticker.stockInfo.latestPrice * ticker.numShares
                        ? formatCurrency(
                            ticker.stockInfo.latestPrice * ticker.numShares
                          )
                        : 'N/A'}
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: dailyPnl >= 0 ? '#c8e6c9' : '#ffcdd2',
                      }}
                    >
                      {formatCurrency(dailyPnl)}
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor:
                          dailyPercent >= 0 ? '#c8e6c9' : '#ffcdd2',
                      }}
                    >
                      {`${(dailyPercent * 100).toFixed(2)}%`}
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor:
                          overallPerformance >= 0 ? '#c8e6c9' : '#ffcdd2',
                      }}
                    >
                      {formatCurrency(overallPerformance)}
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor:
                          overallPercent >= 0 ? '#c8e6c9' : '#ffcdd2',
                      }}
                    >
                      {`${overallPercent.toFixed(2)}%`}
                    </TableCell>
                    <TableCell>{`${ticker.portfolioWeight.toFixed(
                      2
                    )}%`}</TableCell>
                    <TableCell>
                      <FaTrash />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer
          component={Paper}
          sx={{ marginTop: 5, marginBottom: 10, minWidth: '80vw' }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Daily PnL</TableCell>
                <TableCell>Daily %</TableCell>
                <TableCell>Portfolio PnL</TableCell>
                <TableCell>Portfolio %</TableCell>
                <TableCell>Portfolio Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell
                  style={{
                    backgroundColor:
                      portfolio.reduce((acc, t) => acc + t.dailyPnl, 0) >= 0
                        ? '#c8e6c9'
                        : '#ffcdd2',
                  }}
                >
                  {formatCurrency(
                    portfolio.reduce((acc, t) => acc + t.dailyPnl, 0)
                  )}
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor:
                      (portfolio.reduce((acc, t) => acc + t.dailyPnl, 0) /
                        totalPortfolioValue) *
                        100 >=
                      0
                        ? '#c8e6c9'
                        : '#ffcdd2',
                  }}
                >
                  {`${(
                    (portfolio.reduce((acc, t) => acc + t.dailyPnl, 0) /
                      totalPortfolioValue) *
                    100
                  ).toFixed(2)}%`}
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor:
                      portfolio.reduce(
                        (acc, t) => acc + t.overallPerformance,
                        0
                      ) >= 0
                        ? '#c8e6c9'
                        : '#ffcdd2',
                  }}
                >
                  {formatCurrency(
                    portfolio.reduce((acc, t) => acc + t.overallPerformance, 0)
                  )}
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor:
                      (portfolio.reduce(
                        (acc, t) => acc + t.overallPerformance,
                        0
                      ) /
                        totalPortfolioValue) *
                        100 >=
                      0
                        ? '#c8e6c9'
                        : '#ffcdd2',
                  }}
                >
                  {`${(
                    (portfolio.reduce(
                      (acc, t) => acc + t.overallPerformance,
                      0
                    ) /
                      totalPortfolioValue) *
                    100
                  ).toFixed(2)}%`}
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor:
                      totalPortfolioValue >= 0 ? '#c8e6c9' : '#ffcdd2',
                  }}
                >
                  {formatCurrency(totalPortfolioValue)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};

export default Portfolio;
