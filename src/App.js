import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import QuotePage from './pages/QuotePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/quote" element={<QuotePage />} />
    </Routes>
  );
}

export default App;
