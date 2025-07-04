import Footer from "./shared/Footer";
import Navbar from "./shared/Navbar";
import { Outlet } from "react-router";

function App() {
  return (
    <>
      <div className="container mx-auto">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </>
  );
}

export default App;
