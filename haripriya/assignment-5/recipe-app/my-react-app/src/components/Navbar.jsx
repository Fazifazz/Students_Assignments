
import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <div className="container">

                <NavLink className="navbar-brand fw-bold" to="/">
                    <h5 className="brand">
                        <i className="fa-solid fa-utensils"></i>{" "}
                        RecipeHub
                    </h5>
                </NavLink>

                {/* Hamburger button */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#recipeNavbar"
                    aria-controls="recipeNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navigation links */}
                <div className="collapse navbar-collapse" id="recipeNavbar">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

                        <li className="nav-item">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? "active" : ""}`
                                }
                            >
                                Home
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/recipes"
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? "active" : ""}`
                                }
                            >
                                Recipes
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/favourites"
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? "active" : ""}`
                                }
                            >
                                Favourites
                            </NavLink>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
