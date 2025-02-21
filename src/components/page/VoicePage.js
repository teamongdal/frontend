import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from "react-native";
import AudioRecord from "react-native-audio-record";
import io from "socket.io-client";
import { server_url } from "../../api/function";

import RNFS from "react-native-fs";

const VoicePage = () => {
  const [transcription, setTranscription] = useState(""); // 변환된 텍스트
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const socket = useRef(null); // WebSocket

  // useEffect(() => {
  //   requestPermissions(); // ✅ 앱 실행 시 마이크 권한 요청
  // }, []);

  useEffect(() => {
    fetch(`${server_url}/api/video_play?video_id=video_0001`)
      .then((response) => response.json())
      .then(() => setLoading(false))
      .catch((error) => {
        console.error("API 요청 실패:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const initWebSocketAndStartRecording = async () => {
      // ✅ 마이크 권한 요청
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        console.log("🚫 마이크 권한 없음. 녹음 불가.");
        return;
      }

      // ✅ WebSocket 연결
      socket.current = io(SERVER_URL, { transports: ["websocket"] });

      socket.current.on("connect", () => {
        console.log("✅ WebSocket Connected!");
        startRecording(); // 🎤 WebSocket 연결 후 녹음 시작
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
    };

    initWebSocketAndStartRecording();
  }, []);

  const startRecording = async () => {
    try {
      console.log("🎤 Start Recording...");

      // ✅ WAV 포맷으로 설정 (PCM 16-bit, 44.1kHz, Mono)
      AudioRecord.init({
        sampleRate: 44100,
        channels: 1,
        bitsPerSample: 16, // PCM 16-bit
        wavFile: "recording.wav", // iOS/Android 모두 WAV 저장
      });

      AudioRecord.start();
      setIsRecording(true);

      // 🎤 WebSocket으로 실시간 전송
      AudioRecord.on("data", (data) => {
        console.log("🎤 Recording Buffer Size:", data.length);

        if (data.length > 0 && socket.current) {
          socket.current.emit("audio_stream", data);
        }
      });
    } catch (error) {
      console.error("❌ Recording Error:", error);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    try {
      const audioFile = await AudioRecord.stop();
      console.log("📁 녹음 파일 저장 위치:", audioFile);
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
