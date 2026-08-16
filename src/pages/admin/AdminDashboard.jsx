import { useEffect, useState } from 'react';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  addDoc,
  collection,
  deleteField,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  Box,
  CircleHelp,
  CreditCard,
  House,
  LogOut,
  Menu,
  PackagePlus,
  Pencil,
  PlusCircle,
  ShoppingBag,
  Trash2,
  UserCog,
  Users,
  X,
} from 'lucide-react';
import { auth, db } from '../../lib/firebaseClient';
import { brandData } from '../../data/brands';
import { useStoreSettings } from '../../hooks/useStoreSettings';

const navGroups = [
  [
    'Main menu',
    [
      ['/admin', 'Overview', House],
      ['/admin/orders', 'Orders', ShoppingBag],
      ['/admin/products', 'All products', Box],
      ['/admin/products/new', 'Add product', PackagePlus],
      ['/admin/customers', 'Customers', Users],
      // ['/admin/profile', 'Edit profile', UserCog],
    ],
  ],
  [
    'Account Info',
    [
      ['/admin/profile', 'Edit profile', UserCog],
      ['/admin/help', 'Help center', CircleHelp],
    ],
  ],
  // ['Support', [['/admin/help', 'Help center', CircleHelp]]],
];
const emptyProduct = {
  title: '',
  storeID: '',
  category: '',
  src: '',
  price: '',
  dis: 0,
  colors: [],
  size: [],
  stock: 0,
};
const productColors = [
  'white',
  'black',
  'gray',
  'red',
  'blue',
  'green',
  'brown',
  'beige',
  'pink',
];
const productSizes = ['S', 'M', 'L', 'XL', 'XXL', 'Free size'];
const productCategories = [
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
  { label: 'Kids', value: 'kids' },
  { label: 'Accessory', value: 'accessory' },
  { label: 'Z.Home', value: 'z.home' },
];
const storeOptions = brandData.map((brand) => ({
  label: brand.name,
  value: brand.name.toLowerCase(),
}));
const emptyCustomer = { name: '', email: '', phone: '' };
const button =
  'inline-flex items-center justify-center gap-1.5 rounded-full bg-black px-5 py-3 text-sm text-white transition hover:bg-slate-700 disabled:opacity-60';

const input =
  'mt-2 box-border w-full rounded-full bg-white px-4 py-3 outline-none ring-0 focus:ring-2 focus:ring-slate-300';

function useCollection(name, field = 'createdAt') {
  const [items, setItems] = useState([]);
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, name), orderBy(field, 'desc')),
        (snapshot) =>
          setItems(
            snapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
          ),
      ),
    [name, field],
  );
  return items;
}

function AdminLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { storeName } = useStoreSettings();
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await auth.signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Firebase logout error:', error);
      window.alert('Could not log out. Please try again.');
      setLoggingOut(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#f2f2f6] text-slate-900">
      <header className="fixed inset-x-0 top-0 px-5 z-30 flex h-16 items-center justify-between bg-[#f2f2f6]/95 backdrop-blur">
        <Link
          to="/admin"
          className="text-2xl font-semibold tracking-tight uppercase"
        >
          {storeName}
        </Link>
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-500 text-white">
            A
          </span>
          <span className="flex flex-col text-sm">
            <b>{auth.currentUser?.displayName || 'Admin'}</b>
            <small className="text-blue-500">Admin</small>
          </span>
        </div>
      </header>
      <aside
        className={`fixed bottom-0 left-0 top-16 z-20 w-64 overflow-y-auto bg-[#f2f2f6] p-3 transition-transform md:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {navGroups.map(([label, items]) => (
          <section className="mb-5" key={label}>
            <p className="mb-2 px-2 text-sm text-slate-400">{label}</p>
            <div className="flex flex-col gap-1 rounded-[25px] bg-white p-[5px]">
              {items.map(([to, title, Icon]) => (
                <Link
                  key={to}
                  onClick={() => setMenuOpen(false)}
                  to={to}
                  className={`flex h-10 items-center gap-3 rounded-[30px] px-3 text-sm transition ${location.pathname === to ? 'bg-black text-white' : 'text-slate-500 hover:bg-black hover:text-white'}`}
                >
                  <Icon size={17} />
                  {title}
                </Link>
              ))}
            </div>
          </section>
        ))}
        <div className="absolute bottom-5 w-[calc(100%-20px)] p-1.5 bg-white rounded-full">
          <button
            type="button"
            disabled={loggingOut}
            onClick={handleLogout}
            className="cursor-pointer flex h-10 w-full items-center gap-3 rounded-[30px] px-3 text-sm text-slate-500 hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={17} />
            {loggingOut ? 'Logging out…' : 'Log out'}
          </button>
        </div>
      </aside>
      <div className="fixed top-16 right-0 h-screen w-[calc(100vw-256px)] overflow-scroll bg-white pl-5 pr-2.5 pt-5 pb-20 rounded-tl-4xl">
        <main className="relative z-0 h-max w-full overflow-y-scroll scrollbar-none">
          {children}
        </main>
      </div>
    </div>
  );
}

function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm text-emerald-500">{eyebrow}</p>
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  );
}
function Money({ value }) {
  const { formatPrice } = useStoreSettings();
  return <>{formatPrice(value)}</>;
}
function Empty({ colSpan, children }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-12 text-center text-slate-400">
        {children}
      </td>
    </tr>
  );
}
function dateOf(value) {
  return value?.toDate
    ? value.toDate().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';
}
function ActionButton({ children, danger = false, ...props }) {
  return (
    <button
      {...props}
      className={`inline-grid h-10 w-10 place-items-center rounded-xl transition ${danger ? 'bg-red-500/20 text-red-600 hover:bg-red-500/35' : 'bg-amber-500/20 text-amber-700 hover:bg-amber-500/35'}`}
    >
      {children}
    </button>
  );
}
function DeleteButton({ path, label = 'Delete this record?' }) {
  return (
    <ActionButton
      danger
      title="Delete"
      onClick={async () => {
        if (window.confirm(label)) await deleteDoc(doc(db, ...path.split('/')));
      }}
    >
      <Trash2 size={17} />
    </ActionButton>
  );
}

function Overview() {
  const products = useCollection('products');
  const customers = useCollection('customers');
  const orders = useCollection('orders');
  const completed = orders.filter((item) => item.status === 'completed');
  const stats = [
    ['Products', products.length, Box, 'bg-blue-500/15 text-blue-500'],
    [
      'Completed',
      completed.length,
      ShoppingBag,
      'bg-amber-500/15 text-amber-500',
    ],
    [
      'Cancelled',
      orders.filter((item) => item.status === 'cancelled').length,
      ShoppingBag,
      'bg-red-500/15 text-red-500',
    ],
    ['Customers', customers.length, Users, 'bg-indigo-500/15 text-indigo-500'],
    [
      'Revenue',
      <Money
        value={completed.reduce(
          (sum, item) => sum + Number(item.total || 0),
          0,
        )}
      />,
      CreditCard,
      'bg-emerald-500/15 text-emerald-500',
    ],
  ];
  return (
    <>
      <PageHeading
        eyebrow="Dashboard"
        title="Welcome back, Admin."
        description="Here is a live summary of your store today."
        action={
          <Link className={button} to="/admin/products/new">
            <PlusCircle size={16} />
            Add product
          </Link>
        }
      />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(([label, value, Icon, colour]) => (
          <article key={label} className="rounded-[24px] bg-[#f2f2f6] p-4">
            <div className="flex items-center gap-3">
              <span
                className={`grid h-12 w-12 place-items-center rounded-full ${colour}`}
              >
                <Icon size={21} />
              </span>
              <div>
                <p className="text-sm text-slate-400">{label}</p>
                <p className="text-2xl font-semibold">{value}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Latest products
            </h2>
            <p className="text-sm text-slate-400">
              Recently added items in your catalogue.
            </p>
          </div>
          <Link
            className="text-sm text-emerald-600 hover:underline"
            to="/admin/products"
          >
            View all
          </Link>
        </div>
        <ProductTable products={products.slice(0, 6)} compact />
      </section>
    </>
  );
}

function ProductTable({ products, compact = false }) {
  return (
    <div className="overflow-x-auto rounded-[24px] border border-slate-100">
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead className="bg-black text-white">
          <tr>
            <th className="px-5 py-4">Product</th>
            {!compact && <th className="px-5 py-4">Category & options</th>}
            <th className="px-5 py-4">Price</th>
            <th className="px-5 py-4">Stock</th>
            {!compact && <th className="px-5 py-4 text-right">Action</th>}
          </tr>
        </thead>
        <tbody>
          {products.length ? (
            products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-slate-100 last:border-0 hover:bg-[#f2f2f6]"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3 font-medium">
                    {product.src || product.imageUrl ? (
                      <img
                        className="h-12 w-12 rounded-xl object-cover"
                        src={product.src || product.imageUrl}
                        alt=""
                      />
                    ) : (
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-200 text-slate-500">
                        <Box size={18} />
                      </span>
                    )}
                    <span>
                      {product.title}
                      <small className="mt-1 block font-normal text-slate-400">
                        #{product.id.slice(0, 6)}
                      </small>
                    </span>
                  </div>
                </td>
                {!compact && (
                  <td className="px-5 py-3">
                    <b>{product.storeID || 'No store selected'}</b>
                    <small className="block text-slate-400">
                      {product.category || 'No category'} ·{' '}
                      {(product.colors || []).join(', ') || 'No colours'} /{' '}
                      {(product.size || product.sizes || []).join(', ') ||
                        'No size'}
                    </small>
                  </td>
                )}
                <td className="px-5 py-3">
                  <Money value={product.price} />
                </td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                    {product.stock ?? product.quantity ?? 0}
                  </span>
                </td>
                {!compact && (
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/products/${product.id}`}>
                        <span className="inline-grid h-10 w-10 place-items-center rounded-xl bg-amber-500/20 text-amber-700">
                          <Pencil size={17} />
                        </span>
                      </Link>
                      <DeleteButton
                        path={`products/${product.id}`}
                        label="Delete this product?"
                      />
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <Empty colSpan={compact ? 3 : 5}>
              No products have been added yet.
            </Empty>
          )}
        </tbody>
      </table>
    </div>
  );
}
function Products() {
  const products = useCollection('products');
  return (
    <>
      <PageHeading
        eyebrow="Catalogue"
        title="All products"
        description="Manage your inventory, pricing, and product information."
        action={
          <Link className={button} to="/admin/products/new">
            <PlusCircle size={16} />
            Add product
          </Link>
        }
      />
      <ProductTable products={products} />
    </>
  );
}

