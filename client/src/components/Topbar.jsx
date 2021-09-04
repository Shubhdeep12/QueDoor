import React from "react";
import { Link } from "react-router-dom";
import "./Topbar.css";
import { FiSun, FiMoon } from "react-icons/fi";
import { AccountCircle } from "@material-ui/icons";
import { toggle } from "../actions";
import { useSelector, useDispatch } from "react-redux";
function Topbar({ togo }) {
  let currentTheme = useSelector((state) => state.themeDetails.theme);
  const dispatch = useDispatch();
  return (
    <div>
      <div className="topbar">
        <div className="left__logo">
          <Link className="left__logo__button" to="/Home">
            <span>QueDoor</span>
          </Link>
        </div>

        <div className="middle">
          <Link to={"/" + togo}>
            <button className="filter__button">{togo}</button>
          </Link>
        </div>

        <div className="right__account">
          <Link className="Account__button" to="/Account">
            <AccountCircle />
          </Link>
        </div>
        <div className="theme__button">
          {currentTheme === "Light" ? (
            <FiMoon
              onClick={(e) => {
                e.preventDefault();
                localStorage.setItem("theme", "Dark");
                dispatch(toggle("Dark"));
              }}
            />
          ) : (
            <FiSun
              onClick={(e) => {
                e.preventDefault();
                localStorage.setItem("theme", "Light");
                dispatch(toggle("Light"));
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Topbar;
