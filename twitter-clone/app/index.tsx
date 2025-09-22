import React, { useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import Header from "../src/components/Header";
import Feed from "../src/components/Feed";
import BottomBar from "../src/components/BottomBar";

export default function Index() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <View style={styles.container}>
      <Header scrollY={scrollY} />
      <Feed onScroll={handleScroll} />
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
