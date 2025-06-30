// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup.tsx';
import Signin from './pages/Signin.tsx';
import Dashboard from './pages/Dashboard.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}

