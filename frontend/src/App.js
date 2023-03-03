import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import portfolioReducer from './components/Portfolio/PortfolioReducer';

const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
  },
});

function App() {
  return (
    <>
      {/* <Provider store={store}> */}
      <Router>
        <div className='container'>
          <Header />
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
      {/* </Provider> */}
    </>
  );
}

export default App;
