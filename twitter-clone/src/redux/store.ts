//any component can read this state
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import tweetReducer from "./slices/tweetSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tweets: tweetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
