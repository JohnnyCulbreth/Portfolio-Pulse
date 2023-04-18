import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <header
      id='header'
      className={`fixed-top d-flex align-items-center header-transparent ${
        scrolled ? 'header-scrolled' : ''
      }`}
      style={{
        height: scrolled ? '60px' : '80px',
        transition: 'all 0.5s',
        zIndex: '997',
        backgroundColor: 'rgba(1, 4, 136, 0.9)',
      }}
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
