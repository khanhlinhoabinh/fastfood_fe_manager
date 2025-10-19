import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import CustomerPage from "./pages/CustomerPage";// trang này bạn sẽ làm sau


import "./App.css";
import MenuCustomer from "./components/MenuCustomer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/customers" element={<MenuCustomer />} />
      </Routes>
    </Router>
  );
}

export default App;
     