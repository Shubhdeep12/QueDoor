import React from "react";
import "./Loading.css";

function Loading() {
  return (
    <div className="loading">
      <div className="loader">
        <div className="line__left"></div>
        <div className="ball"></div>
        <div className="line__right"></div>
      </div>
    </div>
  );
}

export default Loading;
