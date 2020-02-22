import { createStore } from "redux";
import cartReducer from "../reducers/index";

const store = createStore(cartReducer);

export default store;