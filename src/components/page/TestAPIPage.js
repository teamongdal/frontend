import React, { useState, useRef } from "react";
import { View, Button, Text, StyleSheet, Platform, Image } from "react-native";
import { Audio } from "expo-av";
import { server_url } from "../../api/function";

import * as FileSystem from "expo-file-system";
import axios from "axios";

const TestAPIPage = () => {
  const [recording, setRecording] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [transcription, setTranscription] = useState("");

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

      // Web 환경에서는 `blob:` URL을 fetch하여 Blob 데이터로 변환
      if (Platform.OS === "web") {
        const response = await fetch(uri);
        fileBlob = await response.blob();
      }

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

      if (Platform.OS === "web") {
        console.log("fileBlob", fileBlob);
        formData.append("audio", fileBlob, "recorded_audio.webm"); // Web에서는 Blob 객체 사용 <-- .webm -> wav
      } else {
        const fileType = uri.endsWith(".wav") ? "audio/wav" : "audio/m4a"; // iOS의 경우 확장자 확인
        formData.append("audio", {
          uri: uri.startsWith("file://") ? uri : `file://${uri}`,
          name: `recorded_audio.${fileType === "audio/wav" ? "wav" : "m4a"}`, // iOS 확장자 확인
          type: fileType,
        });
      }

      const response = await axios.post(
        `${server_url}/api/search_product?user_id=user_0001`,
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
      {/* <Button
        title="녹음 듣기"
        onPress={playRecording}
      /> */}
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

export default TestAPIPage;
