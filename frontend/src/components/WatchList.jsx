import React from 'react';
import StockChart from './StockChart';
import StockAnalysis from './StockAnalysis';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const WatchList = ({ portfolio }) => {
  return (
    <>
      <h1> Your Positions: </h1>
      <div
        className='watchlist'
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: '5%',
        }}
      >
        {portfolio.map((stock) => (
          <div key={stock.ticker} style={{ marginBottom: '1rem' }}>
            <Card
              style={{
                display: 'flex',
                flexDirection: 'row',
                minWidth: '80vw',
                minHeight: '30vw',
                height: '30vw',
              }}
            >
              <CardContent style={{ flex: '1 1 0', height: '100%' }}>
                <StockChart stock={{ symbol: stock.ticker }} />
              </CardContent>
              <CardContent style={{ flex: '1 1 0', height: '100%' }}>
                <StockAnalysis stock={{ symbol: stock.ticker }} />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
};

export default WatchList;
