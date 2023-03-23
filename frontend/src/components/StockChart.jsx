import React from 'react';

const StockChart = ({ stock }) => {
  const renderStockChartIframe = () => {
    const html = `
    <div id="tradingview_b9e96-wrapper"
    style="position: relative;box-sizing: content-box;width: 240px;height: 150px;margin: 0 auto !important;padding: 0 !important;font-family:Arial,sans-serif;">
    <div style="width: 240px;height: 150px;background: transparent;padding: 0 !important;"><iframe
        id="tradingview_b9e96"
        src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_b9e96&amp;symbol=${stock.symbol}&amp;interval=5&amp;hidetoptoolbar=1&amp;hidelegend=1&amp;saveimage=0&amp;toolbarbg=f1f3f6&amp;studies=%5B%5D&amp;theme=light&amp;style=1&amp;timezone=America%2FNew_York&amp;studies_overrides=%7B%7D&amp;overrides=%7B%7D&amp;enabled_features=%5B%5D&amp;disabled_features=%5B%5D&amp;locale=en&amp;utm_source=127.0.0.1&amp;utm_medium=widget&amp;utm_campaign=chart&amp;utm_term=${stock.symbol}"
        style="width: 100%; height: 100%; margin: 0 !important; padding: 0 !important;" frameborder="0"
        allowtransparency="true" scrolling="no" allowfullscreen=""></iframe></div>
    </div>
    `;

    return { __html: html };
  };

  return (
    <div
      className='stock-chart'
      dangerouslySetInnerHTML={renderStockChartIframe()}
    ></div>
  );
};

export default StockChart;
