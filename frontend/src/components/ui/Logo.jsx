import { Link } from "react-router-dom";
import LogoLight from "../../assets/images/logo-light.svg";
import LogoDark from "../../assets/images/logo-dark.svg";

export default function Logo() {
  return (
    <Link to="/" className="block">
      <img
        src={LogoLight}
        alt="Logo"
        className="w-[135px] h-auto hidden dark:block"
      />
      <img src={LogoDark} alt="Logo" className="w-[135px] h-auto dark:hidden" />
    </Link>
  );
}
