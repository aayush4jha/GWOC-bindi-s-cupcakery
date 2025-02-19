import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollPosition = () => {
    const container = scrollRef.current;
    if (container) {
      const isAtStart = container.scrollLeft === 0;
      const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
      
      setShowLeftArrow(!isAtStart);
      setShowRightArrow(!isAtEnd);
    }
  };

  useEffect(() => {
    checkScrollPosition();
  }, []);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 300; // Adjust this value to control scroll distance
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      
      // Check scroll position after animation
      setTimeout(checkScrollPosition, 300);
    }
  };

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>
        Delight in our irresistible selection of freshly baked cakes and cupcakes, 
        crafted to satisfy every craving.
      </p>
      <div className="explore-menu-container">
        {showLeftArrow && (
          <button 
            className="scroll-arrow left"
            onClick={() => scroll('left')}
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <div 
          className="explore-menu-list"
          ref={scrollRef}
          onScroll={checkScrollPosition}
        >
          {menu_list.map((item, index) => (
            <div
              onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
              key={index}
              className="explore-menu-list-item"
            >
              <img 
                className={category === item.menu_name ? "active" : ""} 
                src={item.menu_image} 
                alt="" 
              />
              <p>{item.menu_name}</p>
            </div>
          ))}
        </div>
        {showRightArrow && (
          <button 
            className="scroll-arrow right"
            onClick={() => scroll('right')}
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu; 