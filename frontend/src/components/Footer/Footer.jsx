import React, { useContext, useState, useEffect } from "react";
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from "react-router-dom";

const Footer = () => {
  const [menu, setMenu] = useState("Home");
  const handleHomeClick = () => {
    setMenu("Home");
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const handleCartClick = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    navigate('/cart');
  };
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo_2} alt="" width="300px"/>
            <p>Wholesome goodness begins here — home-made with love, purely vegetarian, and blissfully free from preservatives. Taste nature's finest in every bite.</p>
            <div className="footer-social-icons">
                <a href="https://www.facebook.com/BindisBakery/"><img src={assets.facebook_icon} alt="" /></a>
                <a href="https://www.instagram.com/bindis_cupcakery/"><img src={assets.instagram_icon} alt="" /></a>
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
            <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleHomeClick();
            }}
          >Home</a><br /><br />
                <a 
            href="/#explore-menu" 
            onClick={() => setMenu("Menu")} 
            className={menu === "Menu" ? "active" : ""}
          >
            Menu
          </a>
          <br />
          <br />
          <a 
            href="#gallery" 
            onClick={() => setMenu("Gallery")} 
            className={menu === "Gallery" ? "active" : ""}
          >
            Gallery
          </a>
          <br />
          <br />
          <a 
            href="#footer" 
            onClick={() => setMenu("Contact-Us")} 
            className={menu === "Contact-Us" ? "active" : ""}
          >
            Contact Us
          </a>
          <br /><br />
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+91-8849130189</li>
                <li>+91-9978677790</li>
                <li>bindiscupcakery@gmail.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 © Bindi's Cupcakery. All rights reserved.</p>
      <p className="footer-developers">Developed by Aayush Jha, Tarun Bhutra, Aditya Kumar & Jaimin Vankar</p>
    </div>
  )
}

export default Footer
