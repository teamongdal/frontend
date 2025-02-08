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
import Icon from "react-native-vector-icons/FontAwesome"; // 아이콘 추가

const { width, height } = Dimensions.get("window"); // 화면 크기 가져오기

const VideoItem = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true); // 기본값: 자동 재생

  // 페이지 로드 시 자동 재생
  useEffect(() => {
    setIsPlaying(true);
  }, []);

  return (
    <ViewShot>
      <View style={styles.container}>
        <Video
          ref={videoRef}
          source={{
            uri: "https://ai-shop-bucket.s3.ap-southeast-2.amazonaws.com/vod/나는_SOLO_E151_10m.mp4",
          }}
          style={styles.video}
          resizeMode="cover"
          paused={!isPlaying} // 자동 재생
        />

        {/* 재생/멈춤 버튼 */}
        <TouchableOpacity
          style={styles.playPauseButton}
          onPress={() => setIsPlaying((prev) => !prev)}
        >
          <Icon name={isPlaying ? "pause" : "play"} size={30} color="white" />
        </TouchableOpacity>

        <Text style={styles.text}>{isPlaying ? "재생 중" : "멈춤 상태"}</Text>
      </View>
    </ViewShot>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  video: {
    width: width, // 전체 화면 너비
    height: height, // 전체 화면 높이
    position: "absolute", // 화면을 꽉 채우기 위해 절대 위치 지정
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

export default VideoItem;
