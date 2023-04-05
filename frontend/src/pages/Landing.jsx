import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className='container'>
      <div className='row justify-content-between'>
        <div className='col-lg-7 pt-5 pt-lg-0 order-2 order-lg-1 d-flex align-items-center'>
          <div data-aos='zoom-out'>
            <h1>
              Portfolio <span>Pulse</span>
            </h1>
            <h2>The Smart Way to Monitor and Optimize Your Financial Future</h2>
            <div className='text-center text-lg-start'>
              <Link to='/login' className='btn-get-started scrollto'>
                Log In
              </Link>
            </div>
          </div>
        </div>
        <div
          className='col-lg-4 order-1 order-lg-2 hero-img'
          data-aos='zoom-out'
          data-aos-delay={300}
        >
          <img src='assets/img/pulse2.png' className='img-fluid animated' alt />
        </div>
      </div>
    </div>
  );
};

export default Landing;
