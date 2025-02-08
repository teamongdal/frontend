import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import Video from "react-native-video";
import ViewShot from "react-native-view-shot";
import Icon from "react-native-vector-icons/FontAwesome";
// import viewName from "../../../node_modules/react-native/jest/mockNativeComponent";

const { width, height } = Dimensions.get("window"); // 화면 크기 가져오기

const VideoPlayer = ({ videoUrl, videoName }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true); // 기본값: 자동 재생

  return (
    <>
      <Text>{videoName}</Text>
      <View style={styles.container}>
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode="cover"
          paused={!isPlaying} // 자동 재생
        />
        <TouchableOpacity
          style={styles.playPauseButton}
          onPress={() => setIsPlaying((prev) => !prev)}
        >
          <Icon name={isPlaying ? "pause" : "play"} size={30} color="white" />
        </TouchableOpacity>

        <Text style={styles.text}>{isPlaying ? "재생 중" : "멈춤 상태"}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  video: {
    width: width,
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
  },
  playPauseButton: {
    position: "absolute",
    bottom: 50,
    left: "50%",
    transform: [{ translateX: -30 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
  },
  text: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -40 }],
    fontSize: 18,
    color: "white",
  },
});

export default VideoPlayer;
