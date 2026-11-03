import { Outlet } from "react-router-dom";
import useCart from "../hooks/useCart";
import Footer from "./Footer";
import Navbar from "./Navbar";

function RootLayout() {
  const { itemCount } = useCart();

  return (
    <>
      <Navbar cartItemCount={itemCount} />
      <Outlet />
      <Footer />
    </>
  );
}

export default RootLayout;
