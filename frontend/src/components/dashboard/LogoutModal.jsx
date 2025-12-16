import { useNavigate } from "react-router-dom";
import Modal from "../ui/Modal";

const TOKEN_KEY = "token";

export default function LogoutModal({ open, onClose }) {
  const navigate = useNavigate();

  const handleConfirm = () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
    onClose?.();
    navigate("/", { replace: true });
  };

  return (
    <Modal
      open={open}
      type="success" // matches your green style
      title="Sign Out"
      description="You’ll be logged out of your account."
      confirmText="OKAY"
      onClose={onClose}
      onConfirm={handleConfirm}
    />
  );
}
