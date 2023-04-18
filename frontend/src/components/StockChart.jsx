import React, { useEffect, useRef } from 'react';

let tvScriptLoadingPromise;

const StockChart = ({ stock }) => {
  const onLoadScriptRef = useRef();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.id = 'tradingview-widget-loading-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (
        document.getElementById(`tradingview_${stock.symbol}`) &&
        'TradingView' in window
      ) {
        new window.TradingView.widget({
          autosize: true,
          symbol: stock.symbol,
          interval: '5',
          timezone: 'America/New_York',
          theme: 'light',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          hide_top_toolbar: true,
          hide_legend: true,
          save_image: false,
          container_id: `tradingview_${stock.symbol}`,
        });
      }
    }
  }, [stock.symbol]);

  return (
    <div className='tradingview-widget-container' style={{ height: '100%' }}>
      <div id={`tradingview_${stock.symbol}`} style={{ height: '100%' }} />
      <div className='tradingview-widget-copyright'>
        <a
          href={`https://www.tradingview.com/symbols/${stock.symbol}/`}
          rel='noreferrer'
          target='_blank'
        ></a>
      </div>
    </div>
  );
};

export default StockChart;
