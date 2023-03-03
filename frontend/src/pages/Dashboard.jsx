import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import TickerForm from '../components/TickerForm';
import TickerItem from '../components/TickerItem';
import Spinner from '../components/Spinner';
import { getTickers } from '../features/tickers/tickerSlice';
import Portfolio from '../components/Portfolio/Portfolio';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { tickers, isLoading, isError, message } = useSelector(
    (state) => state.tickers
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    if (!user) {
      navigate('/login');
    }

    dispatch(getTickers());

    return () => {
      // dispatch(reset());
      // ^ This was causing logout to go into an infinite loop and crash the app -- revisit
    };
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className='heading'>
        <h1> Welcome {user && user.name} </h1>
        <p>Your Portfolio</p>
      </section>

      <TickerForm />

      <section className='content'>
        {tickers.length > 0 ? (
          <div className='tickers'>
            {tickers.map((ticker) => (
              <TickerItem key={ticker._id} ticker={ticker} />
            ))}
          </div>
        ) : (
          <h3>Your Portfolio is empty!</h3>
        )}
      </section>
    </>
  );
}

export default Dashboard;
