import React from "react";
import Navbar from "./components/Navbar";
import MenuSection from "./components/MenuSection";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="banner">
        <img src="/src/assets/banner.webp" alt="banner" />
      </div>
      <MenuSection />
    </div>
  );
}

export default App;
