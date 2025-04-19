import './assets/global-styles/app.css';
import Homepage from './pages/Homepage/Homepage';
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
    <div className='body'>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/*<Route path="/username/profile" element={<ProfilePage />} />*/}
      </Routes>
    </div>
    </>
  )
}

export default App