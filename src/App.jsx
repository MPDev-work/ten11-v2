import Navbar from './components/layout/Navbar';
import FooterBar from './components/layout/FooterBar';
// import IndexPage from './pages/client/Home/IndexPage';
// import Details from './pages/client/Details/Details';
import LoginPage from './pages/Auth/LoginPage';
import Men from './pages/client/Product/Men';
import RegisterPage from './pages/Auth/RegisterPage';
import { useState } from 'react';

function App() {
  const [openFav, setOpenFav] = useState(false);
  return (
    <>
      <Navbar setOpenFav={setOpenFav} openFav={openFav} />
      {/* <IndexPage openFav={openFav} /> */}
      <LoginPage />
      <FooterBar />
    </>
  );
}

export default App;
