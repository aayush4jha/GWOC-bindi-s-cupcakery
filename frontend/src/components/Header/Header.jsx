import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const images = [
    '/header_img5.jpg',
    '/header_img6.jpg', 
    '/header_img7.jpg',
    '/header_img8.jpg'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className='header'
      style={{
        background: `url(${images[currentImageIndex]}) no-repeat center center`,
        backgroundSize: 'cover',
        transition: 'background-image 0.5s ease-in-out'
      }}
    >
      <div className="header-contents">
        <h2>Order your favourite dessert!</h2>
        <p>Home-baked with fresh ingredients, completely eggless, and free from preservatives.</p>
        
      </div>
    </div>
  );
};

export default Header;