import GridCard from '../product/GridCard';
import lifeStyle from '../../assets/gridCard/imgi_74_1.jpg';
import sportLife from '../../assets/gridCard/imgi_75_3.jpg';
import smartCusaul from '../../assets/gridCard/imgi_76_2.jpg';
import Bags from '../../assets/gridCard/imgi_77_4.jpg';
import softLiving from '../../assets/gridCard/imgi_78_5.jpg';
import Shoes from '../../assets/gridCard/imgi_79_6.jpg';

function GridLayout() {
  const gridData = [
    {
      id: 1,
      src: lifeStyle,
      link: ``,
    },
    {
      id: 2,
      src: sportLife,
      link: ``,
    },
    {
      id: 3,
      src: smartCusaul,
      link: ``,
    },
    {
      id: 4,
      src: Bags,
      link: ``,
    },
    {
      id: 5,
      src: softLiving,
      link: ``,
    },
    {
      id: 6,
      src: Shoes,
      link: ``,
    },
  ];
  return (
    <div className="w-screen grid grid-cols-3 grid-flow-row gap-5 px-2.5 mt-10">
      {gridData.map((card) => {
        return <GridCard key={card.id} props={card} />;
      })}
    </div>
  );
}

export default GridLayout;
