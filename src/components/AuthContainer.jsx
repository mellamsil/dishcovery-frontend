import React from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const AuthContainer = ({ activeAuth, onClose, onSignIn, onSignUp }) => {
  return (
    <>
      {activeAuth === "login" && (
        <LoginModal
          onClose={onClose}
          onSignIn={onSignIn}
          onSwitchToRegister={() => {
            onClose();
            setTimeout(() => onClose("register"), 0);
          }}
        />
      )}

      {activeAuth === "register" && (
        <RegisterModal
          onClose={onClose}
          onSignUp={onSignUp}
          onSwitchToLogin={() => {
            onClose();
            setTimeout(() => onClose("login"), 0);
          }}
        />
      )}
    </>
  );
};

export default AuthContainer;
