import React, { useState, forwardRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/FontAwesome";

const { width, height } = Dimensions.get("window");

// ✅ `forwardRef` 적용 후 export default
const VideoPlayer = forwardRef(({ videoUrl, videoName }, ref) => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <>
      <Text>{videoName}</Text>
      <View style={styles.container}>
        <Video
          ref={ref} // ✅ 부모 컴포넌트에서 전달된 ref 적용
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode="cover"
          paused={!isPlaying}
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
});

// ✅ `export default VideoPlayer`를 올바르게 적용
export default VideoPlayer;

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
    top: "45%",
    left: "50%",
    transform: [{ translateX: -30 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
  },
  text: {
    position: "absolute",
    top: "55%",
    bottom: 20,
    left: "51%",
    transform: [{ translateX: -40 }],
    fontSize: 18,
    color: "white",
  },
});
