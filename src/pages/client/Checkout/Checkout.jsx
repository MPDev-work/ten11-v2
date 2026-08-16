import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../lib/firebaseClient';
import { useShop } from '../../../hooks/useShop';
import { useStoreSettings } from '../../../hooks/useStoreSettings';
import { cardPayments, localBankPayments } from '../../../data/paymentSettings';

const initialDetails = { fullName: '', phone: '', address: '' };

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useShop();
  const { formatPrice } = useStoreSettings();
  const [details, setDetails] = useState(initialDetails);
  const [paymentMethod, setPaymentMethod] = useState('aba');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          Number(item.price || 0) *
            (1 - Number(item.dis || 0) / 100) *
            item.quantity,
        0,
      ),
    [cart],
  );
  const bank = localBankPayments.find((item) => item.id === paymentMethod);

  if (!auth.currentUser) return <Navigate to="/login" replace />;
  if (!cart.length) return <Navigate to="/" replace />;

  const placeOrder = async (event) => {
    event.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const order = {
        ownerId: auth.currentUser.uid,
        customerName: details.fullName.trim(),
        customerEmail: auth.currentUser.email || '',
        phone: details.phone.trim(),
        address: details.address.trim(),
        paymentMethod,
        paymentLabel:
          [...localBankPayments, ...cardPayments].find(
            (item) => item.id === paymentMethod,
          )?.name || paymentMethod,
        items: cart.map(
          ({
            id,
            title,
            src,
            imageUrl,
            price,
            dis,
            quantity,
            size,
            color,
          }) => ({
            id,
            title,
            src: src || imageUrl || '',
            price: Number(price || 0),
            dis: Number(dis || 0),
            quantity,
            size: size || '',
            color: color || '',
          }),
        ),
        total,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'orders'), order);
      clearCart();
      navigate('/orders', { replace: true });
    } catch (submitError) {
      console.error('Unable to create order:', submitError);
      setError('Your order could not be placed. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <section className="min-h-screen w-screen px-5 pb-16 pt-24">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Secure checkout</p>
          <h1 className="text-2xl lg:text-4xl font-semibold">
            Complete your order
          </h1>
        </div>
        <Link className="text-sm underline" to="/">
          Continue shopping
        </Link>
      </div>
      <form
        onSubmit={placeOrder}
        className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="space-y-6">
          <section className="rounded-[35px] bg-[#f2f2f6] p-5">
            <h2 className="text-xl font-semibold">Delivery details</h2>
            <div className="mt-4 grid gap-4">
              <Input
                label="Full name"
                value={details.fullName}
                onChange={(value) =>
                  setDetails({ ...details, fullName: value })
                }
              />
              <Input
                label="Phone number"
                type="tel"
                value={details.phone}
                onChange={(value) => setDetails({ ...details, phone: value })}
              />
              <label className="text-sm font-medium">
                Full address
                <textarea
                  required
                  value={details.address}
                  onChange={(e) =>
                    setDetails({ ...details, address: e.target.value })
                  }
                  rows="3"
                  className="mt-2 w-full rounded-2xl bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  placeholder="House number, street, city and province"
                />
              </label>
            </div>
          </section>
          <section className="rounded-[35px] bg-[#f2f2f6] p-5">
            <h2 className="text-xl font-semibold">Payment method</h2>
            <p className="mt-1 text-sm text-slate-500">
              Bank QR is static for now — edit the details in paymentSettings.js
              and replace the QR image when ready.
            </p>
            <div className="mt-4 grid gap-2">
              {localBankPayments.map((item) => (
                <PaymentChoice
                  key={item.id}
                  item={item}
                  selected={paymentMethod}
                  setSelected={setPaymentMethod}
                />
              ))}
              <div className="my-1 border-t border-slate-200" />
              {cardPayments.map((item) => (
                <PaymentChoice
                  key={item.id}
                  item={item}
                  selected={paymentMethod}
                  setSelected={setPaymentMethod}
                />
              ))}
            </div>
            {bank && (
              <div className="mt-4 rounded-2xl bg-white p-4 sm:flex sm:items-center sm:gap-5">
                <img
                  src={bank.qrImage}
                  className="mx-auto h-40 w-40"
                  alt={`${bank.name} static QR code`}
                />
                <div>
                  <b>{bank.name} QR payment</b>
                  <p className="mt-1 text-sm text-slate-500">
                    Account name: {bank.accountName}
                    <br />
                    Account number: {bank.accountNumber}
                  </p>
                  <p className="mt-3 text-xs text-amber-700">
                    This is a placeholder QR. Replace it with your own bank QR
                    before accepting payments.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
        <aside className="h-fit rounded-[35px] border border-slate-200 p-5 lg:sticky lg:top-20">
          <h2 className="text-xl font-semibold">Order summary</h2>
          <div className="mt-4 divide-y divide-gray-400 divide-dashed">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="flex gap-3 py-3"
              >
                <img
                  className="h-16 w-14 rounded-lg object-cover"
                  src={item.src || item.imageUrl}
                  alt=""
                />
                <div className="min-w-0 flex-1">
                  <b className="block truncate">{item.title}</b>
                  <p className="text-sm text-slate-500">
                    {item.quantity} ×{' '}
                    {formatPrice(
                      Number(item.price || 0) *
                        (1 - Number(item.dis || 0) / 100),
                    )}
                  </p>
                </div>
                <span>
                  {formatPrice(
                    Number(item.price || 0) *
                      (1 - Number(item.dis || 0) / 100) *
                      item.quantity,
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button
            disabled={placing}
            className="cursor-pointer mt-5 w-full rounded-full bg-black py-3 font-medium text-white disabled:opacity-60"
          >
            {placing ? 'Placing order…' : `Place order · ${formatPrice(total)}`}
          </button>
        </aside>
      </form>
    </section>
  );
}

function Input({ label, type = 'text', value, onChange }) {
  return (
    <label className="text-sm font-medium">
      {label}
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-full bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
      />
    </label>
  );
}
function PaymentChoice({ item, selected, setSelected }) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 ${selected === item.id ? 'border-blue-500 border-dashed bg-blue-500/5' : 'border-transparent bg-white/60'}`}
    >
      <span
        className={`font-medium ${selected === item.id ? `text-blue-500` : `text-black`}`}
      >
        {item.name}
      </span>
      <input
        type="radio"
        name="paymentMethod"
        value={item.id}
        checked={selected === item.id}
        onChange={() => setSelected(item.id)}
      />
    </label>
  );
}
