export const signIn = (value = "") => {
  return {
    type: "SIGNIN",
    idValue: value,
  };
};

export const signout = () => {
  return {
    type: "SIGNOUT",
  };
};

export const toggle = (
  value = localStorage.getItem("theme")
    ? localStorage.getItem("theme")
    : "Light"
) => {
  return {
    type: "TOGGLE",
    theme: value,
  };
};
