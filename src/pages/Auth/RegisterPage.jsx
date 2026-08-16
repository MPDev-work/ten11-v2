import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, rtdb } from '../../lib/firebaseClient';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  updateProfile,
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleRegister(event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      window.alert('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      window.alert('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    let credential;
    try {
      credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, {
        displayName: `${firstName} ${lastName}`.trim(),
      });
      // Ensures Realtime Database receives the new sign-in token before its rules run.
      await credential.user.getIdToken();
      await set(ref(rtdb, `users/${credential.user.uid}`), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        displayName: `${firstName} ${lastName}`.trim(),
        email: credential.user.email,
        role: 'client',
        createdAt: new Date().toISOString(),
      });
      await setDoc(doc(db, 'customers', credential.user.uid), {
        name: `${firstName} ${lastName}`.trim(),
        email: credential.user.email,
        createdAt: serverTimestamp(),
      });
      navigate('/');
    } catch (authError) {
      console.error('Firebase registration error:', authError);
      if (credential?.user) {
        try {
          await deleteUser(credential.user);
        } catch {
          // The original error is the useful one to show to the customer.
        }
      }
      window.alert(
        authError.code === 'PERMISSION_DENIED'
          ? 'Your Realtime Database rules are blocking registration. Publish database.rules.json in the Firebase console, then try again.'
          : authError.message.replace('Firebase: ', ''),
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="bg-[#f2f2f6] w-screen min-h-screen overflow-x-hidden scroll-smooth pb-12">
      <nav className="fixed top-0 left-0 right-0 h-[60px] flex items-center justify-between px-5 bg-white">
        <Link to="/" className="text-black no-underline">
          <i className="bi bi-arrow-bar-left"></i> Back to home page
        </Link>

        <a href="register.html">
          <h1 className="uppercase text-[40px] font-bold tracking-[-2px] cursor-pointer">
            Ten11
          </h1>
        </a>

        <h3 className="text-[20px] font-medium">Sign up to Ten11</h3>
      </nav>

      <section className="flex flex-col items-center justify-center mt-[100px] gap-5">
        <form
          onSubmit={handleRegister}
          className="flex flex-col items-center gap-2.5 p-5 bg-white rounded-[45px]"
        >
          <h3 className="text-[24px] mb-1">Customer information</h3>

          <div className="w-full h-[1px] mt-[5px] mb-[10px] bg-[repeating-linear-gradient(to_right,#d6d6d6_0px,#d6d6d6_4px,transparent_5px,transparent_8px)]"></div>

          <div className="flex w-[600px] gap-5">
            <div className="flex flex-col w-1/2 gap-2.5">
              <label className="w-full text-left">
                .First name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
                className="w-full h-[50px] bg-[#f2f2f6] text-[16px] rounded-full px-4 outline-transparent focus:outline-1 focus:outline-black"
              />
            </div>

            <div className="flex flex-col w-1/2 gap-2.5">
              <label className="w-full text-left">
                .Last name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                required
                className="w-full h-[50px] bg-[#f2f2f6] text-[16px] rounded-full px-4 outline-transparent focus:outline-1 focus:outline-black"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2.5">
            {/* <label className="w-full text-left">
              .Phone number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Phone number"
              className="w-[600px] h-[50px] bg-[#f2f2f6] text-[16px] rounded-full px-4 outline-transparent focus:outline-1 focus:outline-black"
            /> */}

            <label className="w-full text-left">
              .Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-[600px] h-[50px] bg-[#f2f2f6] text-[16px] rounded-full px-4 outline-transparent focus:outline-1 focus:outline-black"
            />

            <label className="w-full text-left">
              .Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-[600px] h-[50px] bg-[#f2f2f6] text-[16px] rounded-full px-4 outline-transparent focus:outline-1 focus:outline-black"
            />

            <label className="w-full text-left">
              .Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              className="w-[600px] h-[50px] bg-[#f2f2f6] text-[16px] rounded-full px-4 outline-transparent focus:outline-1 focus:outline-black"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] bg-black text-white text-[20px] rounded-full cursor-pointer mt-5"
          >
            <i className="bi bi-person-fill"></i>{' '}
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* <div className="flex flex-col items-center gap-2.5 p-5 bg-white rounded-[45px]">
          <h3 className="text-[24px] mb-1">Customer Address</h3>

          <div className="w-full h-[1px] mt-[5px] mb-[10px] bg-[repeating-linear-gradient(to_right,#d6d6d6_0px,#d6d6d6_4px,transparent_5px,transparent_8px)]"></div>

          <div className="flex flex-col items-center gap-2.5">
            <label className="w-full text-left">
              .Current Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="street, apt, suit, floor, city, country"
              className="w-[600px] h-[50px] bg-[#f2f2f6] text-[16px] rounded-full px-4 outline-transparent focus:outline-1 focus:outline-black"
            />

            <label className="w-full text-left">
              .Phone number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Phone number"
              className="w-[600px] h-[50px] bg-[#f2f2f6] text-[16px] rounded-full px-4 outline-transparent focus:outline-1 focus:outline-black"
            />
          </div>
        </div> */}

        <div className="relative w-[640px] h-[20px] mt-5">
          <div className="w-full h-[1px] bg-gray-300 opacity-50"></div>

          <p className="absolute left-1/2 -translate-x-1/2 bottom-1/2 px-2 bg-[#f2f2f6] text-[18px]">
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
        </div>

        <h3 className="text-[20px]">
          Have an Account?
          <Link to="/login" className="underline font-semibold">
            Login
          </Link>
        </h3>
      </section>
    </section>
  );
}
export default RegisterPage;
