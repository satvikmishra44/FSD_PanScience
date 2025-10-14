import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";


const VARIANT_STYLES = {
  success: "border-l-4 border-green-500",
  error: "border-l-4 border-red-500",
  warning: "border-l-4 border-yellow-500",
  info: "border-l-4 border-blue-500",
};

const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return ReactDOM.createPortal(
    <div className="fixed top-5 right-5 z-[1100] flex flex-col gap-2">
      <div
        className={`flex items-center gap-2 min-w-[300px] p-3 px-4 rounded-md border border-gray-200 shadow-md bg-white dark:bg-gray-800 dark:border-gray-700 ${VARIANT_STYLES[type]} animate-slideIn`}
      >
        <span className="text-gray-800 dark:text-gray-100 flex-1">{message}</span>
      </div>
    </div>,
    document.body
  );
};

export const showToast = (message, type = "info", duration = 3000) => {
  const el = document.createElement("div");
  document.body.appendChild(el);

  const root = createRoot(el);

  const handleClose = () => {
    root.unmount();
    el.remove();
  };

  root.render(<Toast message={message} type={type} duration={duration} onClose={handleClose} />);
};