function Field({ label, children, className = '' }) {
  return (
    <label className={`block text-sm font-medium ${className}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}
function Choices({ label, values, selected, toggle }) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">{label}</legend>
      <div className="mt-2 grid grid-cols-2 gap-2 rounded-2xl bg-white p-4">
        {values.map((value) => (
          <label className="flex items-center gap-2 text-sm" key={value}>
            <input
              type="checkbox"
              checked={selected.includes(value)}
              onChange={() => toggle(value)}
            />
            {value}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useCollection('products');
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const { currency } = useStoreSettings();
  const editing = id && id !== 'new';
  const existing = products.find((item) => item.id === id);
  useEffect(() => {
    if (!existing) return undefined;

    const timer = window.setTimeout(() => {
      setForm({
        ...emptyProduct,
        ...existing,
        price: existing.price ?? '',
        stock: existing.stock ?? existing.quantity ?? 0,
        src: existing.src ?? existing.imageUrl ?? '',
        size: existing.size ?? existing.sizes ?? [],
        colors: existing.colors ?? [],
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [existing]);
  const update = (name, value) =>
    setForm((previous) => ({ ...previous, [name]: value }));
  const toggle = (name, value) =>
    update(
      name,
      form[name].includes(value)
        ? form[name].filter((item) => item !== value)
        : [...form[name], value],
    );
  const submit = async (event) => {
    event.preventDefault();
    if (
      !form.title ||
      form.price === '' ||
      !form.storeID ||
      !form.category ||
      !form.colors.length ||
      !form.size.length
    )
      return;
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      storeID: form.storeID,
      category: form.category,
      src: form.src.trim(),
      price: Number(form.price),
      dis: Number(form.dis || 0),
      colors: form.colors,
      size: form.size,
      stock: Number(form.stock),
      updatedAt: serverTimestamp(),
    };
    try {
      editing
        ? await updateDoc(doc(db, 'products', id), {
            ...payload,
            description: deleteField(),
          })
        : await addDoc(collection(db, 'products'), {
            ...payload,
            createdAt: serverTimestamp(),
          });
      navigate('/admin/products');
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <PageHeading
        eyebrow="Catalogue"
        title={editing ? 'Edit product' : 'Add product'}
        description={
          editing
            ? 'Update product details and options.'
            : 'Create a skincare product with customer-selectable options.'
        }
      />
      <form
        onSubmit={submit}
        className="max-w-5xl rounded-[28px] bg-[#f2f2f6] p-5"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Product name *">
            <input
              className={input}
              required
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
            />
          </Field>
          <Field label={`Price (${currency}) *`}>
            <input
              className={input}
              required
              min="0"
              step="0.01"
              type="number"
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
            />
          </Field>
          <Field label="Discount (%)">
            <input
              className={input}
              min="0"
              max="100"
              type="number"
              value={form.dis}
              onChange={(e) => update('dis', e.target.value)}
            />
          </Field>
          <Field label="Stock *">
            <input
              className={input}
              required
              min="0"
              type="number"
              value={form.stock}
              onChange={(e) => update('stock', e.target.value)}
            />
          </Field>
          <Field label="Store *">
            <select
              className={input}
              required
              value={form.storeID}
              onChange={(e) => update('storeID', e.target.value)}
            >
              <option value="">Choose a store</option>
              {storeOptions.map((store) => (
                <option key={store.value} value={store.value}>
                  {store.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category *">
            <select
              className={input}
              required
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
            >
              <option value="">Choose a category</option>
              {productCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Product image link">
            <input
              className={input}
              type="url"
              placeholder="https://…"
              value={form.src}
              onChange={(e) => update('src', e.target.value)}
            />
          </Field>
          {form.src && (
            <div className="flex items-end">
              <img
                className="h-20 w-20 rounded-2xl object-cover"
                src={form.src}
                alt="Product preview"
              />
            </div>
          )}
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Choices
            label="Available colours *"
            values={productColors}
            selected={form.colors}
            toggle={(value) => toggle('colors', value)}
          />
          <Choices
            label="Available sizes *"
            values={productSizes}
            selected={form.size}
            toggle={(value) => toggle('size', value)}
          />
        </div>
        <div className="mt-5 flex gap-3">
          <button className={button} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update product' : 'Save product'}
          </button>
          <Link
            className="rounded-full border border-slate-300 px-6 py-3 text-sm"
            to="/admin/products"
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}

function CrudList({
  collectionName,
  heading,
  eyebrow,
  description,
  fields,
  empty,
  columns,
}) {
  const items = useCollection(collectionName);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const save = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      ...(collectionName === 'orders'
        ? { total: Number(form.total || 0) }
        : {}),
      updatedAt: serverTimestamp(),
    };
    editing === 'new'
      ? await addDoc(collection(db, collectionName), {
          ...payload,
          createdAt: serverTimestamp(),
        })
      : await updateDoc(doc(db, collectionName, editing), payload);
    setEditing(null);
    setForm(empty);
  };
  return (
    <>
      <PageHeading
        eyebrow={eyebrow}
        title={heading}
        description={description}
        action={
          <button
            className={button}
            onClick={() => {
              setEditing('new');
              setForm(empty);
            }}
          >
            <PlusCircle size={16} />
            Add {heading.slice(0, -1)}
          </button>
        }
      />
      {editing && (
        <form
          onSubmit={save}
          className="mb-5 grid gap-4 rounded-[28px] bg-[#f2f2f6] p-5 md:grid-cols-2 xl:grid-cols-5"
        >
          {fields.map((field) => (
            <Field key={field} label={field.replace(/([A-Z])/g, ' $1')}>
              {field === 'status' ? (
                <select
                  className={input}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                >
                  {['pending', 'processing', 'completed', 'cancelled'].map(
                    (status) => (
                      <option key={status}>{status}</option>
                    ),
                  )}
                </select>
              ) : (
                <input
                  className={input}
                  required={field !== 'phone'}
                  type={
                    field === 'total'
                      ? 'number'
                      : field.includes('Email') || field === 'email'
                        ? 'email'
                        : 'text'
                  }
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                />
              )}
            </Field>
          ))}
          <div className="flex items-end gap-3">
            <button className={button}>
              {editing === 'new' ? 'Save' : 'Update'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="text-sm text-slate-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="overflow-x-auto rounded-[24px] border border-slate-100">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-black text-white">
            <tr>
              {columns.map(([label]) => (
                <th className="px-5 py-4" key={label}>
                  {label}
                </th>
              ))}
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((item) => (
                <tr
                  className="border-b border-slate-100 last:border-0 hover:bg-[#f2f2f6]"
                  key={item.id}
                >
                  {columns.map(([label, render]) => (
                    <td className="px-5 py-4" key={label}>
                      {render(item)}
                    </td>
                  ))}
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <ActionButton
                        onClick={() => {
                          setEditing(item.id);
                          setForm({ ...empty, ...item });
                        }}
                      >
                        <Pencil size={17} />
                      </ActionButton>
                      <DeleteButton path={`${collectionName}/${item.id}`} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <Empty colSpan={columns.length + 1}>
                No {heading.toLowerCase()} yet.
              </Empty>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
function Customers() {
  return (
    <CrudList
      collectionName="customers"
      heading="Customers"
      eyebrow="People"
      description="See who shops with you and their purchase activity."
      fields={['name', 'email', 'phone']}
      empty={emptyCustomer}
      columns={[
        [
          'Customer ID',
          (item) => <span className="text-slate-500">#{item.id}</span>,
        ],
        [
          'Name & email',
          (item) => (
            <>
              <b>{item.name}</b>
              <small className="block text-slate-400">{item.email}</small>
            </>
          ),
        ],
        ['Phone', (item) => item.phone || '—'],
      ]}
    />
  );
}
function Orders() {
  const orders = useCollection('orders');
  const [expandedId, setExpandedId] = useState(null);
  const updateStatus = (id, status) =>
    updateDoc(doc(db, 'orders', id), {
      status,
      updatedAt: serverTimestamp(),
    });
  return (
    <>
      <PageHeading
        eyebrow="Sales"
        title="Orders"
        description="Live orders submitted by your customers. Review the order summary and update fulfillment here."
      />
      <div className="overflow-x-auto rounded-[24px] border border-slate-100">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-5 py-4">Order</th>
              <th className="px-5 py-4">Customer & delivery</th>
              <th className="px-5 py-4">Payment</th>
              <th className="px-5 py-4">Total</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length ? (
              orders.map((item) => (
                <>
                  <tr
                    className="border-b border-slate-100 hover:bg-[#f2f2f6]"
                    key={item.id}
                  >
                    <td className="px-5 py-4">
                      <b>#{item.id.slice(0, 7)}</b>
                      <small className="block text-slate-400">
                        {dateOf(item.createdAt)}
                      </small>
                    </td>
                    <td className="px-5 py-4">
                      <b>{item.customerName || 'Guest'}</b>
                      <small className="block text-slate-400">
                        {item.phone || '—'} · {item.address || 'No address'}
                      </small>
                    </td>
                    <td className="px-5 py-4">
                      {item.paymentLabel || item.paymentMethod || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <Money value={item.total} />
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={item.status || 'pending'}
                        onChange={(event) =>
                          updateStatus(item.id, event.target.value)
                        }
                        className="rounded-full bg-slate-100 px-3 py-2 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() =>
                          setExpandedId(expandedId === item.id ? null : item.id)
                        }
                        className="rounded-full border border-slate-300 px-3 py-2 text-xs"
                      >
                        {expandedId === item.id
                          ? 'Hide summary'
                          : 'Order summary'}
                      </button>
                      {item.status !== 'completed' &&
                        item.status !== 'cancelled' && (
                          <button
                            onClick={() => updateStatus(item.id, 'completed')}
                            className="ml-2 rounded-full bg-emerald-600 px-3 py-2 text-xs text-white"
                          >
                            Complete order
                          </button>
                        )}
                    </td>
                  </tr>
                  {expandedId === item.id && (
                    <tr
                      key={`${item.id}-summary`}
                      className="border-b border-slate-100 bg-slate-50"
                    >
                      <td colSpan="6" className="px-5 py-5">
                        <div className="grid gap-5 md:grid-cols-2">
                          <div>
                            <b>Order items</b>
                            <div className="mt-2 space-y-2">
                              {(item.items || []).map((product, index) => (
                                <div
                                  className="flex justify-between text-sm"
                                  key={`${product.id}-${index}`}
                                >
                                  <span>
                                    {product.quantity} × {product.title}{' '}
                                    {product.size &&
                                      `(${product.size}, ${product.color})`}
                                  </span>
                                  <span>
                                    <Money
                                      value={
                                        product.price *
                                        (1 - product.dis / 100) *
                                        product.quantity
                                      }
                                    />
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <b>Customer details</b>
                            <p className="mt-2 text-sm text-slate-600">
                              {item.customerName}
                              <br />
                              {item.customerEmail}
                              <br />
                              {item.phone}
                              <br />
                              {item.address}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            ) : (
              <Empty colSpan={6}>No customer orders yet.</Empty>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
function Placeholder({ title, description }) {
  return (
    <>
      <PageHeading eyebrow="Support" title={title} description={description} />
      <div className="rounded-[28px] bg-[#f2f2f6] p-5">
        <h2 className="text-xl font-semibold">Need a hand?</h2>
        <p className="mt-1 text-slate-400">
          This area is ready for your support content.
        </p>
      </div>
    </>
  );
}
export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="customers" element={<Customers />} />
        <Route path="orders" element={<Orders />} />
        <Route
          path="profile"
          element={
            <Placeholder
              title="Edit profile"
              description="Update the details shown in your administrator account."
            />
          }
        />
        <Route
          path="help"
          element={
            <Placeholder
              title="Help center"
              description="Find guidance for managing your store."
            />
          }
        />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}
