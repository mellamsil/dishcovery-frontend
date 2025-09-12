import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SignInModal from "../modals/SignInModal";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const Signin = () => {
  const { signin } = useContext(CurrentUserContext);
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // const handleSignIn = ({ email, password }) => {
  //   setError(null);
  //   signin(email, password)
  //     .then(() => {
  //       setShowModal(false);
  //       navigate("/profile");
  //     })
  //     .catch(() => setError("Failed to sign in (Stage 1 demo)"));
  // };

  const handleSignIn = ({ email, password }) => {
    const fakeUser = { name: "Demo User", email };
    contextSignIn("demo-token", fakeUser);
    navigate("/dashboard");
  };

  return (
    <>
      {showModal && (
        <SignInModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSignIn={handleSignIn}
        />
      )}
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default Signin;
