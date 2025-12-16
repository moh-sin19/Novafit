import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import PrimaryButton from "../components/buttons/PrimaryButton";
import {Link} from "react-router-dom";

export default function ErrorPageLayout({ imgsrc, alt, headingtext }) {
    return <div className="flex flex-col h-[100vh] justify-between bg-secondary">
        <NavBar/>
        <div className="flex flex-col items-center justify-center gap-[4vh]">
            <img src={imgsrc} alt={alt} className="h-[30vh] max-w-[65vw] h-auto" />
            <h1>{ headingtext }</h1>
            <Link to={"/"}><PrimaryButton>RETURN TO HOMEPAGE</PrimaryButton></Link>
        </div>
        <Footer/>
    </div>;
}
