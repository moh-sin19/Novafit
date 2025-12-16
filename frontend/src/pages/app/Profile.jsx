import DashboardLayout from "../../layout/DashboardLayout";
import UserInfoForm from "./profile/UserInfoForm";
import ChangePasswordForm from "./profile/ChangePasswordForm";
import HealthProfileForm from "./profile/HealthProfileForm";
import PreferencesForm from "./profile/PreferencesForm";

export default function Profile() {
  return (
    <DashboardLayout>
      {/* USER INFO + PASSWORD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 ">
        <UserInfoForm />
        <ChangePasswordForm />
      </div>

      {/* HEALTH PROFILE */}
      <HealthProfileForm />

      {/* PREFERENCES */}
      <PreferencesForm />
    </DashboardLayout>
  );
}
