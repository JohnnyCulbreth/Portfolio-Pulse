import React from 'react';
import StockChart from './StockChart';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

const WatchList = () => {
  const stocks = ['AAPL', 'TSLA', 'GOOGL', 'AMZN', 'MSFT'];

  return (
    <Grid container spacing={3} className='watchlist'>
      {stocks.map((symbol) => (
        <Grid item key={symbol} xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <StockChart stock={{ symbol }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default WatchList;
