import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import axios from "../axios";
import "./Login.css";

import { useSelector, useDispatch } from "react-redux";
import { signIn } from "../actions";

function Login() {
  const isLoggedIn = useSelector((state) => state.authDetails.isLoggedIn);
  const dispatch = useDispatch();

  const history = useHistory();
  const [refresh, setRefresh] = useState(false);

  const [ContainerActive, setContainerActive] = useState("signInUp");

  const [emailValue_signup, setEmailValue_signup] = useState("");
  const [passwordValue_signup, setPasswordValue_signup] = useState("");
  const [usernameValue_signup, setUsernameValue_signup] = useState("");

  const [emailValue_signin, setEmailValue_signin] = useState("");
  const [passwordValue_signin, setPasswordValue_signin] = useState("");

  const [errorDisplay, setErrorDisplay] = useState({
    message: "",
    state: false,
    type: "",
  });

  useEffect(() => {
    setEmailValue_signin("");
    setEmailValue_signup("");
    setPasswordValue_signin("");
    setPasswordValue_signup("");
    setUsernameValue_signup("");
  }, [refresh]);

  const signupfunc = () => {
    setContainerActive("signInUp right__panel__active");
  };
  const signinfunc = () => {
    setContainerActive("signInUp");
  };

  const responseGoogle_signin = async (response) => {
    var res = response.profileObj;
    try {
      if (
        !res.googleId ||
        !res.givenName ||
        !res.email ||
        !response.tokenObj.access_token
      ) {
        throw Error();
      }
      const userSignInData = {
        password: res.googleId.substring(0, 5) + res.givenName,
        email: res.email,
      };
      // const config = {
      //   headers: { "x-access-token": response.tokenObj.access_token },
      // };
      await handleSignin(userSignInData);
    } catch (err) {
      console.log(err);
    }
  };
  const responseFacebook_signin = async (response) => {
    //console.log(response);
    try {
      if (!response.name || !response.accessToken) {
        throw Error();
      }
      const userSignInData = {
        password: response.name,
        email: response.name,
      };
      //console.log(userSignInData);
      // const config = {
      //   headers: { "x-access-token": response.accessToken },
      // };
      await handleSignin(userSignInData);
    } catch (err) {
      console.log(err);
    }
  };

  const responseTable_signin = async (e) => {
    e.preventDefault();

    const userSignInData = {
      email: emailValue_signin,
      password: passwordValue_signin,
    };

    await handleSignin(userSignInData);

    setRefresh(!refresh);
  };

  const handleSignin = async (userData) => {
    try {
      const signInResponse = await axios.post("/Login/signin", userData);
      console.log(signInResponse);
      dispatch(signIn(signInResponse.data.values.id));
      localStorage.setItem("userId", signInResponse.data.values.id);
      history.push("/Home");
    } catch (err) {
      console.log(err.response);
      setErrorDisplay({
        state: true,
        message: "Incorrect Details",
        type: "err",
      });
    }
  };

  const responseGoogle_signup = async (response) => {
    var res = response.profileObj;

    try {
      if (!res.givenName || !res.googleId || !res.email) {
        throw Error();
      }

      const userSignUpData = {
        name:
          res.givenName +
          " " +
          (res.familyName === undefined ? "" : res.familyName),
        password: res.googleId.substring(0, 5) + res.givenName,
        email: res.email,
      };
      // console.log(userSignUpData);
      // const config = {
      //   headers: { "x-access-token": response.tokenObj.access_token },
      // };
      await handleSignup(userSignUpData);
    } catch (err) {
      console.log(err);
    }
  };
  const responseFacebook_signup = async (response) => {
    try {
      if (!response || !response.name) {
        throw Error();
      }
      console.log(response);
      const userSignUpData = {
        name: response.name,
        password: response.name,
        email: response.name,
      };
      // console.log(userSignUpData);

      await handleSignup(userSignUpData);
    } catch (err) {
      console.log(err);
    }
  };

  const responseTable_signup = async (e) => {
    e.preventDefault();
    try {
      const userSignUpData = {
        email: emailValue_signup,
        name: usernameValue_signup,
        password: passwordValue_signup,
      };

      await handleSignup(userSignUpData);
    } catch (err) {
      console.log(err);
    }

    setRefresh(!refresh);
  };

  const handleSignup = async (Data) => {
    try {
      const signUpResponse = await axios.post("/Login/signup", Data);
      console.log(signUpResponse);
      dispatch(signIn(signUpResponse.data.values.id));
      localStorage.setItem("userId", signUpResponse.data.values.id);
      history.push("/Home");
    } catch (err) {
      console.log(err.response);
      setErrorDisplay({
        state: true,
        message: "Incorrect Details",
        type: "err",
      });
    }
  };

  useEffect(() => {
    if (errorDisplay.state) {
      setTimeout(() => {
        setErrorDisplay({ state: false, message: "", type: "" });
      }, 3000);
    }
  }, [errorDisplay.state]);

  useEffect(() => {
    if (isLoggedIn) {
      history.push("/Home");
    }
  }, [isLoggedIn]);

  return (
    <div className="Login">
      {errorDisplay.state && (
        <div className={"error_message_" + errorDisplay.type}>
          {errorDisplay.message}
        </div>
      )}

      <div className={ContainerActive} id="signInUp">
        <div className="form__container sign__up">
          <form className="form" action="/" onSubmit={responseTable_signup}>
            <h1 className="heading1">Create Account</h1>
            <div className="social">
              <span className="anchor">
                <FacebookLogin
                  appId={process.env.REACT_APP_facebook_id}
                  autoLoad={false}
                  buttonText=""
                  callback={responseFacebook_signup}
                  render={(renderProps) => (
                    <FaFacebook
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    />
                  )}
                />
              </span>
              <span className="anchor">
                <GoogleLogin
                  clientId={process.env.REACT_APP_CLIENT_ID}
                  buttonText=""
                  render={(renderProps) => (
                    <FcGoogle
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    />
                  )}
                  onSuccess={responseGoogle_signup}
                  onFailure={responseGoogle_signup}
                ></GoogleLogin>
              </span>
            </div>
            <span className="span">or use your email for registration</span>
            <input
              className="input"
              type="text"
              value={usernameValue_signup}
              onChange={(e) => setUsernameValue_signup(e.target.value)}
              placeholder="Username"
              required
            />
            <input
              className="input"
              type="email"
              value={emailValue_signup}
              onChange={(e) => setEmailValue_signup(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              className="input"
              type="password"
              value={passwordValue_signup}
              onChange={(e) => setPasswordValue_signup(e.target.value)}
              placeholder="Password"
              required
            />
            <input type="submit" className="buttons" value="SIGN UP" />
          </form>
        </div>
        <div className="form__container sign__in">
          <form className="form" action="/" onSubmit={responseTable_signin}>
            <h1 className="heading1">Sign in</h1>
            <div className="social">
              <span className="anchor">
                <FacebookLogin
                  appId={process.env.REACT_APP_facebook_id}
                  autoLoad={false}
                  buttonText=""
                  callback={responseFacebook_signin}
                  render={(renderProps) => (
                    <FaFacebook
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    />
                  )}
                />
              </span>
              <span className="anchor">
                <GoogleLogin
                  clientId={process.env.REACT_APP_CLIENT_ID}
                  buttonText=""
                  render={(renderProps) => (
                    <FcGoogle
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    />
                  )}
                  onSuccess={responseGoogle_signin}
                  onFailure={responseGoogle_signin}
                ></GoogleLogin>
              </span>
            </div>
            <span className="span">or use your account</span>
            <input
              className="input"
              type="email"
              value={emailValue_signin}
              onChange={(e) => setEmailValue_signin(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              className="input"
              type="password"
              value={passwordValue_signin}
              onChange={(e) => setPasswordValue_signin(e.target.value)}
              placeholder="Password"
              required
            />
            <input type="submit" className="buttons" value="SIGN IN" />
          </form>
        </div>
        <div className="overlay__moving__box">
          <div className="overlay">
            <div className="overlay__panel overlay__left">
              <h1 className="heading1">Welcome Back!</h1>
              <p className="para">Already have account?</p>
              <button
                className="buttons ghost"
                id="signIn"
                onClick={signinfunc}
              >
                Sign In
              </button>
            </div>
            <div className="overlay__panel overlay__right">
              <h1 className="heading1">Hey There!</h1>

              <p className="para">
                New here? Enter details and start journey with us
              </p>
              <button
                className="buttons ghost"
                id="signUp"
                onClick={signupfunc}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
