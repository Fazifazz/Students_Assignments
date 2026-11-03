import { useState } from "react";
import useProducts from "../hooks/useProducts";
import { CategoryFilter } from "./CategoryFilter.jsx";
import ProductCard from "./ProductCard";
import { useNavigate, useSearchParams } from "react-router-dom";


function Products(){

    const { data, loading, error } = useProducts('/products');

    const [searchParam,setSearchParam] =  useSearchParams();
    const category = searchParam.get('category') || 'ALL'
    const [selectedCategory,setSelectedCategory] =  useState(category);
    
    const [searchText, setSearchText] = useState("");
    const [submittedSearch, setSubmittedSearch] = useState("");

    const navigate = useNavigate();
    if (loading) return <p>Loading Products...</p>;
    if (error) return <p>{error}</p>;

    const categories = ["ALL", ... new Set(data.map(product => product.category.toUpperCase())), "BAGS and WALLETS","BOOKS", "FOOTWEAR", "HOME and DECOR"]
    const filteredProducts = data.filter(product => {
                                            const matchesCategory =  selectedCategory === "ALL" ||  product.category.toLowerCase() === selectedCategory.toLowerCase();

                                            const matchesSearch = product.title.toLowerCase().includes(submittedSearch.toLowerCase());

                                            return matchesCategory && matchesSearch;
                                        });

    function handleSearch() {
        setSubmittedSearch(searchText.trim());
    }

    function handleReset(){
        setSearchText("");
        setSubmittedSearch("");
    }

    return (
            <>
            <div className="container-fluid my-4">
            <div className="row g-4">

                {/* Left category sidebar */}
                <aside className="col-12 col-md-3 col-lg-2">
                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                    />
                </aside>

                 {/* Right products section */}
                <section className="col-12 col-md-9 col-lg-10">
                    <h2 id="featured_pdts">Products</h2>
                    <br/><br/>
                    <div style={{"textAlign":"center"}}>
                        <label htmlFor="searchInput" name="searchLabel">SEARCH</label> &nbsp; &nbsp;
                        <input id="searchInput" type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} onKeyDown={(e) => {
                                     if (e.key === "Enter") handleSearch();
                                    }}
                                placeholder="Enter product name"
                             />

                         &nbsp;&nbsp;

                        <button type="button" className="btn btn-primary searchBtns" onClick={handleSearch} >
                             Search
                         </button>

                         &nbsp;&nbsp;

                        <button type="button" className="btn btn-primary searchBtns" onClick={handleReset} >
                             Reset
                         </button>
                    
                    </div><br/><br/> <br/><br/> 
                         

                    <div className="container-fluid">
                        <div className="row g-4 featured-pdt-row">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <ProductCard key={product.id} {...product}  fList={0} /> 
                                )) 
                                ) : (
                               <>
                               <div className="col-12">
                                     <div className="no-products-found">
                                          <p>No products found in this category.</p>

                                         <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                setSelectedCategory("ALL");
                                                setSearchText("");
                                                setSubmittedSearch("");
                                                setSearchParam({});
                                            }}
                                        >
                                            Continue Shopping
                                        </button>
                                    </div>
                                </div>
                               </> 
                            )}

                             
                        </div>
                    </div>
                </section>

            </div>
        </div>
                        
            </>   
    );   
}

export default Products