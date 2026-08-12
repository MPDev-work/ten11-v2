import Card from '../product/Card';

function ProductLayout({ props }) {
  const products = [...props.products];

  return (
    <div className="w-screen h-max flex flex-col items-center gap-8 mt-8 px-2.5">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-3xl font-semibold">{props.title}</h1>
        <a className="font-semibold" href={props.link}>
          See more
        </a>
      </div>
      <div className="w-full h-max grid grid-cols-4 grid-flow-row gap-5">
        {products.slice(0, 4).map((product) => {
          return <Card product={product} key={product.id} />;
        })}
      </div>
    </div>
  );
}

export default ProductLayout;
