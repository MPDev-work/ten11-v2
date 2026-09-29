import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { ShopProvider } from './context/ShopContext.jsx';
import ScrollToTop from './routes/ScrollToTop.jsx';

function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <ScrollToTop />
        <AppRoutes />
      </ShopProvider>
    </BrowserRouter>
  );
}

export default App;
// this is just a test
