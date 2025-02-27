import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import VideoPlayer from "../molecule/VideoPlayer"; // expo-av 기반 VideoPlayer
import ViewShot, { captureRef } from "react-native-view-shot";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import ProductListTestPage from "../page/ProductListTestPage";
import { server_url } from "../../api/function";
import LoadingScreen from "../../components/molecule/LoadingBar";
import Icon from "react-native-vector-icons/FontAwesome";
import RetryAlertPage from "../molecule/RetryAlertPage";

const { width, height } = Dimensions.get("window");

const VideoDetailPage = ({ route }) => {
  const videoId = route?.params?.videoId || null;
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
  const [showControls, setShowControls] = useState(true);
  const [isRetry, setIsRetry] = useState(false);
  const [retryText, setRetryText] = useState("");

  const textList = ["가운데 옷 정보 알려줘", "왼쪽 옷 정보 알려줘"];
  const [curTextIdx, setCurTextIdx] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (videoData) {
      setShowSearchButtons(true);
    }
  }, [videoData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurTextIdx((prevIndex) => (prevIndex + 1) % textList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log("isRetry", isRetry);
    if (isRetry) {
      if (isPlaying) {
        setIsPlaying(false);
      }
      setIsLoading(false);
      setProductListVisible(false);
    }
  }, [isRetry]);

  useEffect(() => {
    if (productListVisible) {
      setIsPlaying(true);
    }
  }, [productListVisible]);

  useEffect(() => {
    if (!videoId) return;
    fetch(`${server_url}/api/video_play?video_id=${videoId}`)
      .then((response) => response.json())
      .then((data) => {
        setVideoData(data);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  }, [videoId]);

  // expo-av Video에서는 pauseAsync() 사용
  const handleClickSearch = async () => {
    console.log("handleClickSearch clicked");
    if (videoRef.current && videoRef.current.pauseAsync) {
      try {
        await videoRef.current.pauseAsync();
      } catch (error) {
        console.error("Error pausing video:", error);
      }
    } else {
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

      const recordingOptions = {
        android: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: ".wav",
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
      };

      const recordingInstance = new Audio.Recording();
      await recordingInstance.prepareToRecordAsync(recordingOptions);
      await recordingInstance.startAsync();
      setRecording(recordingInstance);
      handleCapture();
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("stopRecording clicked");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    const uri = recording.getURI();
    console.log("Recording stopped, URI:", uri);
    sendAudioToServer(uri);
    setIsLoading(true);
  }

  const closeProductList = () => {
    console.log("close 클릭");
    setProductListVisible(false);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const sendAudioToServer = async (audioUri) => {
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: capturedImage,
        name: "captured_image.png",
        type: "image/png",
      });

      const fileType = audioUri.endsWith(".wav") ? "audio/wav" : "audio/m4a";
      formData.append("audio", {
        uri: audioUri.startsWith("file://") ? audioUri : `file://${audioUri}`,
        name: `recorded_audio.${fileType === "audio/wav" ? "wav" : "m4a"}`,
        type: fileType,
      });

      const searchResponse = await fetch(
        `${server_url}/api/search_product?user_id=user_0001`,
        {
          method: "POST",
          body: formData,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (!searchResponse.ok) {
        throw new Error(`서버 응답 오류: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();
      console.log("searchData", searchData);
      if (searchData?.success) {
        setProductList(searchData?.product_list);
        setProductListVisible(true);
        setIsPlaying(false);
        setIsLoading(false);
      } else {
        setRetryText(
          searchData?.user_prompt_original === "No speech detected."
            ? "인식된 문장이 없습니다."
            : searchData?.user_prompt_original
        );
        setIsRetry(true);
      }
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
        format: "jpg",
        quality: 0.9,
      });
      setCapturedImage(uri);
      console.log("캡처 성공:", uri);
    } catch (error) {
      console.error("캡처 실패:", error);
    }
  };

  const handleScreenPress = () => {
    setShowControls(true);
  };

  const handleGoHighlight = () => {
    navigation.navigate("HighLightPage", { user_id: "user_0001" });
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={handleScreenPress}
        accessible={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container} pointerEvents="box-none">
          <ViewShot
            ref={viewShotRef}
            options={{ format: "jpg", quality: 0.9 }}
            style={styles.videoContainer}
          >
            {videoData && videoData.video_url ? (
              <VideoPlayer
                ref={videoRef}
                productListVisible={productListVisible}
                setIsPlaying={setIsPlaying}
                isPlaying={isPlaying}
                videoUrl={videoData.video_url}
                videoName={videoData.video_name}
                setShowSearchButtons={setShowSearchButtons}
                setShowControls={setShowControls}
                showControls={showControls}
              />
            ) : (
              <View
                style={[
                  styles.videoContainer,
                  { justifyContent: "center", alignItems: "center" },
                ]}
              >
                <Text style={{ color: "white" }}>
                  재생할 비디오 데이터가 없습니다.
                </Text>
              </View>
            )}
          </ViewShot>
        </View>
      </TouchableWithoutFeedback>
      {showControls && (
        <TouchableOpacity
          style={[
            styles.playPauseButton,
            productListVisible ? styles.smallView : null,
          ]}
          onPress={() => {
            console.log("click!");
            setIsPlaying((prev) => !prev);
          }}
        >
          <Icon name={isPlaying ? "pause" : "play"} size={30} color="white" />
        </TouchableOpacity>
      )}
      {showSearchButtons && !productListVisible && (
        <View style={styles.searchButtonsWrap}>
          <TouchableOpacity
            style={styles.highlightButtonWrap}
            onPress={handleGoHighlight}
          >
            <Image
              source={require("../../assets/icon-highlight.png")}
              style={styles.hightLightButton}
            />
          </TouchableOpacity>
          <Animated.Text style={[styles.examTextWrap, { opacity: fadeAnim }]}>
            <Text>{textList[curTextIdx]}</Text>
          </Animated.Text>
          {recording == null ? (
            <TouchableOpacity
              style={styles.micButtonContainer}
              onPress={handleClickSearch}
            >
              <Image
                source={require("../../assets/voice.png")}
                style={styles.micButton}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.micButtonContainer}
              onPress={stopRecording}
            >
              <Image
                source={require("../../assets/unvoice.png")}
                style={styles.micButton}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
      {isLoading && <LoadingScreen capturedImage={capturedImage} />}
      {isRetry && (
        <RetryAlertPage setIsRetry={setIsRetry} retryText={retryText} />
      )}
      {productListVisible && productList && (
        <ProductListTestPage
          productList={productList}
          productListVisible={productListVisible}
          closeProductList={closeProductList}
          onRequestClose={closeProductList}
          videoName={videoData?.video_name}
          setIsPlaying={setIsPlaying}
          isPlaying={isPlaying}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "2%",
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
  searchButtonsWrap: {
    flexDirection: "row",
    alignItems: "center", // 수직(Vertical) 가운데 정렬
    justifyContent: "center", // 수평(Horizontal) 가운데 정렬
    bottom: "5%",
  },
  highlightButtonWrap: {
    // position: "absolute",
    left: "-25%",
    padding: 12,
    paddingVertical: "20",
    borderRadius: 8,
  },
  hightLightButton: {
    width: 100,
    height: 100,
    // backgroundColor: "white",
    borderRadius: 100,
    // left: "-300%",
  },
  micButtonContainer: {
    // position: "absolute",
    // bottom: "20%",
    right: "-25%",
    width: 100,
    height: 100,
  },
  micButton: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  examTextWrap: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "#a11a32",
    fontSize: 30,
    fontWeight: "bold",
    left: 0,
    marginTop: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingVertical: 15,
    paddingHorizontal: 50,
    width: 370,
    borderRadius: 100,
    borderWidth: 2,
    // borderColor: "#a11a32",
    marginBottom: 50,
    marginTop: 50,
  },
  playPauseButton: {
    position: "absolute",
    top: "35%",
    left: "50%",
    transform: [{ translateX: -30 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    zIndex: 1100,
  },
  smallView: {
    top: "25%",
    left: "35%",
  },
});

export default VideoDetailPage;
