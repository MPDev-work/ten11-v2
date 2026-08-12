import promotion from '../../../assets/promotion/imgi_2_11Years_Main_ZANDO (2160x1066).jpg';
import ProductLayout from '../../../components/layout/ProductLayout';
import GridLayout from '../../../components/layout/GridLayout';

import { layoutData } from '../../../data/layoutData';
import { brandData } from '../../../data/brands';
import { ImageData } from '../../../data/sliders';
import { ChevronRight } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
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
            <div
              key={brand.id}
              className="h-[200px] w-[200px] mr-10 flex justify-center items-center"
            >
              <img
                loading="lazy"
                className="w-full h-full object-contain"
                src={brand.src}
              />
            </div>
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
            <a
              href="#"
              key={banner.id}
              className="w-screen h-full flex justify-center items-center"
            >
              <img
                loading="lazy"
                className="w-full h-full object-cover"
                src={banner.src}
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}

function ProductLayoutShocase() {
  return (
    <div className="w-screen h-max flex flex-col items-center">
      {layoutData.map((layout) => {
        return <ProductLayout key={layout.id} props={layout} />;
      })}
    </div>
  );
}

function IndexPage() {
  return (
    <section className="w-screen flex flex-col">
      <Promotion />
      <Brand />
      <ImageSlider />
      <ProductLayoutShocase />
      <GridLayout />
      <ProductLayoutShocase />
    </section>
  );
}

export default IndexPage;
