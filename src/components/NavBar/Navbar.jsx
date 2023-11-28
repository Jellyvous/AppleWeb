import React, { useState } from 'react'

import "./Navbar.css";
import search_icon from "../../assets/search-interface-symbol.png";
import shopping_icon from "../../assets/shopping-cart.png";
import user_icon from "../../assets/user.png";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlide'

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleDropdownOpen = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCartIconClick = () => {
    navigate('/cart');
  };
  const dispatch = useDispatch()

  return (
    <div className="navbar-container">
      <div className="navbar">
        <NavLink className="nav-pagename" to="/">
          Apple Zone
        </NavLink>
          <NavLink to="/products-type/6564aee73adaf4c11a499a6b" target="_blank" className="menu-component" style={{textDecoration:"none"}}>
            <div>Iphone</div>
          </NavLink>
          <NavLink to="/products-type/6564aefd3adaf4c11a499a72" target="_blank" className="menu-component" style={{textDecoration:"none"}}>
            <div>Ipad</div>
          </NavLink>
          <NavLink to="/products-type/6564af133adaf4c11a499a7c" target="_blank" className="menu-component" style={{textDecoration:"none"}}>
            <div>Mac</div>
          </NavLink>
        <div className="nav-input">
          <form action='' class='search-bar'>
            <input type="text" placeholder='Tìm kiếm sản phẩm' className='input-box' />
            <button type='submit'><img src={search_icon} alt="search icon" className='search-icon' /></button>
          </form>
        </div>
        <div className="nav-icon">
          <div className="shopping-icon">
            <img src={shopping_icon} alt="" className='icon' onClick={handleCartIconClick} />
          </div>
          {/* <div className="user-icon">
            <img src={user_icon} alt="" className='icon'  onClick={handleDropdownOpen}/>
          </div> */}
          {/* {dropdownOpen && (
            <div className="dropdown-menu">
              <NavLink to="/SignIn" >Đăng nhập</NavLink>
              <NavLink to="/SignUp">Đăng ký</NavLink>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
