import { createStore } from "redux";
import { UserReducer } from "./reducers/userReducer";

const store = createStore(UserReducer);

export default store;
