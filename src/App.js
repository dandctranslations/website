import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import QuotePage from './pages/QuotePage';
import InvoicePage from './pages/InvoicePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/quote" element={<QuotePage />} />
      <Route path="/invoice/new" element={<InvoicePage />} />
    </Routes>
  );
}

export default App;
