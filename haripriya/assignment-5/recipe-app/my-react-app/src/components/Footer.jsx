import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer py-4 mt-5 text-start">
            <div className="container">
                <div className="row g-4">

                    {/* Column 1: About */}
                    <div className="footer-content">
                        <div className="footer-abt">
                            <Link to="/">
                                <h5 className="brand">
                                    <i className="fa-solid fa-utensils"></i>{" "}
                                    RecipeHub
                                </h5>
                            </Link>
                            <p>
                                <span className="brand fs-5"> RecipeHub</span> offers a world of delicious recipes, cooking inspiration, and culinary tips. Explore new flavors, master techniques, and bring your passion for cooking to life.
                            </p>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div className="quickLinks">
                            <h5>Quick Links</h5>
                            <ul className="list-unstyled">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/recipes">Recipes</Link></li>
                                <li><Link to="/favourites">Favourites</Link></li>
                            </ul>
                        </div>

                        {/* Column 3: Follow Us */}
                        <div className="follow-us">
                            <h5>Follow Us</h5>
                            <div className="social-icons">
                                <a href="https://www.facebook.com/" aria-label="Facebook">
                                    <i className="fa-brands fa-facebook"></i>
                                </a>
                                <a href="https://www.instagram.com/" aria-label="Instagram">
                                    <i className="fa-brands fa-instagram"></i>
                                </a>
                                <a href="https://www.youtube.com/" aria-label="YouTube">
                                    <i className="fa-brands fa-youtube"></i>
                                </a>
                            </div>
                        </div>
                    </div>


                </div>

                <hr />

                <p className="text-center mb-0">
                    © 2026 Recipe Finder. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;