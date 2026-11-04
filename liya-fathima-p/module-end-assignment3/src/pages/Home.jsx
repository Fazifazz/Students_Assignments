
import { useNavigate } from "react-router-dom";

import Hero from "../components/Hero";
import Features from "../components/Features";
import Categories from "../components/Categories";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    navigate("/products", {
      state: { category },
    });
  };

  return (
    <>
      <Hero />
      <Features />

      <Categories
        onCategorySelect={handleCategorySelect}
      />

      <Newsletter />
      <Footer />
    </>
  );
}

export default Home;
