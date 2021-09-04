import React from "react";
import { useHistory } from "react-router-dom";

import "./ErrorPage.css";
function ErrorPage() {
  const history = useHistory();
  return (
    <div className="errorPage">
      <div className="errorPageData">
        <h1> Hi There!</h1>
        <h3>You are not logged in</h3>
        <br />
        <br />
        <h3>To Login</h3>
        <button
          className="gotoLogin"
          onClick={(e) => {
            e.preventDefault();
            history.push("/");
          }}
        >
          Click here
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
