import React, { forwardRef, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

const VideoPlayer = forwardRef(
  ({ videoUrl, setIsPlaying, isPlaying, setShowSearchButtons }, ref) => {
    //video_0001 = 스카이캐슬
    const timeline = {
      video_0001: [
        { seconds: 2, frames: 27 },
        { seconds: 4, frames: 8 },
        { seconds: 38, frames: 26 },
      ],
      video_0002: [
        { seconds: 16, frames: 8 },
        { seconds: 38, frames: 26 },
        { seconds: 94, frames: 22 },
        { seconds: 171, frames: 15 },
      ],
    };

    // 초 + 프레임을 초 단위로 변환 (30fps 기준)
    const convertToSeconds = (seconds, frames) => {
      return seconds + frames / 30;
    };

    const videoKey = "video_0001";

    const stopTimes = videoKey
      ? timeline[videoKey].map(({ seconds, frames }) =>
          convertToSeconds(seconds, frames)
        )
      : [];

    const [curIdx, setCurIdx] = useState(0);
    // 현재 영상 시간 감지하여 특정 타임라인에 도달하면 멈춤
    const handleProgress = ({ currentTime }) => {
      const currentFrame = Math.round(currentTime * 24);

      if (curIdx >= stopTimes.length) return;

      console.log("currentTime: ", currentTime, "currentFrame: ", currentFrame);
      if (currentTime >= stopTimes[curIdx]) {
        setIsPlaying(false);
        setShowSearchButtons(true);
        setCurIdx((prevIdx) => prevIdx + 1);
      }
    };

    return (
      <View style={styles.container}>
        <Video
          ref={ref}
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode="cover"
          paused={!isPlaying}
          onProgress={handleProgress}
        />

        {/* Play/Pause 버튼 */}
        {/* <TouchableOpacity
          style={styles.playPauseButton}
          onPress={() => setIsPlaying((prev) => !prev)}
        >
          <Icon name={isPlaying ? "pause" : "play"} size={30} color="white" />
        </TouchableOpacity> */}
      </View>
    );
  }
);

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: (width * 9) / 16,
  },
  video: {
    position: "absolute",
    width: "100%",
    height: "100%",
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
