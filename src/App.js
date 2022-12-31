import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import './App.css';
import AppHeader from './components/AppHeader/AppHeader';
import AppLayout from './components/AppLayout/AppLayout';
import Dashboard from './containers/Dashboard/Dashboard';
import Tournament from './containers/Tournament/Tournament';

function App() {
  return (
    <BrowserRouter>
      <header>
        <AppHeader />
      </header>
      
      <AppLayout>
        <Routes>
          <Route path="/" element={ <Dashboard /> } />
          <Route path="/tournament/:id" element={ <Tournament /> } />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
