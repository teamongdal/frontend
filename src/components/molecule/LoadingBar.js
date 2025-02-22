import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
const { width, height } = Dimensions.get("window");
const LoadingBar = ({ capturedImage }) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [Math.PI * 2 * 50, 0],
  });

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>옷 정보를 찾고 있어요...</Text>
        <Text style={styles.subtitle}>로딩중</Text>
        <View style={styles.loadingWrapper}>
          <Svg
            width={420}
            height={420}
            viewBox="0 0 140 140"
            style={styles.svgContainer}
          >
            <Circle
              cx="70"
              cy="70"
              r="50"
              stroke="#F2F2F2"
              strokeWidth="10"
              fill="none"
            />
            <AnimatedCircle
              cx="70"
              cy="70"
              r="50"
              stroke="#E6FF4E"
              strokeWidth="10"
              fill="none"
              strokeDasharray={Math.PI * 2 * 50}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </Svg>
          <Image
            source={{ uri: capturedImage }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1200,
  },
  overlay: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 28,
    color: "#888",
    marginBottom: 20,
  },
  loadingWrapper: {
    position: "relative",
    width: 420,
    height: 420,
  },
  svgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 150,
    position: "absolute",
    top: 60,
    left: 60,
    resizeMode: "contain",
  },
});

export default LoadingBar;
