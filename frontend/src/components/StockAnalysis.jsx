import React, { useEffect } from 'react';

const StockAnalysis = ({ stock }) => {
  useEffect(() => {
    const scriptId = `tradingview_ta_${stock.symbol}`;

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src =
        'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
        interval: '1D',
        width: '100%',
        isTransparent: true,
        height: '100%',
        symbol: stock.symbol,
        showIntervalTabs: true,
        locale: 'en',
        colorTheme: 'light',
      });

      const widgetContainer = document.getElementById(
        `tradingview_ta_container_${stock.symbol}`
      );
      widgetContainer.appendChild(script);
    }

    return () => {
      const script = document.getElementById(scriptId);
      if (script) {
        script.remove();
      }
    };
  }, [stock.symbol]);

  return (
    <div className='tradingview-widget-container' style={{ height: '100%' }}>
      <div
        className='tradingview-widget-container__widget'
        id={`tradingview_ta_container_${stock.symbol}`}
        style={{ height: '100%' }}
      />
      <div className='tradingview-widget-copyright'>
        <a
          href={`https://www.tradingview.com/symbols/${stock.symbol}/technicals/`}
          rel='noreferrer'
          target='_blank'
        ></a>
      </div>
    </div>
  );
};

export default StockAnalysis;
