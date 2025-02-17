import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import VideoPlayer from "../molecule/VideoPlayer";
import ViewShot, { captureRef } from "react-native-view-shot";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const VideoDetailPage = ({ route }) => {
  const videoId = route?.params?.videoId || null;
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);
  const viewShotRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (!videoId) return;

    fetch(`http://127.0.0.1:8000/api/video_play?video_id=${videoId}`)
      .then((response) => response.json())
      .then((data) => {
        setVideoData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
        setLoading(false);
      });
  }, [videoId]);

  const handleCapture = async () => {
    try {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(() => (isPlaying ? !isPlaying : isPlaying));
      }

      const uri = await captureRef(viewShotRef, {
        format: "png",
        quality: 0.8,
      });

      setCapturedImage(uri);
      console.log("캡처 성공:", uri);
    } catch (error) {
      console.error("캡처 실패:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ViewShot
        ref={viewShotRef}
        options={{ format: "jpg", quality: 0.9 }}
        style={styles.videoContainer}
      >
        {!loading && videoData && (
          <VideoPlayer
            ref={videoRef}
            setIsPlaying={setIsPlaying}
            isPlaying={isPlaying}
            videoUrl={videoData.video_url}
            videoName={videoData.video_name}
          />
        )}
      </ViewShot>

      <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
        <Text style={styles.buttonText}>유사상품 찾기</Text>
      </TouchableOpacity>

      {capturedImage && (
        <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  videoContainer: {
    width: width,
    height: (width * 9) / 16,
    backgroundColor: "black",
  },
  captureButton: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "#FF5733",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  capturedImage: {
    position: "absolute",
    width: width * 0.5,
    height: width * 0.3,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default VideoDetailPage;
