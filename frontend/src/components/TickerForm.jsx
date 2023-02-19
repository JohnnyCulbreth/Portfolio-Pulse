import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTicker } from '../features/tickers/tickerSlice';

function TickerForm() {
  const [text, setText] = useState('');

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(createTicker({ text }));
    setText('');
  };

  return (
    <section className='form'>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='text'>Ticker</label>
          <input
            type='text'
            name='text'
            id='text'
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
          />
        </div>
        <div className='form-group'>
          <button className='btn btn-block' type='submit'>
            Add Ticker
          </button>
        </div>
      </form>
    </section>
  );
}

export default TickerForm;
