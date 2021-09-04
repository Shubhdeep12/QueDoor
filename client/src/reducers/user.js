const authReducer = (state = { userId: "", isLoggedIn: false }, action) => {
  switch (action.type) {
    case "SIGNIN":
      return { userId: action.idValue, isLoggedIn: true };
    case "SIGNOUT":
      return { userId: "", isLoggedIn: false };

    default:
      return { userId: state.userId, isLoggedIn: state.isLoggedIn };
  }
};

export default authReducer;
