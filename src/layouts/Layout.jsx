
import { Outlet } from "react-router-dom";

import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";

export default function Layout() {
  return (
    <div className="site-shell">
      <NavBar />

      <main id="top" className="portfolio-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
