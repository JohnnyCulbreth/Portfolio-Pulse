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
import { fetchStockInfo } from '../services/fetchStockFromAPI';
import { Container } from '@mui/system';

const Portfolio = () => {
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

      setPortfolio(response.data.portfolio);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user.token;

    const config = {
      headers: {
        Authorization: `Bearer ${token || ''}`,
      },
    };

    const newTicker = {
      ticker,
      numShares,
      entryPrice,
    };

    try {
      const response = await axios.post('/api/tickers', newTicker, config);
      setPortfolio([...portfolio, response.data]);
      setTicker('');
      setNumShares(0);
      setEntryPrice(0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTickerChange = (event) => {
    setTicker(event.target.value);
  };

  const handleEntryPriceChange = (event) => {
    setEntryPrice(event.target.value);
  };

  const handleNumSharesChange = (event) => {
    setNumShares(event.target.value);
  };

  const handleAddStock = async () => {
    try {
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
      const existingIndex = portfolio.findIndex(
        (position) => position.ticker === ticker
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
          portfolioWeight: calculatePortfolioWeight(
            existingPosition.marketValue + marketValue
          ),
        };
        const updatedPortfolio = [...portfolio];
        updatedPortfolio[existingIndex] = updatedPosition;
        setPortfolio(updatedPortfolio);
      } else {
        const totalValue = calculateTotalValue(
          portfolio.concat([{ ticker, numShares, marketValue }])
        );
        const portfolioWeight = ((marketValue / totalValue) * 100).toFixed(2);
        setPortfolio(
          portfolio.concat([
            {
              ticker,
              numShares,
              costBasis,
              marketPrice,
              paidValue,
              marketValue,
              dailyPercent,
              dailyPnl,
              overallPerformance,
              overallPercent,
              portfolioWeight,
            },
          ])
        );
      }
      setTicker('');
      setEntryPrice(0);
      setNumShares(0);
    } catch (error) {
      console.log(error);
    }
  };

  const calculateTotalValue = (positions) => {
    return positions.reduce((totalValue, position) => {
      return totalValue + position.marketValue;
    }, 0);
  };

  const totalValue = calculateTotalValue(portfolio);

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
              {' '}
              +{' '}
            </Button>
          </Box>
        </Card>
        <TableContainer component={Paper} sx={{ marginTop: 5 }}>
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
              {portfolio.map((ticker, index) => (
                <TableRow key={index}>
                  <TableCell>{ticker.ticker}</TableCell>
                  <TableCell>{ticker.numShares}</TableCell>
                  <TableCell>{ticker.entryPrice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};

export default Portfolio;

// import { useState } from 'react';
// import {
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Card,
//   Button,
// } from '@mui/material';
// import TextField from '@mui/material/TextField';
// import AddBoxIcon from '@mui/icons-material/AddBox';
// import { Container } from '@mui/system';
// import { Box } from '@mui/material';
// import { fetchStockInfo } from '../services/fetchStockFromAPI';

// function Portfolio() {
//   const [ticker, setTicker] = useState('');
//   const [entryPrice, setEntryPrice] = useState(0);
//   const [numShares, setNumShares] = useState(0);
//   const [portfolio, setPortfolio] = useState([]);

// const handleTickerChange = (event) => {
//   setTicker(event.target.value);
// };

// const handleEntryPriceChange = (event) => {
//   setEntryPrice(event.target.value);
// };

// const handleNumSharesChange = (event) => {
//   setNumShares(event.target.value);
// };

// const handleAddStock = async () => {
//   try {
//     const stockInfo = await fetchStockInfo({ ticker });
//     const { latestPrice } = stockInfo;
//     const costBasis = (entryPrice * numShares) / numShares;
//     const marketPrice = latestPrice;
//     const paidValue = costBasis * numShares;
//     const marketValue = marketPrice * numShares;
//     const dailyPercent = (stockInfo.changePercent * 10).toFixed(2);
//     const dailyPnl = stockInfo.change * numShares;
//     const overallPerformance = marketValue - paidValue;
//     const overallPercent = (marketValue - paidValue) / paidValue;
//     const existingIndex = portfolio.findIndex(
//       (position) => position.ticker === ticker
//     );
//     if (existingIndex >= 0) {
//       const existingPosition = portfolio[existingIndex];
//       const updatedPosition = {
//         ...existingPosition,
//         numShares: Number(existingPosition.numShares) + Number(numShares),
//         costBasis:
//           (existingPosition.paidValue + paidValue) /
//           (Number(existingPosition.numShares) + Number(numShares)),
//         marketPrice: marketPrice,
//         paidValue: existingPosition.paidValue + paidValue,
//         marketValue: existingPosition.marketValue + marketValue,
//         dailyPercent: dailyPercent,
//         dailyPnl: existingPosition.dailyPnl + dailyPnl,
//         overallPerformance:
//           existingPosition.overallPerformance + overallPerformance,
//         overallPercent:
//           existingPosition.paidValue + paidValue !== 0
//             ? (existingPosition.marketValue +
//                 marketValue -
//                 (existingPosition.paidValue + paidValue)) /
//               (existingPosition.paidValue + paidValue)
//             : 0,
//         portfolioWeight: calculatePortfolioWeight(
//           existingPosition.marketValue + marketValue
//         ),
//       };
//       const updatedPortfolio = [...portfolio];
//       updatedPortfolio[existingIndex] = updatedPosition;
//       setPortfolio(updatedPortfolio);
//     } else {
//       const totalValue = calculateTotalValue(
//         portfolio.concat([{ ticker, numShares, marketValue }])
//       );
//       const portfolioWeight = ((marketValue / totalValue) * 100).toFixed(2);
//       setPortfolio(
//         portfolio.concat([
//           {
//             ticker,
//             numShares,
//             costBasis,
//             marketPrice,
//             paidValue,
//             marketValue,
//             dailyPercent,
//             dailyPnl,
//             overallPerformance,
//             overallPercent,
//             portfolioWeight,
//           },
//         ])
//       );
//     }
//     setTicker('');
//     setEntryPrice(0);
//     setNumShares(0);
//   } catch (error) {
//     console.log(error);
//   }
// };

// const calculateTotalValue = (positions) => {
//   return positions.reduce((totalValue, position) => {
//     return totalValue + position.marketValue;
//   }, 0);
// };

// const totalValue = calculateTotalValue(portfolio);

// const calculatePortfolioWeight = (marketValue) => {
//   return ((marketValue / totalValue) * 100).toFixed(2);
// };

// return (
//   <div>
//     <Container
//       maxWidth='md'
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         gap: '24px',
//         mt: 5,
//       }}
//     >
//       <Card sx={{ minWidth: 300 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
//           <TextField
//             label='Ticker'
//             value={ticker}
//             onChange={handleTickerChange}
//             sx={{ mr: 1 }}
//           />
//           <TextField
//             label='Entry Price'
//             value={entryPrice}
//             onChange={handleEntryPriceChange}
//             sx={{ mr: 1 }}
//           />
//           <TextField
//             label='Number of Shares'
//             value={numShares}
//             onChange={handleNumSharesChange}
//             sx={{ mr: 1 }}
//           />
//           <Button
//             variant='contained'
//             onClick={handleAddStock}
//             sx={{
//               backgroundColor: '#c8e6c9',
//               '&:hover': {
//                 backgroundColor: '#a5d6a7',
//               },
//             }}
//           >
//             <AddBoxIcon />
//           </Button>
//         </Box>
//       </Card>
//       <Card
//         sx={{
//           minWidth: 300,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         <Box my={2}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Ticker</TableCell>
//                 <TableCell>Shares</TableCell>
//                 <TableCell>Cost Basis</TableCell>
//                 <TableCell>Market Price</TableCell>
//                 <TableCell>Paid Value</TableCell>
//                 <TableCell>Market Value</TableCell>
//                 <TableCell>Daily PnL</TableCell>
//                 <TableCell>Daily %</TableCell>
//                 <TableCell>Overall Performance</TableCell>
//                 <TableCell>Overall Performance %</TableCell>
//                 <TableCell>Portfolio Weight %</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {portfolio.map((position, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{position.ticker}</TableCell>
//                   <TableCell>{position.numShares}</TableCell>
//                   <TableCell
//                     style={
//                       position.costBasis >= 0
//                         ? { backgroundColor: '#c8e6c9' }
//                         : { backgroundColor: '#ffcdd2' }
//                     }
//                   >
//                     {position.costBasis.toLocaleString('en-US', {
//                       style: 'currency',
//                       currency: 'USD',
//                     })}
//                   </TableCell>
//                   <TableCell
//                     style={
//                       position.marketPrice >= 0
//                         ? { backgroundColor: '#c8e6c9' }
//                         : { backgroundColor: '#ffcdd2' }
//                     }
//                   >
//                     {position.marketPrice.toLocaleString('en-US', {
//                       style: 'currency',
//                       currency: 'USD',
//                     })}
//                   </TableCell>
//                   <TableCell
//                     style={
//                       position.paidValue >= 0
//                         ? { backgroundColor: '#c8e6c9' }
//                         : { backgroundColor: '#ffcdd2' }
//                     }
//                   >
//                     {position.paidValue.toLocaleString('en-US', {
//                       style: 'currency',
//                       currency: 'USD',
//                     })}
//                   </TableCell>
//                   <TableCell
//                     style={
//                       position.marketValue >= 0
//                         ? { backgroundColor: '#c8e6c9' }
//                         : { backgroundColor: '#ffcdd2' }
//                     }
//                   >
//                     {position.marketValue.toLocaleString('en-US', {
//                       style: 'currency',
//                       currency: 'USD',
//                     })}
//                   </TableCell>
//                   <TableCell
//                     style={
//                       position.dailyPnl >= 0
//                         ? { backgroundColor: '#c8e6c9' }
//                         : { backgroundColor: '#ffcdd2' }
//                     }
//                   >
//                     {position.dailyPnl.toLocaleString('en-US', {
//                       style: 'currency',
//                       currency: 'USD',
//                     })}
//                   </TableCell>
//                   <TableCell
//                     style={
//                       position.dailyPercent >= 0
//                         ? { backgroundColor: '#c8e6c9' }
//                         : { backgroundColor: '#ffcdd2' }
//                     }
//                   >
//                     {(position.dailyPercent * 10).toFixed(2) + '%'}
//                   </TableCell>
//                   <TableCell
//                     style={
//                       position.overallPerformance >= 0
//                         ? { backgroundColor: '#c8e6c9' }
//                         : { backgroundColor: '#ffcdd2' }
//                     }
//                   >
//                     {position.overallPerformance.toLocaleString('en-US', {
//                       style: 'currency',
//                       currency: 'USD',
//                     })}
//                   </TableCell>
//                   <TableCell
//                     style={
//                       position.overallPercent >= 0
//                         ? { backgroundColor: '#c8e6c9' }
//                         : { backgroundColor: '#ffcdd2' }
//                     }
//                   >
//                     {(position.overallPercent * 100).toFixed(2) + '%'}
//                   </TableCell>
//                   <TableCell
//                     style={
//                       position.overallPerformance >= 0
//                         ? { backgroundColor: '#c8e6c9' }
//                         : { backgroundColor: '#ffcdd2' }
//                     }
//                   >
//                     {calculatePortfolioWeight(position.marketValue) + '%'}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Box>
//         <Box my={2}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Daily PnL</TableCell>
//                 <TableCell>Daily %</TableCell>
//                 <TableCell>Portfolio PnL</TableCell>
//                 <TableCell>Portfolio %</TableCell>
//                 <TableCell>Portfolio Value</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               <TableRow>
//                 <TableCell
//                   style={{
//                     backgroundColor:
//                       portfolio.reduce(
//                         (total, position) => total + position.dailyPnl,
//                         0
//                       ) >= 0
//                         ? '#c8e6c9'
//                         : '#ffcdd2',
//                   }}
//                 >
//                   {portfolio
//                     .reduce((total, position) => total + position.dailyPnl, 0)
//                     .toLocaleString('en-US', {
//                       style: 'currency',
//                       currency: 'USD',
//                     })}
//                 </TableCell>
//                 <TableCell
//                   style={{
//                     backgroundColor:
//                       portfolio.length > 0 &&
//                       portfolio.reduce(
//                         (total, position) => total + position.dailyPnl,
//                         0
//                       ) /
//                         totalValue >=
//                         0
//                         ? '#c8e6c9'
//                         : '#ffcdd2',
//                   }}
//                 >
//                   {portfolio.length > 0 &&
//                     (
//                       portfolio.reduce(
//                         (total, position) => total + position.dailyPnl,
//                         0
//                       ) / totalValue
//                     ).toLocaleString('en-US', {
//                       style: 'percent',
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                 </TableCell>
//                 <TableCell
//                   style={{
//                     backgroundColor:
//                       portfolio.reduce(
//                         (total, position) =>
//                           total + position.overallPerformance,
//                         0
//                       ) >= 0
//                         ? '#c8e6c9'
//                         : '#ffcdd2',
//                   }}
//                 >
//                   {portfolio
//                     .reduce(
//                       (total, position) =>
//                         total + position.overallPerformance,
//                       0
//                     )
//                     .toLocaleString('en-US', {
//                       style: 'currency',
//                       currency: 'USD',
//                     })}
//                 </TableCell>
//                 <TableCell
//                   style={{
//                     backgroundColor:
//                       portfolio.length > 0 &&
//                       portfolio.reduce(
//                         (total, position) => total + position.overallPercent,
//                         0
//                       ) /
//                         portfolio.length >=
//                         0
//                         ? '#c8e6c9'
//                         : '#ffcdd2',
//                   }}
//                 >
//                   {(
//                     (portfolio.reduce(
//                       (total, position) => total + position.overallPercent,
//                       0
//                     ) /
//                       portfolio.length) *
//                     100
//                   ).toFixed(2) + '%'}
//                 </TableCell>
//                 <TableCell style={{ backgroundColor: '#c8e6c9' }}>
//                   {totalValue.toLocaleString('en-US', {
//                     style: 'currency',
//                     currency: 'USD',
//                   })}
//                 </TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         </Box>
//       </Card>
//     </Container>
//   </div>
// );
// }
// export default Portfolio;
