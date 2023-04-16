import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <header
      id='header'
      className='fixed-top d-flex align-items-center header-transparent'
    >
      <div className='container d-flex align-items-center justify-content-between'>
        <div className='logo'>
          <h1>
            <Link to='/'>Portfolio Pulse</Link>
          </h1>
        </div>

        <nav id='navbar' className='navbar'>
          <ul>
            <li>
              <Link className='nav-link scrollto active' to='/'>
                Home
              </Link>
            </li>
            {user ? (
              <li>
                <Link className='nav-link scrollto' onClick={onLogout} to='/'>
                  Logout
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link className='nav-link scrollto' to='/register'>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
          <i className='bi bi-list mobile-nav-toggle'></i>
        </nav>
      </div>
    </header>
  );
}

export default Header;
