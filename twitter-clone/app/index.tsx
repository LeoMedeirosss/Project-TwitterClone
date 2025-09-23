import React, { useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import Header from "../src/components/Header";
import Feed from "../src/components/Feed";
import BottomBar from "../src/components/BottomBar";
import Sidebar from "../src/components/Sidebar";
import FloatingButton from "../src/components/FloatingButton";
import { useAuth } from "../src/contexts/AuthContext";

export default function Index() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { isAuthenticated } = useAuth();
  const feedRef = useRef(null);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <View style={styles.container}>
      <Header scrollY={scrollY} onProfilePress={() => setSidebarVisible(true)} />
      <Feed ref={feedRef} onScroll={handleScroll} />
      <BottomBar />
      {isAuthenticated && (
        <Sidebar 
          visible={sidebarVisible} 
          onClose={() => setSidebarVisible(false)} 
        />
      )}
      <FloatingButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
