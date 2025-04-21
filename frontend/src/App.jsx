import './assets/global-styles/app.css';
import Homepage from './pages/Homepage/Homepage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import LoginPage from './pages/Login/LoginPage';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/Register/RegisterPage';

function App() {

  return (
    <>
    <div className='body'>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/:username/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
    </>
  )
}

export default App