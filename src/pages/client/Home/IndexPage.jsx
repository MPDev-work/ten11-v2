import promotion from '../../../assets/promotion/imgi_2_11Years_Main_ZANDO (2160x1066).jpg';
// import ProductLayout from '../../../components/layout/ProductLayout';
import GridLayout from '../../../components/layout/GridLayout';
import { brandData } from '../../../data/brands';
import { ImageData } from '../../../data/sliders';
import { ChevronRight } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../../components/product/Card';
import { useAllProducts } from '../../../hooks/useAllProduct';
import { useState } from 'react';

function Promotion() {
  return (
    <div className="w-screen h-[calc(100vh-48px)] min-h-[calc(650px-48px)] mt-12 flex justify-center items-center overflow-hidden">
      <img className="h-full w-full object-cover" src={promotion} />
    </div>
  );
}

function Brand() {
  const [move, setMove] = useState(0);
  const countClick = move / 5;
  return (
    <div className="relative w-screen flex items-center overflow-hidden scrollbar-none">
      <div
        className={`absolute z-10 right-0 h-[200px] w-[100px] bg-white flex items-center transition duration-300`}
      >
        <button
          onClick={() =>
            setMove((move) => (countClick === 240 ? move : move + 240))
          }
          className={`cursor-pointer absolute left-0 h-12 w-12 flex justify-center items-center bg-black/40 rounded-full transition duration-150 ${countClick === 240 ? 'opacity-0' : 'opacity-100'}`}
        >
          <ChevronRight className="h-5 w-5 object-contain text-white" />
        </button>
      </div>
      <div
        className={`absolute z-10 left-5 h-[200px] flex items-center transition duration-300 ${countClick > 0 ? 'opacity-100' : 'opacity-0'}`}
      >
        <button
          onClick={() =>
            setMove((move) => (countClick === 0 ? move : move - 240))
          }
          className="cursor-pointer absolute left-0 h-12 w-12 flex justify-center items-center bg-black/40 rounded-full"
        >
          <ChevronLeft className="h-5 w-5 object-contain text-white" />
        </button>
      </div>
      <div
        style={{ translate: `-${move}px 0px` }}
        className="abosolute z-0 h-max w-max flex items-center transition duration-300 ease-out"
      >
        {brandData.map((brand) => {
          return (
            <Link
              key={brand.id}
              to={`/brands/${brand.link.slice(1)}`}
              className="h-[200px] w-[200px] mr-10 flex justify-center items-center"
            >
              <img
                loading="lazy"
                className="w-full h-full object-contain"
                src={brand.src}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ImageSlider() {
  return (
    <section className="w-screen h-[320px] flex justify-start items-center overflow-hidden">
      <div className="animate-slider h-full w-max flex justify-start items-center">
        {ImageData.map((banner) => {
          return (
            <Link
              to={'brands/' + banner.link}
              key={banner.id}
              className="cursor-pointer w-screen h-full flex justify-center items-center"
            >
              <img
                loading="lazy"
                className="w-full h-full object-cover"
                src={banner.src}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function NewArrival() {
  const allProduct = useAllProducts();
  const newInProduct = [...allProduct].sort(
    (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis(),
  );
  return (
    <div className="w-screen h-max flex flex-col items-center gap-8 mt-8 px-2.5">
      <div className="w-full flex justify-between items-center">
        <h1 className="uppercase text-3xl font-semibold">New Arrival</h1>
        <Link className="font-semibold" to={'/'}>
          See more
        </Link>
      </div>
      <div className="w-full h-max grid grid-cols-4 grid-flow-row gap-5">
        {newInProduct.slice(0, 4).map((product) => {
          return <Card product={product} key={product.id} />;
        })}
      </div>
    </div>
  );
}

function MenNewIn() {
  const allProduct = useAllProducts();
  const newInProduct = [...allProduct].sort(
    (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis(),
  );
  const mewNewIn = newInProduct.filter((product) => product.category === 'men');
  return (
    <div className="w-screen h-max flex flex-col items-center gap-8 mt-8 px-2.5">
      <div className="w-full flex justify-between items-center">
        <h1 className="uppercase text-3xl font-semibold">Men new in</h1>
        <Link className="font-semibold" to={'/'}>
          See more
        </Link>
      </div>
      <div className="w-full h-max grid grid-cols-4 grid-flow-row gap-5">
        {mewNewIn.slice(0, 4).map((product) => {
          return <Card product={product} key={product.id} />;
        })}
      </div>
    </div>
  );
}
function WomenNewIn() {
  const allProduct = useAllProducts();
  const newInProduct = [...allProduct].sort(
    (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis(),
  );
  const womenNewIn = newInProduct.filter(
    (product) => product.category === 'women',
  );
  return (
    <div className="w-screen h-max flex flex-col items-center gap-8 mt-10 px-2.5">
      <div className="w-full flex justify-between items-center">
        <h1 className="uppercase text-3xl font-semibold">Women new in</h1>
        <Link className="font-semibold" to={'/'}>
          See more
        </Link>
      </div>
      <div className="w-full h-max grid grid-cols-4 grid-flow-row gap-5">
        {womenNewIn.slice(0, 4).map((product) => {
          return <Card product={product} key={product.id} />;
        })}
      </div>
    </div>
  );
}
function UltimateSaving() {
  const allProduct = useAllProducts();
  const newInProduct = [...allProduct].sort((a, b) => b.dis - a.dis);
  const saving = newInProduct.filter((product) => product.dis > 0);
  return (
    <div className="w-screen h-max flex flex-col items-center gap-8 mt-8 px-2.5">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Ultimate saving</h1>
        <Link className="font-semibold" to={'/'}>
          See more
        </Link>
      </div>
      <div className="w-full h-max grid grid-cols-4 grid-flow-row gap-5">
        {saving.slice(0, 4).map((product) => {
          return <Card product={product} key={product.id} />;
        })}
      </div>
    </div>
  );
}

function IndexPage() {
  return (
    <section className="w-screen flex flex-col">
      <Promotion />
      <Brand />
      <ImageSlider />
      <NewArrival />
      <MenNewIn />
      <WomenNewIn />
      <UltimateSaving />
      <GridLayout />
      <NewArrival />
      <MenNewIn />
      <WomenNewIn />
      <UltimateSaving />
    </section>
  );
}

export default IndexPage;
