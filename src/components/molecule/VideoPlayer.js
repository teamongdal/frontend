import React, { forwardRef, useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Video from "react-native-video";

const { width, height } = Dimensions.get("window");

const VideoPlayer = forwardRef(
  (
    {
      videoUrl,
      setIsPlaying,
      isPlaying,
      setShowSearchButtons,
      productListVisible,
      showControls,
      setShowControls,
    },
    ref
  ) => {
    // 0.5초 후에 버튼 숨기기
    useEffect(() => {
      if (!isPlaying) {
        setShowControls(true);
      } else if (showControls) {
        const timeout = setTimeout(() => {
          setShowControls(false);
        }, 2500);
        return () => clearTimeout(timeout);
      }
    }, [isPlaying, showControls]);

    //video_0001 = 스카이캐슬
    const timeline = {
      video_0001: [
        { seconds: 1, frames: 1 },
        // { seconds: 2, frames: 1 },
        // { seconds: 3, frames: 1 },
        { seconds: 15, frames: 1 },
        { seconds: 23, frames: 25 },
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
      <Video
        ref={ref}
        source={{
          uri: "https://ai-shop-bucket.s3.ap-southeast-2.amazonaws.com/vod/vod_our_E10_1.mp4", //uri: videoUrl,
        }}
        style={[styles.video, productListVisible ? styles.small : ""]}
        resizeMode="contain"
        paused={!isPlaying}
        onProgress={handleProgress}
      />
    );
  }
);

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: (width * 9) / 16, // 4:3 비율
  },
  video: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  small: {
    width: (width * 7) / 10,
    height: ((width * 7) / 10) * (9 / 16), /// 4:3 비율
  },
});
