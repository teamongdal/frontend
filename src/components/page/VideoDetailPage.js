import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Button,
} from "react-native";
import VideoPlayer from "../molecule/VideoPlayer";
import ViewShot, { captureRef } from "react-native-view-shot";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
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
  const [recording, setRecording] = useState(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

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

  const handleClickSearch = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(() => (isPlaying ? !isPlaying : isPlaying));
    }

    startRecording();
  };

  async function startRecording() {
    try {
      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        isMeteringEnabled: false,
        android: {
          extension: ".wav",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_NB,
          sampleRate: 44100,
          numberOfChannels: 1, // 모노 설정
          bitRate: 128000,
        },
        ios: {
          extension: ".wav",
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1, // 모노 설정
          bitRate: 128000,
        },
      });

      await recording.startAsync();
      setRecording(recording);
      console.log("Recording started");

      handleCapture();
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    sendAudioToServer(uri);
  }

  const sendAudioToServer = async (uri) => {
    try {
      let fileBlob = null;
      const formData = new FormData();

      const imageFile = Image.resolveAssetSource(
        require("../../assets/video/highlight_0001_0001.png")
      ).uri;

      // 이미지 파일 추가
      formData.append("image", {
        uri: imageFile,
        name: "captured_image.png",
        type: "image/png",
      });

      const fileType = uri.endsWith(".wav") ? "audio/wav" : "audio/m4a"; // iOS의 경우 확장자 확인
      formData.append("audio", {
        uri: uri.startsWith("file://") ? uri : `file://${uri}`,
        name: `recorded_audio.${fileType === "audio/wav" ? "wav" : "m4a"}`, // iOS 확장자 확인
        type: fileType,
      });

      const response = await axios.post(
        "http://127.0.0.1:8000/api/search_product?user_id=user_0001",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Response from server:", response.data);
    } catch (error) {
      console.error(
        "Error sending audio:",
        error.response?.data || error.message
      );
    }
  };

  const handleCapture = async () => {
    try {
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
      {!loading && !isPlaying && (
        <View>
          <View style={{ flexDirection: "row" }}>
            {/* <Button
          title="녹음 시작"
          onPress={startRecording}
          disabled={!!recording}
        /> */}
            <Button
              title="녹음 종료"
              onPress={stopRecording}
              disabled={!recording}
            />
          </View>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleClickSearch}
          >
            <Text style={styles.buttonText}>
              클릭 후 찾고 싶은 옷 정보를 알려주세요
            </Text>
          </TouchableOpacity>
          {/* {capturedImage && (
            <Image
              source={{ uri: capturedImage }}
              style={styles.capturedImage}
            />
          )} */}
        </View>
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
