import { useState, useEffect } from 'react';
import { AiOutlineStock } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/dashboard');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div style={{ alignItems: 'center', height: '53vh', marginTop: '10vh' }}>
      <section className='heading'>
        <h1>
          <AiOutlineStock /> Log in
        </h1>
        <p>Log in to start building your portfolio</p>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              placeholder='Enter your email'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              placeholder='Enter password'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <button
              typeof='submit'
              className='btn btn-block'
              style={{
                backgroundColor: '#7fa136',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: '500',
                fontSize: '16px',
                letterSpacing: '1px',
                display: 'inlineBlock',
                padding: '10px 30px',
                borderRadius: '50px',
                transition: '0.5s',
                color: '#fff',
                width: '30%',
                margin: 'auto',
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Login;
