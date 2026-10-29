import logo from "../assets/RecipeHubLogo.png"
import { Link, NavLink } from "react-router-dom";

function Navbar(){
    return( 
        <header>
        {/*  NavBar */}
        <nav id="recipe-navbar" className="navbar navbar-expand-lg" >
            <Link to="/" className="navbar-brand" href="#">
                <img src={logo} alt="Recipe Hub Logo" />
            </Link>
        
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
            </button>
        
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <NavLink to="/" 
                        className={({isActive})=>`nav-link ${isActive? 'nav-link--active' : ''}`} ><b>HOME</b>
                    </NavLink>
                    
                    <NavLink to="/recipes"     
                             className={({isActive})=>`nav-link ${isActive? 'nav-link--active' : ''}`} ><b>RECIPES</b>
                    </NavLink>

                    <NavLink to="/favourites"          
                            className={({isActive})=>`nav-link ${isActive? 'nav-link--active' : ''}`} ><b>FAVOURITES</b>
                    </NavLink>
                </ul>
            </div>                          
        </nav>    
    </header>
        
    )

}

export default Navbar