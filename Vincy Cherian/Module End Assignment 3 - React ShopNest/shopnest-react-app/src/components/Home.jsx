import { Link } from "react-router-dom"
import books from "../assets/books category.png"
import womenClothing from "../assets/clothing_category.png"
import bags from "../assets/category-3.png"
import footwear from "../assets/category-4.png"
import jewelery from "../assets/category-55.png"
import homeDecor from "../assets/category-6.png"
import electronics from "../assets/category-7.png"
import mensClothing from "../assets/category-8.png"


function Home(){

    return(
        <>
        {/* <!-- Hero Section --> */}
        
        <section id="hero">
            <div id="ShopNest-carousel" className="carousel slide">
                <div className="carousel-inner">
                    <div id="carousel_1" className="carousel-item active">
                        <p className="carousel-begin-content">WELCOME TO SHOPNEST</p>
                        <p className="carousel-content-main">Shop More,<br/>
                        Save More.</p>
                        <p className="carousel-content-sub">Everything you love, at prices you'll adore.</p>
                        <button id="shopnow">SHOP NOW</button>
                    </div>
                    <div id="carousel_2" className="carousel-item">
                        <p className="carousel-begin-content">NEW SEASON</p>
                        <p className="carousel-content-main">FRESH FINDS.<br/>
                        JUST FOR YOU.</p>
                        <p className="carousel-content-sub">Discover the latest trends across <br/> fashion, lifestyle & more.</p>
                        <button id="explorenow">EXPLORE NOW</button>
                    </div>
                    <div id="carousel_3" className="carousel-item">
                        <p className="carousel-begin-content">LIMITED TIME OFFER</p>
                        <p className="carousel-content-main">BIG BRANDS.<br/>
                        BIGGER DEALS.</p>
                        <p className="carousel-content-sub">Grab amazing discounts on top brands. <br/> Hurry, before its gone!</p>
                        <button id="view_deal">VIEW DEALS</button>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#ShopNest-carousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#ShopNest-carousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </section>

        <aside className="text-center">
            <p> Limited-time deals available while stocks last!</p>
        </aside>

        {/* <!-- Browse by category Products --> */}
        <section id="categories">
            <h2 id="featured_pdts">Browse by Category</h2>
            <div className="container">
                <div className="row g-4 featured-pdt-row">
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="card h-100">
                            <Link to="/products?category=BOOKS" id="category-1">
                                <img src={books} className="card-img-top mx-auto feat-pdt-img" alt="Category-1" />
                            </Link>
                            <div className="card-body">
                                <h5 className="card-title">Books</h5>
                                <p className="card-text"> Discover new worlds, one page at a time. </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="card h-100">
                            <Link to="/products?category=WOMEN'S CLOTHING" id="category-2">
                                <img src={womenClothing} className="card-img-top mx-auto feat-pdt-img" alt="Category-2" />
                            </Link>
                            <div className="card-body">
                                <h5 className="card-title">Women's Clothing</h5>
                                <p className="card-text"> Trendy styles for every mood and moment. </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="card h-100">
                            <Link to="/products?category=BAGS and WALLETS" id="category-3">
                                <img src={bags} className="card-img-top mx-auto feat-pdt-img" alt="Category-3" />
                            </Link>
                            <div className="card-body">
                                <h5 className="card-title">Bags and Wallets</h5>
                                <p className="card-text"> Carry Style, Everywhere </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="card h-100">
                            <Link to="/products?category=FOOTWEAR" id="category-4">
                                <img src={footwear} className="card-img-top mx-auto feat-pdt-img" alt="Category-4" />
                            </Link>
                            <div className="card-body">
                                <h5 className="card-title">Footwear</h5>
                                <p className="card-text"> Step Into Comfort </p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="row g-4 featured-pdt-row">
                    
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="card h-100">
                            <Link to="/products?category=JEWELERY" id="category-5">
                                <img src={jewelery} className="card-img-top mx-auto feat-pdt-img" alt="Category-5" />
                            </Link>
                            <div className="card-body">
                                <h5 className="card-title">Jewelry</h5>
                                <p className="card-text"> Feel Good, Look Great </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="card h-100">
                            <Link to="/products?category=HOME and DECOR" id="category-6">
                                <img src={homeDecor} className="card-img-top mx-auto feat-pdt-img" alt="Category-6" />
                            </Link>
                            <div className="card-body">
                                <h5 className="card-title">Home & Decor</h5>
                                <p className="card-text"> Make Your Space Yours </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="card h-100">
                            <Link to="/products?category=ELECTRONICS" id="category-7">
                                <img src={electronics} className="card-img-top mx-auto feat-pdt-img" alt="Category-7" />
                            </Link>
                            <div className="card-body">
                                <h5 className="card-title">Electronics</h5>
                                <p className="card-text"> Power Your Everyday </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="card h-100">
                            <Link to="/products?category=MEN'S CLOTHING" id="category-8">
                                <img src={mensClothing} className="card-img-top mx-auto feat-pdt-img" alt="Category-8" />
                            </Link>
                            <div className="card-body">
                                <h5 className="card-title">Men's Clothing</h5>
                                <p className="card-text"> Style Made Simple </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        {/* <!-- Newsletter Section --> */}
        <section id="newsletter">
            <div className="newsltr-section">
                    <h2 id="newsletter-title">Newsletter SignUp</h2>
                    <div className="container">
                        <div className="row h-40 justify-content-center">
                            <div id="newsltr-items" className="col-12 col-md-12 col-sm-12 col-lg-12">
                                    <label className="news-itemClass" id="email_id_label" htmlFor="cust_email_id">Email ID</label>
                                    <input className="news-itemClass" type="email" id="cust_email_id" name="cust_email_id" placeholder="Enter your Email ID" required />
                                    <button id="btn-subscribe" type="submit" className="btn btn-primary news-itemClass">Subscribe</button>
                            </div>
                        </div>
                    </div>
            </div>
        </section>


        

        </>
    )
}

export default Home