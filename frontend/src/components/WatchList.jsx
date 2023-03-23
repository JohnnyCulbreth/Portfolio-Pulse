import React from 'react';
import StockChart from './StockChart';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

const WatchList = ({ portfolio }) => {
  return (
    <Grid
      container
      spacing={3}
      className='watchlist'
      sx={{ paddingBottom: '5%' }}
    >
      {portfolio.map((stock) => (
        <Grid item key={stock.ticker} xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <StockChart stock={{ symbol: stock.ticker }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default WatchList;
