const themeReducer = (
  state = {
    theme: localStorage.getItem("theme")
      ? localStorage.getItem("theme")
      : "Light",
  },
  action
) => {
  switch (action.type) {
    case "TOGGLE":
      return { theme: action.theme };

    default:
      return {
        theme: localStorage.getItem("theme")
          ? localStorage.getItem("theme")
          : "Light",
      };
  }
};

export default themeReducer;
