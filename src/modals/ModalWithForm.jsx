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
      showDefaultButtons = true,
    },
    ref,
  ) => {
    // ESC key closes modal
    useEffect(() => {
      const handleEsc = (e) => {
        if (e.key === "Escape" && onClose) onClose();
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    // Recursive search for button elements in children
    const hasChildButtons = (nodes) =>
      React.Children.toArray(nodes).some((child) => {
        if (!child || typeof child !== "object") return false;
        if (
          child.type === "button" ||
          (child.props && child.props.type === "submit")
        )
          return true;
        if (child.props && child.props.children)
          return hasChildButtons(child.props.children);
        return false;
      });

    const containsButtons = hasChildButtons(children);

    return (
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target.classList.contains("modal") && onClose) {
            onClose();
          }
        }}
      >
        <div
          className="modal__container"
          ref={ref}
          onClick={(e) => e.stopPropagation()}
        >
          {/* <button onClick={() => console.log("test")}>test</button> */}
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

          <h2 className="modal__title">{title}</h2>

          <form
            className="modal__form"
            onSubmit={(e) => {
              e.preventDefault();

              console.log("modal submitted");
              onSubmit(e);
            }}
          >
            {children}

            {!hideSubmit && showDefaultButtons && !containsButtons && (
              <div className="modal__actions">
                <button
                  type="submit"
                  onClick={() => console.log("button clicked")}
                  className={`modal__btn modal__btn--primary ${
                    isDirty ? "modal__btn--dirty" : ""
                  } ${submitClassName || ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : submitText}
                </button>

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
  },
);

export default ModalWithForm;
