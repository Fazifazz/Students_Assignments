import { Link, NavLink } from "react-router-dom"
import { useCart } from "../context/CartContext"
import logo from "../assets/ShopNest Logo.png"
import { useRef } from "react";


function Navbar(){

    const {cartCount} = useCart();

    return(
        <header>
            <nav id="shopnest-navbar" className="navbar navbar-expand-lg" >
                <Link to="/" className="navbar-brand">
                    <img src={logo} alt="ShopNest Logo" />
                </Link>
            
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
            
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink to="/" end className={({isActive})=>`nav-link ${isActive? 'nav-link--active' : ''}`} ><b>HOME</b></NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/products" className={({isActive})=>`nav-link ${isActive? 'nav-link--active' : ''}`} ><b>PRODUCTS</b></NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/contact" className={({isActive})=>`nav-link ${isActive? 'nav-link--active' : ''}`} ><b>CONTACT</b></NavLink>
                        </li>
                        <li className="nav-item">
                            <Link to="#" className="nav-link" data-bs-toggle="modal" data-bs-target="#loginModal"><b>LOGIN</b></Link>
                        </li>
                        {/* <li class="nav-item">
                                <form class="d-flex" id="searchForm">
                                <b id="search-icon" class="bi bi-search"></b> &nbsp;
                                <select id="categoryFilter">
                                    <option value="all" selected >All</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="footwear"  >Footwear</option>
                                    <option value="books">Books</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="jewelery">Jewelery</option>
                                </select>
                                <input class="form-control" type="search" style="margin-left: 10px; position : relative;" placeholder="Search Products" id="searchInput">
                                
                            </form>
                        </li> */}
                    
                        <li className="nav-item">
                            <NavLink to="/cart" className="nav-link">
                                <span id="ShopNest-cart" className="bi bi-cart"></span>
                               {cartCount>0?  <span id="cartQuantity">{cartCount}</span>: ""}
                            </NavLink>
                        </li>
                    </ul>
                </div>                          
            </nav>

    </header>
    )
}

export default Navbar