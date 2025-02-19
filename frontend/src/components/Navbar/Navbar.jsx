import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const handleHomeClick = () => {
    setMenu("Home");
    setIsMenuOpen(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    setIsMenuOpen(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    navigate('/cart');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleScroll = () => {
    if (location.pathname !== '/') {
      return;
    }

    const sections = {
      'Home': { top: 0, bottom: document.getElementById('explore-menu')?.offsetTop || 1000 },
      'Menu': { 
        top: document.getElementById('explore-menu')?.offsetTop || 1000, 
        bottom: document.getElementById('gallery')?.offsetTop || 2000 
      },
      'Gallery': { 
        top: document.getElementById('gallery')?.offsetTop || 2000, 
        bottom: document.getElementById('footer')?.offsetTop || 3000 
      },
      'Contact-Us': { 
        top: document.getElementById('footer')?.offsetTop || 3000, 
        bottom: document.body.scrollHeight 
      }
    };

    const scrollPosition = window.scrollY + window.innerHeight / 3;
    
    for (const [sectionName, sectionBounds] of Object.entries(sections)) {
      if (scrollPosition >= sectionBounds.top && scrollPosition < sectionBounds.bottom) {
        setMenu(sectionName);
        break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  return (
    <div className="navbar-container">
      <div className="navbar">
        <Link to="/" onClick={handleHomeClick}>
          <img src={assets.logo} alt="" className="logo" />
        </Link>

        <ul className={`navbar-menu ${isMenuOpen ? 'show' : ''}`}>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleHomeClick();
            }} 
            className={menu === "Home" ? "active" : ""}
          >
            Home
          </a>
          <a 
            href="/#explore-menu" 
            onClick={() => {
              setMenu("Menu");
              setIsMenuOpen(false);
            }} 
            className={menu === "Menu" ? "active" : ""}
          >
            Menu
          </a>
          <a 
            href="#gallery" 
            onClick={() => {
              setMenu("Gallery");
              setIsMenuOpen(false);
            }} 
            className={menu === "Gallery" ? "active" : ""}
          >
            Gallery
          </a>
          <a 
            href="#footer" 
            onClick={() => {
              setMenu("Contact-Us");
              setIsMenuOpen(false);
            }} 
            className={menu === "Contact-Us" ? "active" : ""}
          >
            Contact Us
          </a>
        </ul>

        <div className="navbar-right">
          <img src={assets.search_icon} alt="" />
          <div className="navbar-search-icon">
            <a href="/cart" onClick={handleCartClick}>
              <img src={assets.shopping_cart} width={28} alt="" />
            </a>
            <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
          </div>
          {!token ? (
            <button onClick={() => setShowLogin(true)}>Sign In</button>
          ) : (
            <div className="navbar-profile">
              <img src={assets.profile_icon} alt="" />
              <ul className="nav-profile-dropdown">
                <li><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                <hr />
                <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
              </ul>
            </div>
          )}
          {/* Menu Icon */}
          <div className="menu-icon" onClick={toggleMenu}>
            <div className={`menu-line ${isMenuOpen ? 'open' : ''}`}></div>
            <div className={`menu-line ${isMenuOpen ? 'open' : ''}`}></div>
            <div className={`menu-line ${isMenuOpen ? 'open' : ''}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;