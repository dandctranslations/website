import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import QuotePage from './pages/QuotePage';
import PayPage from './pages/PayPage';
import NewPaymentLinkPage from './pages/NewPaymentLinkPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/quote" element={<QuotePage />} />
      <Route path="/pay" element={<PayPage />} />
      <Route path="/pay/new" element={<NewPaymentLinkPage />} />
    </Routes>
  );
}

export default App;
