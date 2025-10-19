import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
<<<<<<< Updated upstream
import CustomerPage from "./pages/CustomerPage";// trang này bạn sẽ làm sau
=======
>>>>>>> Stashed changes
import "./App.css";
import MenuCustomer from "./components/MenuCustomer";

function App() {
<<<<<<< Updated upstream
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/customers" element={<CustomerPage />} />
      </Routes>
    </Router>
  );
=======
return (
<Router>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/menu" element={<MenuPage />} />
<Route path="/customers" element={<MenuCustomer />} />
</Routes>
</Router>
);
>>>>>>> Stashed changes
}

export default App;