function Filter({ props }) {
  return (
    <button className="cursor-pointer capitalize h-8 px-2.5 border border-gray-300 rounded-lg text-base font-medium text-black text-nowrap whitespace-nowrap transition duration-150 hover:border-black">
      {props.name} ({props.items})
    </button>
  );
}

export default Filter;
