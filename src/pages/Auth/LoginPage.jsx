// import { a } from 'react-router-dom';

function LoginPage() {
  return (
    <section className="bg-[#f2f2f6] w-screen h-screen scroll-smooth pb-12 flex justify-center items-center">
      <nav className="fixed top-0 left-0 right-0 h-[60px] flex items-center justify-between px-5 bg-white ">
        <a href="/" className="text-black no-underline">
          <i className="bi bi-arrow-bar-left"></i> Back to home page
        </a>
        <a href="login.html">
          <h1 className="uppercase text-[40px] font-bold tracking-[-2px]">
            solis <span className="text-[#d3d3d6] ml-2">skin</span>
          </h1>
        </a>
        <h3 className="text-[20px] font-medium">Sign in to SOLIS SKIN</h3>
      </nav>
      <section className="flex flex-col items-center justify-center pt-[100px] gap-5">
        <form
          action={'#'}
          method="POST"
          className="flex flex-col items-center gap-2.5 p-5 bg-white rounded-[45px]"
        >
          <h3 className="text-[24px] mb-1">Enter your information</h3>
          <div className="w-full h-[1px] mt-[5px] mb-[10px] bg-[repeating-linear-gradient(to_right,#d6d6d6_0px,#d6d6d6_4px,transparent_5px,transparent_8px)]"></div>
          <div className="w-full flex flex-col items-center gap-2.5">
            <label htmlFor="email" className="cursor-pointer w-full text-left">
              .Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              className="w-full h-[50px] bg-[#f2f2f6] text-base rounded-full px-4 outline-transparent focus:outline-1 focus:outline-black"
            />
            <label
              htmlFor="password"
              className="cursor-pointer w-full text-left"
            >
              .Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              className="w-full h-[50px] bg-[#f2f2f6] text-[16px] rounded-full px-4 outline-transparent focus:outline-1 focus:outline-black"
            />
          </div>
          <button
            type="submit"
            className="w-[640px] h-[50px] bg-black text-white text-[20px] rounded-full cursor-pointer mt-5"
          >
            <i className="bi bi-person-fill"></i> Login Now
          </button>
        </form>

        {/* <div className="relative w-[640px] h-[20px] mt-5">
          <div className="w-full h-[1px] bg-gray-300 opacity-50"></div>

          <p className="absolute left-1/2 -translate-x-1/2 bottom-1/2 px-2 bg-greyTint text-[18px]">
            or
          </p>
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <div className="relative w-[640px] h-[50px] bg-white rounded-full flex items-center justify-center text-[20px] cursor-pointer">
            <i className="bi bi-google absolute left-2.5 text-[30px] flex justify-center items-center"></i>
            <p>Login with Google</p>
          </div>

          <div className="relative w-[640px] h-[50px] bg-white rounded-full flex items-center justify-center text-[20px] cursor-pointer">
            <i className="bi bi-facebook absolute left-2.5 text-[30px] flex justify-center items-center"></i>
            <p>Login with Facebook</p>
          </div>
        </div> */}
        <h3 className="text-[20px]">
          Don't Have an Account?{' '}
          <a href="/registerPage" className="underline font-semibold">
            Register
          </a>
        </h3>
      </section>
    </section>
  );
}

export default LoginPage;
