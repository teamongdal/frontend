import React, { forwardRef } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

const VideoPlayer = forwardRef(
  ({ videoUrl, setIsPlaying, isPlaying, timeline }, ref) => {
    // // 24fps 기준으로 프레임을 초 단위로 변환
    // const convertToSeconds = (timeObj) => {
    //   return timeObj.seconds + timeObj.frames / 24; // 1초 = 24프레임
    // };

    // 현재 영상 시간 감지하여 특정 타임라인에 도달하면 멈춤
    const handleProgress = ({ currentTime }) => {
      const currentFrame = Math.round(currentTime * 24);

      console.log("currentTime: ", currentTime, "currentFrame: ", currentFrame);
      if (currentTime >= 4.83) {
        setIsPlaying(false);
      }
    };

    const convertFramesToSeconds = (seconds, frames) => {
      return (seconds * 24 + frames) / 24;
    };

    const convertSecondsToFrames = (seconds, frames) => {
      return seconds * 24 + frames;
    };

    const timeObj = { seconds: 4, frames: 20 };
    const convertedTime = convertFramesToSeconds(
      timeObj.seconds,
      timeObj.frames
    );

    console.log(
      `${timeObj.seconds}초 ${
        timeObj.frames
      }프레임은 약 ${convertedTime.toFixed(2)}초`
    );

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
