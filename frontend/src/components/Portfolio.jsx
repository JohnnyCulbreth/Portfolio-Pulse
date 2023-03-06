import { useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  Button,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Container } from '@mui/system';
import { Box } from '@mui/material';
import { fetchStockInfo } from '../services/fetchStockFromAPI';
import {
  addPosition,
  updatePosition,
} from '../features/portfolio/portfolioSlice';
import { connect, useDispatch } from 'react-redux';
import { createPosition } from '../app/store';

function Portfolio({ positions, addPosition, updatePosition }) {
  const [ticker, setTicker] = useState('');
  const [entryPrice, setEntryPrice] = useState(0);
  const [numShares, setNumShares] = useState(0);

  const dispatch = useDispatch();

  if (!positions) {
    return <div>Loading...</div>;
  }

  const handleTickerChange = (event) => {
    setTicker(event.target.value);
  };

  const handleEntryPriceChange = (event) => {
    setEntryPrice(event.target.value);
  };

  const handleNumSharesChange = (event) => {
    setNumShares(event.target.value);
  };

  const handleAddStock = async (stock) => {
    const stockInfo = await fetchStockInfo(stock);
    // const chartData = await chart(stock.ticker);

    const positionData = {
      ticker: stock.ticker,
      quantity: 1,
      cost: stockInfo.latestPrice,
      // data: chartData,
    };

    const existingPosition = positions.find(
      (position) => position.ticker === stock.ticker
    );
    if (existingPosition) {
      updatePosition(existingPosition._id, {
        ticker: stock.ticker,
        quantity: existingPosition.quantity + 1,
        cost: existingPosition.cost + stockInfo.latestPrice,
      });
    } else {
      addPosition({
        ticker: stock.ticker,
        quantity: 1,
        cost: stockInfo.latestPrice,
      });
    }
    dispatch(createPosition(positionData));
  };

  function calculateTotalValue(assets) {
    if (!Array.isArray(assets) || assets.length === 0) {
      return 0;
    }
    return assets.reduce(
      (total, asset) => total + asset.price * asset.quantity,
      0
    );
  }

  const totalValue = calculateTotalValue(positions);

  const calculatePortfolioWeight = (marketValue) => {
    return ((marketValue / totalValue) * 100).toFixed(2);
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
              onChange={handleTickerChange}
              sx={{ mr: 1 }}
            />
            <TextField
              label='Entry Price'
              value={entryPrice}
              onChange={handleEntryPriceChange}
              sx={{ mr: 1 }}
            />
            <TextField
              label='Number of Shares'
              value={numShares}
              onChange={handleNumSharesChange}
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
              <AddBoxIcon />
            </Button>
          </Box>
        </Card>
        <Card
          sx={{
            minWidth: 300,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box my={2}>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {positions.map((position, index) => (
                  <TableRow key={index}>
                    <TableCell>{position.ticker}</TableCell>
                    <TableCell>{position.numShares}</TableCell>
                    <TableCell
                      style={
                        position.costBasis >= 0
                          ? { backgroundColor: '#c8e6c9' }
                          : { backgroundColor: '#ffcdd2' }
                      }
                    >
                      {position.costBasis.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </TableCell>
                    <TableCell
                      style={
                        position.marketPrice >= 0
                          ? { backgroundColor: '#c8e6c9' }
                          : { backgroundColor: '#ffcdd2' }
                      }
                    >
                      {position.marketPrice.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </TableCell>
                    <TableCell
                      style={
                        position.paidValue >= 0
                          ? { backgroundColor: '#c8e6c9' }
                          : { backgroundColor: '#ffcdd2' }
                      }
                    >
                      {position.paidValue.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </TableCell>
                    <TableCell
                      style={
                        position.marketValue >= 0
                          ? { backgroundColor: '#c8e6c9' }
                          : { backgroundColor: '#ffcdd2' }
                      }
                    >
                      {position.marketValue.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </TableCell>
                    <TableCell
                      style={
                        position.dailyPnl >= 0
                          ? { backgroundColor: '#c8e6c9' }
                          : { backgroundColor: '#ffcdd2' }
                      }
                    >
                      {position.dailyPnl.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </TableCell>
                    <TableCell
                      style={
                        position.dailyPercent >= 0
                          ? { backgroundColor: '#c8e6c9' }
                          : { backgroundColor: '#ffcdd2' }
                      }
                    >
                      {(position.dailyPercent * 10).toFixed(2) + '%'}
                    </TableCell>
                    <TableCell
                      style={
                        position.overallPerformance >= 0
                          ? { backgroundColor: '#c8e6c9' }
                          : { backgroundColor: '#ffcdd2' }
                      }
                    >
                      {position.overallPerformance.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </TableCell>
                    <TableCell
                      style={
                        position.overallPercent >= 0
                          ? { backgroundColor: '#c8e6c9' }
                          : { backgroundColor: '#ffcdd2' }
                      }
                    >
                      {(position.overallPercent * 100).toFixed(2) + '%'}
                    </TableCell>
                    <TableCell
                      style={
                        position.overallPerformance >= 0
                          ? { backgroundColor: '#c8e6c9' }
                          : { backgroundColor: '#ffcdd2' }
                      }
                    >
                      {calculatePortfolioWeight(position.marketValue) + '%'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Box my={2}>
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
                        positions.reduce(
                          (total, position) => total + position.dailyPnl,
                          0
                        ) >= 0
                          ? '#c8e6c9'
                          : '#ffcdd2',
                    }}
                  >
                    {positions
                      .reduce((total, position) => total + position.dailyPnl, 0)
                      .toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor:
                        positions.length > 0 &&
                        positions.reduce(
                          (total, position) => total + position.dailyPnl,
                          0
                        ) /
                          totalValue >=
                          0
                          ? '#c8e6c9'
                          : '#ffcdd2',
                    }}
                  >
                    {positions.length > 0 &&
                      (
                        positions.reduce(
                          (total, position) => total + position.dailyPnl,
                          0
                        ) / totalValue
                      ).toLocaleString('en-US', {
                        style: 'percent',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor:
                        positions.reduce(
                          (total, position) =>
                            total + position.overallPerformance,
                          0
                        ) >= 0
                          ? '#c8e6c9'
                          : '#ffcdd2',
                    }}
                  >
                    {positions
                      .reduce(
                        (total, position) =>
                          total + position.overallPerformance,
                        0
                      )
                      .toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor:
                        positions.length > 0 &&
                        positions.reduce(
                          (total, position) => total + position.overallPercent,
                          0
                        ) /
                          positions.length >=
                          0
                          ? '#c8e6c9'
                          : '#ffcdd2',
                    }}
                  >
                    {(
                      (positions.reduce(
                        (total, position) => total + position.overallPercent,
                        0
                      ) /
                        positions.length) *
                      100
                    ).toFixed(2) + '%'}
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#c8e6c9' }}>
                    {totalValue.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Card>
      </Container>
    </div>
  );
}

const mapStateToProps = (state) => ({
  positions: state.positions,
});

export default connect(mapStateToProps, { addPosition, updatePosition })(
  Portfolio
);
