import MaintenanceImg from "../../assets/images/maintenance.svg";
import ErrorPageLayout from "../../layout/ErrorPageLayout";

export default function Maintenance() {
  return <ErrorPageLayout imgsrc={MaintenanceImg} alt="Maintenance" headingtext="Under maintenance"/>;
}
