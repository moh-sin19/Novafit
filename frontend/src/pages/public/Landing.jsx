import NavBar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import Hero from "./landing/Hero";
import Features from "./landing/Features";
import About from "./landing/About";
import Contact from "./landing/Contact";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <NavBar />
      {/* Add padding top to account for fixed navbar */}
      <div className="pt-16">
        <Hero />
        <Features />
        <About />
        <Contact />
      </div>
      <Footer />
    </div>
  );
}
