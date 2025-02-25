import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
const { width, height } = Dimensions.get("window");
const RetryAlertPage = ({ setIsRetry, retryText }) => {
  const handleClickGoVideoPage = () => {
    setIsRetry(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>{"인식 결과: "}</Text>
        <Text style={styles.subtitle}>{retryText}</Text>
        <TouchableOpacity
          onPress={() => {
            handleClickGoVideoPage();
          }}
        >
          <View style={styles.loadingWrapper}>
            <Image
              source={require("../../assets/icon-retry.png")}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    width: 280,
    height: 280,
    marginRight: 30,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    position: "absolute",
    top: 60,
    left: 60,
    resizeMode: "contain",
  },
});

export default RetryAlertPage;
