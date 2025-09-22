import React from "react";
import "../styles/preloader.css";

const Preloader = ({ text = "Loading recipes..." }) => {
  return (
    <div className="preloader-container">
      <div className="circle-preloader"></div>
      <p className="preloader-text">{text}</p>
    </div>
  );
};

export default Preloader;
