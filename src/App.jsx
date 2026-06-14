import { useEffect, useState } from "react";
import useReveal from "./hooks/useReveal";
import Admin from "./components/Admin";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Specialties from "./components/Specialties";
import Menu from "./components/Menu";
import Gallery from "./components/Gallery";
import Reviews from "./components/Reviews";
import Visit from "./components/Visit";
import Footer from "./components/Footer";
import "./App.css";

function useHashRoute() {
  const [hash, setHash] = useState(() => (typeof window !== "undefined" ? window.location.hash : ""));
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
}

function App() {
  useReveal();
  const hash = useHashRoute();

  if (hash.replace(/^#/, "").toLowerCase().startsWith("admin")) {
    return <Admin />;
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Specialties />
        <Menu />
        <Gallery />
        <Reviews />
        <Visit />
      </main>
      <Footer />
    </>
  );
}

export default App;
