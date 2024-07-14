import React from "react";
import { Navbar, Welcome } from "./components";

const App = () => (
  <div className="min-h-screen">
    <div className="gradient-bg-welcome">
      <Navbar />
      <Welcome />
    </div>
    <div className="gradient-bg-services">
      {/* Your services section */}
    </div>
    <div className="gradient-bg-transactions">
      {/* Your transactions section */}
    </div>
    <div className="gradient-bg-footer">
      {/* Your footer section */}
    </div>
  </div>
);

export default App;
