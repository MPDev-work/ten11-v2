function GridCard({ props }) {
  return (
    <a href="#" className="relative h-[560px] flex justify-center items-center">
      <img
        loading="lazy"
        className="w-full h-full object-cover"
        src={props.src}
      />
    </a>
  );
}

export default GridCard;
