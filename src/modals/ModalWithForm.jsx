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
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target.classList.contains("modal") && onClose) onClose();
        }}
      >
        <div
          className="modal__container"
          ref={ref}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close icon */}
          {closeIcon && onClose && (
            <button
              type="button"
              className="modal__close"
              onClick={onClose}
              aria-label="Close"
            >
              <img src={closeIcon} alt="Close" className="modal__close-icon" />
            </button>
          )}

          {/* Modal title */}
          <h2 className="modal__title">{title}</h2>

          {/* Form content */}
          <form className="modal__form" onSubmit={onSubmit}>
            {children}

            {!hideSubmit && (
              <div className="modal__actions">
                <button
                  type="submit"
                  className={`modal__btn modal__btn--primary ${
                    isDirty ? "modal__btn--dirty" : ""
                  } ${submitClassName || ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : submitText}
                </button>

                {/* Secondary button */}
                {secondaryText && (
                  <button
                    type="button"
                    className="modal__btn modal__btn--cancel"
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
