import Filter from '../filter/Filter.jsx';

function FilterBar({ active, product, newIn }) {
  function getItems(storeID) {
    return product.filter((brand) => brand.storeID === storeID);
  }

  const brandData = [
    {
      id: 1,
      name: 'Ten11',
      items: getItems('ten11'),
    },
    {
      id: 2,
      name: 'Zando',
      items: getItems('zando'),
    },
    {
      id: 3,
      name: 'Routine',
      items: getItems('routine'),
    },
    {
      id: 4,
      name: 'Gatoni',
      items: getItems('gatoni'),
    },
    {
      id: 5,
      name: '361',
      items: getItems('361'),
    },
    {
      id: 6,
      name: 'boo boo',
      items: getItems('boo boo'),
    },
  ];

  return (
    <div
      style={{ translate: active ? `0 0` : '0 -100%' }}
      className="fixed z-[998] inset-x-0 top-12 h-14 flex items-center overflow-scroll scrollbar-none bg-white transition ease-[cubic-bezier(0.78, 0.01, 0.00, 0.99)] duration-500"
    >
      <div className="h-full flex items-center gap-2.5">
        <div className="flex items-center gap-1">
          <p>New in ({newIn} items)</p>
        </div>
        <button className="cursor-pointer h-8 px-2.5 border-2 border-black rounded-lg flex items-center">
          Filter
        </button>
      </div>
      <div className="h-full w-max flex items-center gap-4 px-2.5">
        {brandData.map((ele) => {
          return <Filter key={ele.id} props={ele} />;
        })}
      </div>
    </div>
  );
}
export default FilterBar;
