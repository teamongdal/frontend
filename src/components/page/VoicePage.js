import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import io from "socket.io-client";
import RNFS from "react-native-fs";

const SERVER_URL = "http://127.0.0.1:8000/"; // 백엔드 서버 주소
const audioRecorderPlayer = new AudioRecorderPlayer();
const socket = useRef(null); // ✅ WebSocket useRef 사용

const VoicePage = () => {
  const [transcription, setTranscription] = useState(""); // 변환된 텍스트
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    requestPermissions(); // ✅ 앱 실행 시 마이크 권한 요청
  }, []);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/video_play?video_id=1`)
      .then((response) => response.json())
      .then(() => setLoading(false))
      .catch((error) => {
        console.error("API 요청 실패:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // ✅ WebSocket 연결
    socket.current = io(SERVER_URL, { transports: ["websocket"] });

    socket.current.on("connect", () => {
      console.log("✅ WebSocket Connected!");
    });

    startRecording(); // 녹음 시작

    socket.current.on("disconnect", () => {
      console.log("❌ WebSocket Disconnected!");
    });

    socket.current.on("error", (error) => {
      console.error("❌ WebSocket Error:", error);
    });

    socket.current.on("wake_word_detected", () => {
      console.log("✅ '새미야' 감지됨! 비디오 캡처 시작");
      try {
        handleCapture();
      } catch (error) {
        console.error("❌ handleCapture 실행 중 오류 발생:", error);
      }
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

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "마이크 권한 요청",
            message: "이 앱은 음성 녹음을 위해 마이크를 사용합니다.",
            buttonNeutral: "나중에",
            buttonNegative: "취소",
            buttonPositive: "확인",
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("❌ 마이크 권한 거부됨");
          return false;
        }
      } catch (error) {
        console.error("❌ 권한 요청 실패:", error);
        return false;
      }
    }
    return true;
  };

  const startRecording = async () => {
    try {
      console.log("🎤 Start Recording...");

      // ✅ 저장 경로: 앱 내부 저장소 사용
      const filePath =
        Platform.OS === "ios"
          ? `${RNFS.DocumentDirectoryPath}/recording.m4a` // iOS: AAC
          : `${RNFS.DocumentDirectoryPath}/recording.aac`; // Android: AAC

      console.log("📁 저장 경로:", filePath);

      const result = await audioRecorderPlayer.startRecorder(filePath, {
        AVFormatIDKeyIOS: "kAudioFormatMPEG4AAC", // ✅ iOS는 AAC 사용
        AudioEncoderAndroid: "aac", // ✅ Android도 AAC 사용
      });

      console.log("🎤 Recorder started:", result);

      audioRecorderPlayer.addRecordBackListener((e) => {
        console.log("🎤 Recording Buffer:", e.recordingBuffer);
        if (socket.current) {
          socket.current.emit("audio_stream", e.recordingBuffer);
        }
      });

      setIsRecording(true);
    } catch (error) {
      console.error("❌ Recording Error:", error);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    try {
      await audioRecorderPlayer.stopRecorder();
      console.log("⏹ 녹음 중지됨");
    } catch (error) {
      console.error("❌ 녹음 중지 오류:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.recordButton}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {isRecording ? "⏹ 녹음 중지" : "🎤 녹음 시작"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.text}>📜 인식된 문장: {transcription}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  recordButton: { backgroundColor: "red", padding: 10, borderRadius: 5 },
  buttonText: { color: "white", fontSize: 18 },
  text: { marginTop: 20, fontSize: 16 },
});

export default VoicePage;
