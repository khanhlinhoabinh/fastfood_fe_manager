import React from "react";
import Navbar from "../components/Navbar";
import MenuSection from "../components/MenuSection";
import "./MenuPage.css";


const MenuPage = () => {
return (
<div className="menu-page">
<Navbar />
<div className="menu-content">
<MenuSection />
</div>
</div>
);
};

export default MenuPage;