import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, rtdb } from '../../lib/firebaseClient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { ChevronLeft } from 'lucide-react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const token = await credential.user.getIdTokenResult();
      let role = token.claims.role;

      if (!role) {
        const profile = await get(ref(rtdb, `users/${credential.user.uid}`));
        role = profile.exists()
          ? profile.val().role || profile.val().roles
          : '';
      }

      const isAdmin = Array.isArray(role)
        ? role.some((item) => String(item).toLowerCase() === 'admin')
        : String(role).toLowerCase() === 'admin';
      navigate(isAdmin || token.claims.admin === true ? '/admin' : '/');
    } catch (authError) {
      console.error('Firebase login error:', authError);
      window.alert(authError.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-[#f2f2f6] w-screen h-screen scroll-smooth pb-12 flex justify-center items-center">
      <nav className="fixed z-20 top-0 inset-x-0 h-14 flex items-center justify-between px-2.5 lg:px-5 bg-white ">
        <Link
          to="/"
          className="hidden text-black no-underline lg:flex items-center justify-center"
        >
          <ChevronLeft size={20} /> Back to home page
        </Link>
        <Link
          to="/"
          className="lg:hidden text-black no-underline flex items-center justify-center"
        >
          <ChevronLeft size={20} /> Back
        </Link>
        <Link to="/login" className="absolute right-1/2 translate-x-1/2">
          <h1 className="uppercase text-[40px] font-bold tracking-[-2px]">
            Ten11
          </h1>
        </Link>
        <h3 className="hidden lg:block text-[20px] font-medium">
          Sign in to Ten11
        </h3>
      </nav>
      <section className="w-screen flex flex-col items-center justify-center pt-[100px] gap-5">
        <form
          onSubmit={handleLogin}
          className="lg:w-[680px] w-[calc(100%-20px)] flex flex-col items-center gap-2.5 p-5 bg-white rounded-[45px]"
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
            className="w-[calc(100vw-60px)] lg:w-[640px] h-[50px] bg-black text-white text-[20px] rounded-full cursor-pointer mt-5"
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
