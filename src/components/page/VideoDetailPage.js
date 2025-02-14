//VideoDetailPage.js 복사본

import React, { useEffect, useState, useRef } from "react";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import io from "socket.io-client";
const SERVER_URL = "http://127.0.0.1:8000"; // 백엔드 서버 주소
const audioRecorderPlayer = new AudioRecorderPlayer();

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import VideoPlayer from "../molecule/VideoPlayer";
import ViewShot, { captureRef } from "react-native-view-shot";
import RNFS from "react-native-fs";
// import Share from "react-native-share";

const VideoDetailPage = ({ route }) => {
  const { videoId } = route.params;
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transcription, setTranscription] = useState(""); // 백엔드에서 받은 텍스트
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const viewShotRef = useRef(null);
  const randomCount = Math.floor(Math.random() * 100000) + 1;
  const socket = useRef(null);

  useEffect(() => {
    if (!videoId) return;

    fetch(`http://127.0.0.1:8000/api/video_play?video_id=video_0001`)
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

  useEffect(() => {
    // ✅ WebSocket 연결
    socket.current = io(SERVER_URL, { transports: ["websocket"] });

    socket.current.on("connect", () => {
      console.log("✅ WebSocket Connected!");
    });

    startRecording();

    // ✅ 3️⃣ "새미야" 감지 후 success 응답을 받음
    socket.current.on("wake_word_detected", () => {
      console.log("✅ '새미야' 감지됨! 비디오 캡처 시작");
      handleCapture();
    });

    socket.current.on("result_data", (data) => {
      console.log("📦 서버 응답:", data);
      setTranscription(data.text);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        console.log("❌ WebSocket Disconnected");
      }
    };
  }, []);

  // 🎤 2️⃣ 실시간 음성 데이터 전송
  const startRecording = async () => {
    await audioRecorderPlayer.startRecorder(undefined, {
      AVFormatIDKeyIOS: "kAudioFormatLinearPCM",
    });

    audioRecorderPlayer.addRecordBackListener((e) => {
      if (socket.current) {
        socket.current.emit("audio_stream", e.recordingBuffer);
      }
    });
  };

  // // ⏹️ 3️⃣ 녹음 종료
  // const stopRecording = async () => {
  //   await audioRecorderPlayer.stopRecorder();
  //   audioRecorderPlayer.removeRecordBackListener();
  // };

  const handleCapture = async () => {
    try {
      if (videoRef.current) {
        videoRef.current.pause();
      }

      const uri = await captureRef(viewShotRef, {
        format: "png",
        quality: 0.8,
      });

      setCapturedImage(uri);
      console.log("캡처 성공:", uri);

      if (Platform.OS !== "web") {
        const filePath = `${RNFS.DocumentDirectoryPath}/screenshot_${randomCount}.png`;

        await RNFS.copyFile(uri, filePath);
        console.log("파일 저장됨:", filePath);
      }
    } catch (error) {
      console.error("캡처 실패:", error);
    }
  };

  // 📌 공유 기능 (Android & iOS)
  const handleShare = async () => {
    if (!capturedImage) return;

    console.log("share~");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{videoData?.video_name}</Text>

      {/* <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }}>
        {!loading && videoData && (
          <VideoPlayer
            ref={videoRef}
            videoUrl={videoData.video_url}
            videoName={videoData.video_name}
          />
        )}
      </ViewShot> */}

      <ViewShot
        ref={viewShotRef}
        options={{ format: "jpg", quality: 0.9 }}
        style={{ width: "100%", height: 400 }} // 캡처할 영역의 크기 지정
      >
        {!loading && videoData && (
          <VideoPlayer
            ref={videoRef}
            videoUrl={videoData.video_url}
            videoName={videoData.video_name}
          />
        )}
      </ViewShot>
      <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
        <Text style={styles.buttonText}>📸 캡처하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.captureButton} onPress={startRecording}>
        <Text style={styles.buttonText}>🎤 음성 인식 시작</Text>
      </TouchableOpacity>
      <Text style={styles.text}>📜 인식된 문장: {transcription}</Text>

      {capturedImage && (
        <>
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
          {Platform.OS !== "web" && (
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.buttonText}>📤 공유하기</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  captureButton: {
    marginTop: 20,
    backgroundColor: "#FF5733",
    padding: 10,
    borderRadius: 8,
  },
  shareButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  capturedImage: {
    width: 200,
    height: 120,
    marginTop: 20,
    borderRadius: 10,
  },
});

export default VideoDetailPage;

// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import VideoPlayer from "../molecule/VideoPlayer";

// const { width, height } = Dimensions.get("window");

// const VideoDetailPage = ({ route }) => {
//   const { videoId } = route.params;
//   const [videoData, setVideoData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!videoId) {
//       return;
//     }

//     fetch(`http://127.0.0.1:8000/api/video_play?video_id=${videoId}`)
//       .then((response) => response.json())
//       .then((data) => {
//         setVideoData(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("API 요청 실패:", error);
//         setLoading(false);
//       });
//   }, [videoId]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{videoData?.video_name}</Text>
//       {!loading && videoData && (
//         <VideoPlayer
//           videoUrl={videoData.video_url}
//           videoName={videoData.video_name}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F5F5",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
// });

// export default VideoDetailPage;
