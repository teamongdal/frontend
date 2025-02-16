import React, { forwardRef } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/FontAwesome";

const { width, height } = Dimensions.get("window");

const VideoPlayer = forwardRef(({ videoUrl, setIsPlaying, isPlaying }, ref) => {
  return (
    <View style={styles.container}>
      <Video
        ref={ref}
        source={{ uri: videoUrl }}
        style={styles.video}
        resizeMode="cover" // 화면을 완전히 채우도록 설정
        paused={!isPlaying}
      />
      <TouchableOpacity
        style={styles.playPauseButton}
        onPress={() => setIsPlaying((prev) => !prev)}
      >
        <Icon name={isPlaying ? "pause" : "play"} size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
});

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
  },
  video: {
    width: width,
    height: height, // 화면을 꽉 채우기
    position: "absolute",
    top: 0,
    left: 0,
  },
  playPauseButton: {
    position: "absolute",
    top: "45%",
    left: "50%",
    transform: [{ translateX: -30 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
  },
});
