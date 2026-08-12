function FooterBar() {
  const CurrentYear = new Date();
  const getCurrentYear = CurrentYear.getFullYear();

  return (
    <>
      <footer className="h-max w-screen flex flex-row justify-evenly items-start bg-gray-100 pt-[50px] mt-[80px] pb-[20px] rounded-tl-[100px] rounded-tr-[100px]">
        <div className="flex flex-col justify-start items-start gap-4">
          <a
            className="uppercase tracking-tight leading-6.5 text-4xl font-semibold"
            href="/"
          >
            ten11
          </a>
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
              <a className="underline" href="/">
                Home
              </a>
            </li>
            <li>
              <a className="underline" href="/category">
                Category
              </a>
            </li>
            <li>
              <a className="underline" href="/brand">
                Brand
              </a>
            </li>
            <li>
              <a className="underline" href="/explore">
                Explore
              </a>
            </li>
            <li>
              <a href="/freeDelivery" className="underline">
                Free Delivery
              </a>
            </li>
            <li>
              <a href="/shopAll" className="underline">
                Shop all
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-col justify-start items-start gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Cushrefmer service
          </h1>
          <ul className="list-none flex flex-col justify-start items-start gap-1.5">
            <li>
              <a className="underline" href="#">
                My Account
              </a>
            </li>
            <li>
              <a className="underline" href="#">
                Order Tracking
              </a>
            </li>
            <li>
              <a className="underline" href="#">
                Shopping Policy
              </a>
            </li>
            <li>
              <a className="underline" href="#">
                Return Policy
              </a>
            </li>
            <li>
              <a className="underline" href="#">
                FAQ
              </a>
            </li>
            <li>
              <a className="underline" href="#">
                Privacy & Policy
              </a>
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
