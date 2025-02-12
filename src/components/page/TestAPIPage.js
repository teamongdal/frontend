import React, { useState, useRef } from "react";
import { View, Button, Text, StyleSheet, Platform } from "react-native";
import { Audio } from "expo-av";

import * as FileSystem from "expo-file-system";
import axios from "axios";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [transcription, setTranscription] = useState("");

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        alert("마이크 접근 권한이 필요합니다.");
        return;
      }

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setFilePath(uri);
      console.log("Recording saved at:", uri);
      sendAudioToServer(uri);
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  //blob 사용
  const sendAudioToServer = async (uri) => {
    try {
      let fileBlob = null;

      // Web 환경에서는 `blob:` URL을 fetch하여 Blob 데이터로 변환
      if (Platform.OS === "web") {
        const response = await fetch(uri);
        fileBlob = await response.blob();
      }

      const formData = new FormData();

      if (Platform.OS === "web") {
        console.log("fileBlob", fileBlob);
        formData.append("audio", fileBlob, "recorded_audio.webm"); // Web에서는 Blob 객체 사용
      } else {
        formData.append("audio", {
          uri: uri.startsWith("file://") ? uri : `file://${uri}`,
          name: "recorded_audio.wav",
          type: "audio/wav",
        });
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/search_product?user_id=1",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Response from server:", response.data);
      setTranscription(
        response.data.speech_text || "No transcription available"
      );
    } catch (error) {
      console.error(
        "Error sending audio:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="녹음 시작"
        onPress={startRecording}
        disabled={!!recording}
      />
      <Button title="녹음 종료" onPress={stopRecording} disabled={!recording} />
      <Text>Transcription: {transcription}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default AudioRecorder;
