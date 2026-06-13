import useReveal from "./hooks/useReveal";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Specialties from "./components/Specialties";
import Menu from "./components/Menu";
import Gallery from "./components/Gallery";
import Reviews from "./components/Reviews";
import Visit from "./components/Visit";
import Footer from "./components/Footer";
import PastryCurtain from "./components/PastryCurtain";
import "./App.css";

function App() {
  useReveal();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Specialties />
        <Menu />
        <Gallery />
        <Reviews />
        <Visit />
      </main>
      <Footer />
      <PastryCurtain />
    </>
  );
}

export default App;
