import { Link } from 'react-router-dom';

function FooterBar() {
  const CurrentYear = new Date();
  const getCurrentYear = CurrentYear.getFullYear();

  return (
    <>
      <footer className="h-max w-screen flex flex-row justify-evenly items-start bg-gray-100 pt-12 mt-10 pb-5 rounded-tl-[100px] rounded-tr-[100px]">
        <div className="flex flex-col justify-start items-start gap-4">
          <Link
            className="uppercase tracking-tight leading-6.5 text-4xl font-semibold"
            to="/"
          >
            ten11
          </Link>
          <p className="text-sm w-[260px] text-gray-600">
            Your trusted destination for healthy and glowing skin. 100%
            authentic skincare products.
          </p>
          <div className="flex flex-col justify-center items-start gap-1">
            <a
              href="https://web.facebook.com/saltenten"
              target="_blank"
              className="flex flex-col justify-start items-start gap-1.5"
            >
              <div className="flex flex-row justify-center items-center gap-2">
                <i className="bi bi-facebook text-xl"></i>
                <p className="text-lg">Facebook</p>
              </div>
            </a>
            <a
              href="#"
              target="_blank"
              className="flex flex-row justify-center items-center gap-2"
            >
              <i className="bi bi-tiktok text-xl"></i>
              <p className="text-lg">Tiktok</p>
            </a>
            <a
              href="#"
              target="_blank"
              className="flex flex-row justify-center items-center gap-2"
            >
              <i className="bi bi-instagram text-xl"></i>
              <p className="text-lg">Instagram</p>
            </a>
            <a
              href="#"
              target="_blank"
              className="flex flex-row justify-center items-center gap-2"
            >
              <i className="bi bi-twitter-x text-xl"></i>
              <p className="text-lg">X</p>
            </a>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Quick link</h1>
          <ul className="list-none flex flex-col justify-start items-start gap-1.5">
            <li>
              <Link className="underline" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="underline" to="/men">
                Men
              </Link>
            </li>
            <li>
              <Link className="underline" to="/women">
                Women
              </Link>
            </li>
            <li>
              <Link className="underline" to="/kids">
                Kids
              </Link>
            </li>
            <li>
              <Link to="/accessries" className="underline">
                Accessories
              </Link>
            </li>
            <li>
              <Link to="/brands" className="underline">
                Brands
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col justify-start items-start gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Cushrefmer service
          </h1>
          <ul className="list-none flex flex-col justify-start items-start gap-1.5">
            <li>
              <Link className="underline" to="#">
                My Account
              </Link>
            </li>
            <li>
              <Link className="underline" to="#">
                Order Tracking
              </Link>
            </li>
            <li>
              <Link className="underline" to="#">
                Shopping Policy
              </Link>
            </li>
            <li>
              <Link className="underline" to="#">
                Return Policy
              </Link>
            </li>
            <li>
              <Link className="underline" to="#">
                FAQ
              </Link>
            </li>
            <li>
              <Link className="underline" to="#">
                Privacy & Policy
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col justify-start items-start gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Contact-Info
          </h1>
          <ul className="list-none flex flex-col justify-start items-start gap-1.5">
            <li className="underline cursor-pointer">
              📍 Phnom Penh, Cambodia
            </li>
            <li className="underline cursor-pointer">📞 +855 XX XXX XXX</li>
            <li className="underline cursor-pointer">
              📧 support@solisskin.com
            </li>
            <li className="underline cursor-pointer">
              🕒 Mon - Sat (8:00AM - 6:00PM)
            </li>
            <li>© {getCurrentYear} SOLIS SKIN - Alright reversed.</li>
          </ul>
        </div>
      </footer>
    </>
  );
}

export default FooterBar;
