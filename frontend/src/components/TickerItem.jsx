import { useDispatch } from 'react-redux';
import { deleteTicker } from '../features/tickers/tickerSlice';

function TickerItem({ ticker }) {
  const dispatch = useDispatch();

  return (
    <div className='ticker'>
      <div>{new Date(ticker.createdAt).toLocaleString('en-us')}</div>
      <h2>{ticker.text}</h2>
      <button
        onClick={() => dispatch(deleteTicker(ticker._id))}
        className='close'
      >
        X
      </button>
    </div>
  );
}

export default TickerItem;
