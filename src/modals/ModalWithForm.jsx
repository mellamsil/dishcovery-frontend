import React, { forwardRef, useEffect } from "react";
import "../styles/modal.css";

const ModalWithForm = forwardRef(
  (
    {
      title,
      onClose,
      onSubmit,
      children,
      submitText = "Submit",
      secondaryText = "Cancel",
      secondaryAction,
      isLoading = false,
      closeIcon,
      submitClassName,
      isDirty = false,
      hideSubmit = false,
    },
    ref
  ) => {
    // ESC key to close modal
    useEffect(() => {
      const handleEsc = (e) => {
        if (e.key === "Escape" && onClose) onClose();
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    return (
      <div
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target.classList.contains("modal-overlay") && onClose)
            onClose();
        }}
      >
        <div className="modal" ref={ref} onClick={(e) => e.stopPropagation()}>
          {/* Close icon */}
          {closeIcon && onClose && (
            <button
              type="button"
              className="modal-close-button"
              onClick={onClose}
              aria-label="Close"
            >
              <img src={closeIcon} alt="Close" />
            </button>
          )}

          {/* Modal title */}
          <h2 className="modal-title">{title}</h2>

          {/* Form content */}
          <form className="modal-form" onSubmit={onSubmit}>
            {children}

            {!hideSubmit && (
              <div className="modal-actions">
                <button
                  type="submit"
                  className={`btn-primary ${
                    isDirty ? "btn-primary-dirty" : ""
                  } ${submitClassName || ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : submitText}
                </button>

                {/* Always render secondary button if secondaryText exists */}
                {secondaryText && (
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={secondaryAction || onClose}
                    disabled={isLoading}
                  >
                    {secondaryText}
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }
);

export default ModalWithForm;
