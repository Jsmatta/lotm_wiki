import { useState } from 'preact/hooks';
import './index.css';
import Home from './pages/home.jsx'; // Import the Home component

export function App() {
  return (
    <div>
      <Home /> {/* Use the Home component */}
    </div>
  );
}

