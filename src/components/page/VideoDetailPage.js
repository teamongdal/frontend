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
import ProductListTestPage from "../page/ProductListTestPage";

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
  const [productListVisible, setProductListVisible] = useState(false);
  const [productList, setProductList] = useState([]);
  const [showSearchButtons, setShowSearchButtons] = useState(false);

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
      setIsPlaying(false);
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
      handleCapture();
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();

    sendAudioToServer(uri);
    setShowSearchButtons(false);
  }

  const closeProductList = () => {
    console.log("close 클릭");
    setProductListVisible(false);
    setIsPlaying(true);
  };
  const sendAudioToServer = async (audioUri) => {
    try {
      const formData = new FormData();

      // 이미지 파일 추가
      formData.append("image", {
        uri: capturedImage,
        name: "captured_image.png",
        type: "image/png",
      });

      const fileType = audioUri.endsWith(".wav") ? "audio/wav" : "audio/m4a"; // iOS의 경우 확장자 확인
      formData.append("audio", {
        uri: audioUri.startsWith("file://") ? audioUri : `file://${audioUri}`,
        name: `recorded_audio.${fileType === "audio/wav" ? "wav" : "m4a"}`, // iOS 확장자 확인
        type: fileType,
      });

      // 첫 번째 API 호출 (음성 데이터 전송)
      const searchResponse = await fetch(
        "http://127.0.0.1:8000/api/search_product?user_id=user_0001",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!searchResponse.ok) {
        throw new Error(`서버 응답 오류: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();
      console.log("searchData", searchData);

      const productId = "musinsa_cardigan_0002"; //route?.params?.videoId || null;

      // 두 번째 API 호출 (상품 리스트 요청)
      const productResponse = await fetch(
        `http://127.0.0.1:8000/api/product_list?user_id=user_0001&product_code=${productId}`
      );

      if (!productResponse.ok) {
        throw new Error(`상품 목록 응답 오류: ${productResponse.status}`);
      }

      const productData = await productResponse.json();
      console.log("data.product_list", productData.product_list);
      setProductList(productData.product_list);
      setProductListVisible(true);
      setIsPlaying(false);
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
            setShowSearchButtons={setShowSearchButtons}
          />
        )}
      </ViewShot>
      {showSearchButtons && (
        <View style={{ flexDirection: "row" }}>
          {recording == null ? (
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleClickSearch}
            >
              <Image
                source={require("../../assets/voice.png")}
                style={styles.micButton}
              />
              <Text style={styles.buttonText}>
                클릭 후 찾고 싶은 옷 정보를 알려주세요
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.captureButton}
              onPress={stopRecording}
            >
              <Image
                source={require("../../assets/unvoice.png")}
                style={styles.micButton}
              />
              <Text style={styles.buttonStopText}>녹음을 종료합니다.</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {productListVisible && productList && (
        <ProductListTestPage
          productList={productList}
          productListVisible={productListVisible}
          closeProductList={closeProductList}
          onRequestClose={closeProductList}
          videoName={videoData?.video_name}
        ></ProductListTestPage>
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
    bottom: -170,
    left: -100,
    padding: 12,
    borderRadius: 8,
  },
  micButton: {
    padding: 10,
    width: 200,
    height: 200,
    backgroundColor: "white",
    borderRadius: 100,
  },
  buttonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    left: -130,
    marginTop: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
  },
  buttonStopText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    left: -30,
    marginTop: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
  },
  capturedImage: {
    width: 200,
    height: 120,
    marginTop: 20,
    borderRadius: 10,
  },
  // capturedImage: {
  //   position: "absolute",
  //   width: width * 0.5,
  //   height: width * 0.3,
  //   marginTop: 10,
  //   borderRadius: 10,
  // },
});

export default VideoDetailPage;
