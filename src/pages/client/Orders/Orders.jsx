import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  collection,
  onSnapshot,
  query,
  updateDoc,
  doc,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../../lib/firebaseClient';
import { useStoreSettings } from '../../../hooks/useStoreSettings';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { formatPrice } = useStoreSettings();
  useEffect(() => {
    if (!auth.currentUser) return undefined;
    return onSnapshot(
      query(
        collection(db, 'orders'),
        where('ownerId', '==', auth.currentUser.uid),
      ),
      (snapshot) =>
        setOrders(
          snapshot.docs
            .map((item) => ({ id: item.id, ...item.data() }))
            .sort(
              (a, b) =>
                (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
            ),
        ),
    );
  }, []);
  if (!auth.currentUser) return <Navigate to="/login" replace />;
  return (
    <section className="mx-auto min-h-screen max-w-5xl px-5 pb-16 pt-24">
      <p className="text-sm text-slate-500">Your account</p>
      <h1 className="text-4xl font-semibold">Purchase history</h1>
      <div className="mt-7 space-y-4">
        {orders.length ? (
          orders.map((order) => (
            <article
              className="rounded-3xl border border-slate-200 p-5"
              key={order.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <b>Order #{order.id.slice(0, 7)}</b>
                  <p className="text-sm text-slate-500">
                    {order.paymentLabel} ·{' '}
                    {order.createdAt?.toDate?.().toLocaleDateString() ||
                      'Just placed'}
                  </p>
                </div>
                <Status status={order.status} />
              </div>
              <div className="mt-4 divide-y">
                {(order.items || []).map((item, index) => (
                  <div
                    className="flex justify-between gap-4 py-2 text-sm"
                    key={`${item.id}-${index}`}
                  >
                    <span>
                      {item.quantity} × {item.title}
                    </span>
                    <span>
                      {formatPrice(
                        item.price * (1 - item.dis / 100) * item.quantity,
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <b>Total: {formatPrice(order.total)}</b>
                {order.status === 'pending' && (
                  <button
                    onClick={() =>
                      updateDoc(doc(db, 'orders', order.id), {
                        status: 'cancelled',
                      })
                    }
                    className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-700"
                  >
                    Cancel order
                  </button>
                )}
              </div>
            </article>
          ))
        ) : (
          <p className="rounded-3xl bg-slate-100 p-8 text-slate-500">
            You have not placed any orders yet.
          </p>
        )}
      </div>
    </section>
  );
}
function Status({ status = 'pending' }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm ${status === 'completed' ? 'bg-emerald-100 text-emerald-700' : status === 'cancelled' ? 'bg-red-100 text-red-700' : status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}
    >
      {status}
    </span>
  );
}
