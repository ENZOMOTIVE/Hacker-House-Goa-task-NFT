import React from "react";
import { Navbar, Welcome } from "./components";

const App = () => (
  <div className="min-h-screen">
    <div className="bg-navbar">
      <Navbar />
      <Welcome />
    </div>
  </div>
);

export default App;
