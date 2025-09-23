//main navigation
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { AuthProvider } from "../src/contexts/AuthContext";
import { TweetProvider } from "../src/contexts/TweetContext";
import store from "../src/redux/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <TweetProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </TweetProvider>
      </AuthProvider>
    </Provider>
  );
}
