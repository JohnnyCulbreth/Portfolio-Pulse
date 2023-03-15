// import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import Spinner from '../components/Spinner';
import Portfolio from '../components/Portfolio';

function Dashboard() {
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  // const { isLoading, isError, message } = useEffect(() => {
  //   if (isError) {
  //     console.log(message);
  //   }
  if (!user) {
    navigate('/login');
  }

  //   return () => {
  //     // dispatch(reset());
  //     // ^ This was causing logout to go into an infinite loop and crash the app -- revisit
  //   };
  // }, [user, navigate, isError, message, dispatch]);

  // if (isLoading) {
  //   return <Spinner />;
  // }

  return (
    <>
      <section className='heading'>
        <h1> Welcome {user && user.name} </h1>
        <Portfolio />
      </section>
    </>
  );
}

export default Dashboard;
