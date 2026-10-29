import { Link, NavLink } from "react-router-dom";
import fb from "../assets/fb-icon-1.png"
import insta from "../assets/insta-icon-2.jpg"
import youtube from "../assets/youtube-icon.png"

function Footer(){
    return(
        <footer className="footer-section">       
            <div className="container">
                <div className="row h-100 gt-6">
                    <div className="col-12 col-lg-3 col-md-12" style={{ paddingBottom : 10 + 'px'}}>
                            <h5 id="quick_link">Quick Links</h5>
                                <ul id="footer-links" className="ms-auto">
                                    <li className="nav-item">
                                        <Link to="/" className="footer-nav-link" >HOME</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/recipes" className="footer-nav-link" >RECIPES</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/favourites" className="footer-nav-link">FAVOURITES</Link>
                                    </li>
                                </ul>
                            
                    </div>
                    <div className="col-12 col-lg-3 col-md-12" style={{ paddingBottom : 10 + 'px'}}>
                            <h5 id="about-title">About Recipe hub</h5>
                            <p id="about-dtl"> RecipeHub is your go-to place to discover delicious recipes, explore new flavours, and find inspiration for every meal. 
                            </p>
                            <p>From everyday favourites to exciting new dishes, make every meal special with RecipeHub!</p>
                    </div>
                    <div className="col-12 col-lg-1 col-md-12"></div>
                        <div className="col-12 col-lg-3 col-md-12" style={{ paddingBottom : 10 + 'px'}}>
                            <h5 id="contact-title">Contact Us</h5>
                            <h6>RecipeHub</h6>
                            <p>123 Market Street, Kochi,<br/>
                            Kerala – 682001, India <br />
                            <br />
                            <span className="bi bi-telephone"></span> Phone: +91 98765 43210 <br />
                            <span className="bi bi-envelope"></span> Email: support@recipehub.com <br /></p>       
                    </div>
                         <div className="col-12 col-lg-2 col-md-12" style={{ paddingBottom : 10 + 'px'}}>
                            <h5 id="social-heading">Follow Us</h5>
                            <div className="social-section">
                                <a href=""><img src={fb} alt="Facebook" width="30px" height="30px" border-radius="5px" /></a>
                                <a href=""><img src={insta} alt="Instagram"width="30px" height="30px" /></a>
                                <a href=""><img src={youtube} alt="Youtube" width="30px" height="30px" /></a>
                            </div> 
                    </div>
                </div>
                <div className="row">
                    <div className="col-12" style={{ textAlign: 'center', paddingBottom : 10 + 'px'}}>
                        &copy; RecipeHub Limited - 2026
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
