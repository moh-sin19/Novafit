import { Link } from "react-router-dom";
import PrimaryButton from "../buttons/PrimaryButton";
import Logo from "../ui/Logo";
import HamburgerMenu from "../buttons/HamburgerMenu";

export default function NavBar() {
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80; // Account for fixed navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-base/95 backdrop-blur-sm shadow-sm">
      {/*Hidden at smaller sizes (standard menu)*/}
      <div className="hidden lg:flex flex-row justify-center items-center py-3 w-[100%]">
        <div className="flex flex-row justify-center items-center gap-[5vw] mr-auto pl-[5%]">
          <a
            href="#features"
            onClick={(e) => handleSmoothScroll(e, "features")}
            className="b2 text-primary px-4 py-2 rounded-full hover:bg-secondary transition-all duration-200 cursor-pointer"
          >
            Features
          </a>
          <a
            href="#about"
            onClick={(e) => handleSmoothScroll(e, "about")}
            className="b2 text-primary px-4 py-2 rounded-full hover:bg-secondary transition-all duration-200 cursor-pointer"
          >
            About
          </a>
          <a
            href="#contact"
            onClick={(e) => handleSmoothScroll(e, "contact")}
            className="b2 text-primary px-4 py-2 rounded-full hover:bg-secondary transition-all duration-200 cursor-pointer"
          >
            Contact
          </a>
        </div>
        {/*<Link to={"/"}>*/}
          <Logo />
        {/*</Link>*/}
        <div className="flex flex-row justify-center items-center gap-[5vw] ml-auto pr-[4%]">
          <Link
            to={"/auth/login"}
            className="b2 text-primary px-4 py-2 rounded-full hover:bg-secondary transition-all duration-200"
          >
            Sign In
          </Link>
          <Link to={"/auth/create-profile"}>
            <PrimaryButton>REGISTER FOR FREE</PrimaryButton>
          </Link>
        </div>
      </div>
      {/*Hidden at larger sizes (hamburger menu)*/}
      <div className="flex lg:hidden flex-row justify-between items-center px-[6vw] py-3 w-[100%] bg-white">
        {/*<Link to={"/"}>*/}
          <Logo />
        {/*</Link>*/}
        <HamburgerMenu />
      </div>
    </div>
  );
}
