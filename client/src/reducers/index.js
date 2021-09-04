import authReducer from "./user";
import themeReducer from "./theme";
import { combineReducers } from "redux";

const allReducers = combineReducers({
  authDetails: authReducer,
  themeDetails: themeReducer,
});

export default allReducers;
