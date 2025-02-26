import React, { forwardRef, useState, useEffect } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Video } from "expo-av";

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
    // 재생 중일 때 2.5초 후에 컨트롤 버튼 숨기기
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

    // 타임라인 데이터 (예시)
    const timeline = {
      video_0001: [
        { seconds: 1, frames: 1 },
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

    // (30fps 기준) 초 + 프레임을 초 단위로 변환
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

    // expo-av Video는 onPlaybackStatusUpdate를 사용합니다.
    const handlePlaybackStatusUpdate = (status) => {
      if (!status.isLoaded) return;
      const currentTime = status.positionMillis / 1000; // 밀리초 → 초 변환
      if (curIdx >= stopTimes.length) return;
      console.log("currentTime: ", currentTime);
      if (currentTime >= stopTimes[curIdx]) {
        setIsPlaying(false);
        setShowSearchButtons(true);
        setCurIdx((prevIdx) => prevIdx + 1);
      }
    };

    return (
      <Video
        ref={ref}
        source={{ uri: videoUrl }}
        style={[styles.video, productListVisible ? styles.small : null]}
        resizeMode="contain"
        // expo-av는 paused 대신 shouldPlay를 사용합니다.
        shouldPlay={isPlaying}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
    );
  }
);

export default VideoPlayer;

const styles = StyleSheet.create({
  video: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  small: {
    width: (width * 7) / 10,
    height: ((width * 7) / 10) * (9 / 16),
  },
});
