import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Gallery.css';
import { assets } from '../../assets/assets';

const Gallery = () => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    assets.i1, assets.i2, assets.i3, assets.i4, assets.i5, assets.i6, 
    assets.i7, assets.i8, assets.i9, assets.i10, assets.i11, assets.i12,
    assets.i13, assets.i14, assets.i15, assets.i16, assets.i17, assets.i18, 
    assets.i19
  ];

  const updateArrows = (newIndex) => {
    setShowLeftArrow(newIndex > 0);
    setShowRightArrow(newIndex < images.length - 3);
  };

  useEffect(() => {
    updateArrows(currentIndex);
  }, [currentIndex]);

  const scroll = (direction) => {
    let newIndex;
    if (direction === 'left') {
      newIndex = Math.max(0, currentIndex - 3);
    } else {
      newIndex = Math.min(images.length - 3, currentIndex + 3);
    }
    setCurrentIndex(newIndex);
    updateArrows(newIndex);
  };

  const visibleImages = images.slice(currentIndex, currentIndex + 3);

  return (
    <div className='gallery' id='gallery'>
      <p>Indulge in Our Delightful Bakery Creations!</p>
      <div className="gallery-container">
        {showLeftArrow && (
          <button 
            className="gallery-arrow left"
            onClick={() => scroll('left')}
          >
            <ChevronLeft size={28} />
          </button>
        )}
        <div className="gallery-images">
          {visibleImages.map((image, index) => (
            <div key={currentIndex + index} className="image-card">
              <img src={image} alt={`Gallery item ${currentIndex + index + 1}`} />
            </div>
          ))}
        </div>
        {showRightArrow && (
          <button 
            className="gallery-arrow right"
            onClick={() => scroll('right')}
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Gallery;