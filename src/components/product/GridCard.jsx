import { Link } from 'react-router-dom';

function GridCard({ props }) {
  return (
    <Link className="cursor-pointer relative h-[300px] lg:h-[560px] flex justify-center items-center">
      <img
        loading="lazy"
        className="w-full h-full object-cover"
        src={props.src}
      />
    </Link>
  );
}

export default GridCard;
