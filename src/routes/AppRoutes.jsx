import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import FooterBar from '../components/layout/FooterBar';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import Details from '../pages/client/Details/Details';
import IndexPage from '../pages/client/Home/IndexPage';
import Men from '../pages/client/Product/Men';
import Women from '../pages/client/Product/Women';
import Kids from '../pages/client/Product/Kids';
import Accessories from '../pages/client/Product/Accessories';
import AdminDashboard from '../pages/admin/AdminDashboard';

function StoreLayout() {
  const [openFav, setOpenFav] = useState(false);

  return (
    <>
      <Navbar openFav={openFav} setOpenFav={setOpenFav} />
      <main>
        <Outlet />
      </main>
      <FooterBar />
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<IndexPage />} />
        <Route path="men" element={<Men />} />
        <Route path="women" element={<Women />} />
        <Route path="kids" element={<Kids />} />
        <Route path="accessories" element={<Accessories />} />
        <Route path="products/:productId" element={<Details />} />
      </Route>

      <Route path="login" element={<LoginPage />} />
      <Route path="loginPage" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="registerPage" element={<RegisterPage />} />
      <Route path="admin/*" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
