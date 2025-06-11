import { useState } from 'react';
import { Link } from 'react-router-dom';
const InteractiveImageMap = () => {
  const [hoveredArea, setHoveredArea] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const areas = [
    {
      id: 'oses',
      image: '/OSES.png',
      link: '/services/map',
      position: {
        top: '45%',
        left: '14%',
        width: '35%',
        height: '15%'
      },
      tooltip: 'OSES Area',
      zIndex: 35
    },
    {
      id: 'onwj',
      image: '/ONWJ.png',
      link: '/services/map',
      position: {
        top: '55%',
        left: '11.8%',
        width: '65%',
        height: '22%'
      },
      tooltip: 'ONWJ Area',
      zIndex: 30
    },
    {
      id: 'sumatra',
      image: '/sumatra.png',
      position: {
        top: '-100%',
        left: '-60%',
        width: '128%',
        height: '165%'
      },
      tooltip: 'Sumatera Island',
      zIndex: 10
    },
    {
      id: 'java',
      image: '/java.png',
      position: {
        top: '60%',
        left: '22%',
        width: '80%',
        height: '57%'
      },
      tooltip: 'Java Island',
      zIndex: 10
    }
  ];

  const handleAreaClick = (area) => {
    window.location.href = area.link;
  };

  const handleAreaHover = (area, e) => {
    setHoveredArea(area);
    // Tooltip position relative to mouse
    const parentRect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - parentRect.left,
      y: e.clientY - parentRect.top
    });
  };

  const handleAreaLeave = () => {
    setHoveredArea(null);
  };

  return (
    <div className="flex flex-col justify-center h-full">
      {/* Mobile-only OSDATUM Title */}
      <h2 className="block md:hidden text-4xl font-bold text-center mb-6 text-black py-8">WELCOME TO AT OSDATUM</h2>
      <p className="block md:hidden text-base/8 text-left">
         Please select your area to explore detailed hydrographic data!
       </p>
       <p className="block md:hidden mt-4 text-gray-600 leading-relaxed text-left">
         <Link 
         to="/services/map" 
         className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
         >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
           </svg>
                 Explore Map
         </Link>
       </p>
        
        {/* Map Container */}
      <div className="relative w-full max-w-4xl h-full rounded-lg overflow-hidden" style={{maxWidth: '1500px', margin: '0 auto'}}>
        <h2 className="text-8xl font-semibold text-right mt-32 hidden md:block">OSES-ONWJ</h2>
        <p className="text-base/8 text-right hidden md:block">
          Click on the areas below to explore detailed hydrographic data <br /> 
          for Offshore South East Sumatra and Offshore North West Java (OSES-ONWJ).
        </p>
        {/* Islands */}
        <div className="hidden md:block w-full h-full">
          {areas.map((area) => (
            <div 
              key={area.id}
              className="absolute group cursor-pointer transition-all duration-300"
              style={{
                top: area.position.top,
                left: area.position.left,
                width: area.position.width,
                height: area.position.height,
                zIndex: hoveredArea?.id === area.id ? area.zIndex + 10 : area.zIndex,
                overflow: 'visible',
                pointerEvents: 'none'
              }}
            >
              <div 
                className="relative w-full h-full overflow-visible"
                onClick={() => handleAreaClick(area)}
                onMouseMove={(e) => area.id !== 'sumatra' && area.id !== 'java' && handleAreaHover(area, e)}
                onMouseLeave={handleAreaLeave}
                style={{ pointerEvents: area.id === 'sumatra' || area.id === 'java' ? 'none' : 'auto' }}
              >
                <img 
                  src={area.image} 
                  alt=""
                  className={`w-full h-full object-contain mix-blend-multiply opacity-100 transition-transform duration-300 ${hoveredArea?.id === area.id ? 'scale-110 z-30' : ''}`}
                  draggable="false"
                />
                {/* Tooltip Pop-up */}
                {hoveredArea?.id === area.id && (
                  <div 
                    className="absolute px-4 py-2 rounded-lg shadow-lg text-sm font-medium bg-white/90 text-gray-900 border border-gray-200"
                    style={{
                      left: tooltipPos.x + 10,
                      top: tooltipPos.y - 40,
                      pointerEvents: 'none',
                      minWidth: '180px',
                      zIndex: 40
                    }}
                  >
                    {area.tooltip}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteractiveImageMap; 