import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebaseClient';
import { signInWithEmailAndPassword } from 'firebase/auth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (authError) {
      console.error('Firebase login error:', authError);
      window.alert(authError.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-[#f2f2f6] w-screen h-screen scroll-smooth pb-12 flex justify-center items-center">
      <nav className="fixed top-0 left-0 right-0 h-[60px] flex items-center justify-between px-5 bg-white ">
        <Link to="/" className="text-black no-underline">
          <i className="bi bi-arrow-bar-left"></i> Back to home page
        </Link>
        <a href="login.html">
          <h1 className="uppercase text-[40px] font-bold tracking-[-2px]">
            solis <span className="text-[#d3d3d6] ml-2">skin</span>
          </h1>
        </a>
        <h3 className="text-[20px] font-medium">Sign in to SOLIS SKIN</h3>
      </nav>
      <section className="flex flex-col items-center justify-center pt-[100px] gap-5">
        <form
          onSubmit={handleLogin}
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full h-[50px] bg-[#f2f2f6] text-[16px] rounded-full px-4 outline-transparent focus:outline-1 focus:outline-black"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-[640px] h-[50px] bg-black text-white text-[20px] rounded-full cursor-pointer mt-5"
          >
            <i className="bi bi-person-fill"></i>{' '}
            {loading ? 'Logging in...' : 'Login Now'}
          </button>
        </form>
        <h3 className="text-[20px]">
          Don't Have an Account?{' '}
          <Link to="/register" className="underline font-semibold">
            Register
          </Link>
        </h3>
      </section>
    </section>
  );
}

export default LoginPage;
