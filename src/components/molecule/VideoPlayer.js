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
      setCurrentTime,
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
    // const timeline = {
    //   video_0001: [
    //     // { seconds: 1, frames: 1 },
    //     // { seconds: 15, frames: 1 },
    //     { seconds: 100, frames: 25 },
    //   ],
    //   video_0002: [
    //     { seconds: 16, frames: 8 },
    //     { seconds: 38, frames: 26 },
    //     { seconds: 94, frames: 22 },
    //     { seconds: 171, frames: 15 },
    //   ],
    // };

    // (30fps 기준) 초 + 프레임을 초 단위로 변환
    // const convertToSeconds = (seconds, frames) => {
    //   return seconds + frames / 29.97;
    // };

    const videoKey = "video_0001";
    // const stopTimes = videoKey
    //   ? timeline[videoKey].map(({ seconds, frames }) =>
    //       convertToSeconds(seconds, frames)
    //     )
    //   : [];

    // const [curIdx, setCurIdx] = useState(0);

    // expo-av Video는 onPlaybackStatusUpdate를 사용합니다.
    // const handlePlaybackStatusUpdate = (status) => {
    //   if (!status.isLoaded) return;
    //   const currentTime = status.positionMillis / 1000; // 밀리초 → 초 변환
    //   setCurrentTime(status.positionMillis / 1000);
    //   if (curIdx >= stopTimes.length) return;
    //   // console.log("currentTime: ", currentTime);
    //   if (currentTime >= stopTimes[curIdx]) {
    //     setIsPlaying(false);
    //     setShowSearchButtons(true);
    //     setCurIdx((prevIdx) => prevIdx + 1);
    //   }
    // };

    // const handlePlaybackStatusUpdate = (status) => {
    //   if (!status.isLoaded) return;

    //   // 29.97fps 기준 프레임으로 변환
    //   const framesRaw = (status.positionMillis / 1000) * 29.97;

    //   // 소수점 이하 4자리까지 제한 (반올림)
    //   const currentFrames = Number(framesRaw.toFixed(4));

    //   // currentTime을 '프레임' 값으로 설정
    //   setCurrentTime(currentFrames);

    //   // if (curIdx >= stopTimes.length) return;

    //   // // stopTimes 역시 '프레임' 단위로 관리해야 비교가 일관됩니다.
    //   // if (currentFrames >= stopTimes[curIdx]) {
    //   //   setIsPlaying(false);
    //   //   setShowSearchButtons(true);
    //   //   setCurIdx((prevIdx) => prevIdx + 1);
    //   // }
    // };

    // const handlePlaybackStatusUpdate = (status) => {
    //   if (!status.isLoaded) return;

    //   // 1) 밀리초를 실제 초 단위로 변환
    //   const realSeconds = status.positionMillis / 1000; // ex) 10.134초

    //   // 2) 실제 초 → 프레임(29.97fps)
    //   //    (더 정확한 NTSC 표준값은 30000/1001 ≈ 29.97002997)
    //   const fps = 29.97;
    //   const framesFloat = realSeconds * fps; // ex) 10.134 * 29.97 = 303.50798...

    //   // 3) 반올림하여 실제 "프레임"으로 만든다 (정수화)
    //   const frames = Math.round(framesFloat); // ex) 304 프레임

    //   // 4) 다시 프레임을 29.97fps 초 단위로 환산
    //   const ntscSeconds = frames / fps; // ex) 304 / 29.97 = 10.1441초

    //   // 5) 소수점 이하 4자리까지 제한
    //   const currentTime = Number(ntscSeconds.toFixed(4)); // ex) 10.1441

    //   // 6) setCurrentTime에 반영
    //   setCurrentTime(currentTime);
    // };

    const handlePlaybackStatusUpdate = (status) => {
      if (!status.isLoaded) return;

      // Convert milliseconds to seconds
      const totalSeconds = status.positionMillis / 1000;

      // Extract the integer seconds
      const secondsPart = Math.floor(totalSeconds);

      // Get the fractional part of the second
      const fraction = totalSeconds - secondsPart;

      // Calculate the frame number within the current second using 29.97 fps
      let frameCount = Math.floor(fraction * 29.97);

      // Cap the frame count at 29 (i.e. valid frames: 0 - 29)
      if (frameCount > 29) frameCount = 29;

      // Format frameCount to always have two digits (e.g., "05" for 5 frames)
      const frameStr = frameCount.toString().padStart(2, "0");

      // Combine seconds and frame number into a string like "2.13"
      const timeFrameValue = `${secondsPart}.${frameStr}`;

      // Send the computed timeFrameValue to your backend or update state accordingly
      setCurrentTime(timeFrameValue);
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
