// eslint-disable-next-line import/no-unresolved
import { Navbar, Welcome, Footer,  Transactions } from "./components";

const App = () => (
  <div className="min-h-screen">
    <div className="bg-gradient-to-r from-blue-800 to-black">
      <Navbar />
      <Welcome />
    </div>
    
    <Transactions />
    <Footer />
  </div>
);

export default App;
