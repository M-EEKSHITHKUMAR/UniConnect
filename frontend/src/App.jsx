import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './app/store';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import TrendingPage from './pages/TrendingPage';
import ClubsPage from './pages/ClubsPage';
import AlumniPage from './pages/AlumniPage';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style:{ borderRadius:'12px', fontSize: '14px'},
        }}
        />
        <Routes>
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/signup'element={<SignupPage/>} />
          <Route 
            path='/' element={
              <ProtectedRoute>
                <Navbar/>
                <HomePage/>
              </ProtectedRoute>
            }
          />
          <Route 
            path='/trending' element={
              <ProtectedRoute>
                <Navbar/>
                <TrendingPage/>
              </ProtectedRoute>
            }
          />
          <Route 
            path='/clubs' element={
              <ProtectedRoute>
                <Navbar/>
                <ClubsPage/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/alumni' element={
              <ProtectedRoute>
                <Navbar/>
                <AlumniPage/>
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;