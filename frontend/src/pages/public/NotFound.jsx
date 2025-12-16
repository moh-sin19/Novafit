import NotFoundImg from "../../assets/images/404.svg";
import ErrorPageLayout from "../../layout/ErrorPageLayout";

export default function NotFound() {
  return <ErrorPageLayout imgsrc={NotFoundImg} alt="404 Not Found" headingtext="Page Not Found"/>;
}
