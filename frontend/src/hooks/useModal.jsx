import { useState, useCallback } from "react";

/** Centralized modal state for consistent UX across forms */
export default function useModal() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("info"); // "success" | "error" | "info"
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [confirmText, setConfirmText] = useState("OKAY");

  const show = useCallback((opts = {}) => {
    const {
      type = "info",
      title = "",
      description = "",
      confirmText = "OKAY",
    } = opts;
    setType(type);
    setTitle(title);
    setDescription(description);
    setConfirmText(confirmText);
    setOpen(true);
  }, []);

  const showSuccess = useCallback(
    (title, description = "", confirmText = "OKAY") => {
      show({ type: "success", title, description, confirmText });
    },
    [show]
  );

  const showError = useCallback(
    (title, description = "", confirmText = "OKAY") => {
      show({ type: "error", title, description, confirmText });
    },
    [show]
  );

  const showInfo = useCallback(
    (title, description = "", confirmText = "OKAY") => {
      show({ type: "info", title, description, confirmText });
    },
    [show]
  );

  const close = useCallback(() => setOpen(false), []);

  return {
    open,
    type,
    title,
    description,
    confirmText,
    show,
    showSuccess,
    showError,
    showInfo,
    close,
  };
}
