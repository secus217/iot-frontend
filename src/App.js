import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../src/Pages/Home';
import '@fortawesome/fontawesome-free/css/all.min.css';
import History from '../src/Pages/History';
function App() {
  return (
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
              <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
