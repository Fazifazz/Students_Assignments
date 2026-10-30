import { Link } from "react-router-dom"
import fb from "../assets/fb-icon-1.png"
import insta from "../assets/insta-icon-2.jpg"
import youtube from "../assets/youtube-icon.png"
import { useRef } from "react";


 function Footer()
 {   
   
    return (      
        <footer className="footer-section">      
            <div className="container">
                <div className="row h-100 gt-6">
                    <div className="col-12 col-lg-3 col-md-12" style={{"paddingBottom": "10px"}}>
                            <h5 id="quick_link">Quick Links</h5>
                                <ul id="footer-links" className="ms-auto">
                                    <li className="nav-item">
                                        <Link to="/" className="footer-nav-link">HOME</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/products" className="footer-nav-link">SEARCH</Link>
                                    </li>
                                    <li className="nav-item">
                                        <a className="footer-nav-link" data-bs-toggle="modal" data-bs-target="#loginModal"  href="">LOGIN</a>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/cart" className="footer-nav-link">
                                            CART
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/contact" className="footer-nav-link">
                                            CONTACT
                                        </Link>
                                    </li>
                                </ul>
                            
                    </div>
                    <div className="col-12 col-lg-3 col-md-12" style={{"paddingBottom": "10px"}}>
                            <h5 id="about-title">About ShopNest</h5>
                            <p id="about-dtl"> ShopNest is your one-stop destination for quality products, great deals, and effortless 
                                shopping. We bring together everyday essentials, fashion, electronics, and more — all in one convenient place.
                            </p>
                            <p>Shop Smart. Live Better. </p>
                    </div>
                    <div className="col-12 col-lg-1 col-md-12"></div>
                    <div className="col-12 col-lg-3 col-md-12" style={{"paddingBottom": "10px"}}>
                            <h5 id="contact-title">Contact Us</h5>
                            <h6>ShopNest</h6>
                            <p>123 Market Street, Kochi,<br />
                            Kerala – 682001, India <br/>
                            <br/>
                            <span className="bi bi-telephone"></span> Phone: +91 98765 43210 <br/>
                            <span className="bi bi-envelope"></span> Email: support@shopnest.com <br/>
                            <span className="bi bi-clock"></span> Customer Support:<br/> Monday – Saturday, 9:00 AM – 6:00 PM</p> 
                    </div>
                    <div className="col-12 col-lg-2 col-md-12" style={{"paddingBottom": "10px"}}>
                            <h5 id="social-heading">Follow Us</h5>
                            <div className="social-section">
                                <a href=""><img src={fb} alt="Facebook" width="30px" height="30px" style={{"borderRadius":"5px"}} /></a>
                                <a href=""><img src={insta} alt="Instagram"width="30px" height="30px" /></a>
                                <a href=""><img src={youtube} alt="Youtube" width="30px" height="30px" /></a>
                            </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12" style={{"textAlign": "center", "paddingTop": "10px"}}>
                        &copy; ShopNest Limited - 2026
                    </div>
                </div>
            </div>
           
        </footer>
      
    )
}


export default Footer