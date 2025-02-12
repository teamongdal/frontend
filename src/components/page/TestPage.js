import React, { useState, useRef, useEffect } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import { Platform } from "react-native";

const audioRecorderPlayer = new AudioRecorderPlayer();

const App = () => {
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const filePath = useRef(null);

  useEffect(() => {
    console.log("recording: ", recording);
  }, [recording]);

  // Start Recording
  const startRecording = async () => {
    setRecording(true);
    const path =
      Platform.OS === "android" ? `${Date.now()}.wav` : "recorded_audio.wav";
    filePath.current = await audioRecorderPlayer.startRecorder(path, {
      AVFormatIDKeyIOS: "kAudioFormatLinearPCM",
    });
  };

  // Stop Recording
  const stopRecording = async () => {
    setRecording(false);
    const result = await audioRecorderPlayer.stopRecorder();
    filePath.current = result;
    console.log("Recording saved at:", filePath.current);
  };

  // Play Recorded Audio
  const playRecording = async () => {
    console.log("play click");
    if (filePath.current) {
      setIsPlaying(true);
      await audioRecorderPlayer.startPlayer(filePath.current);
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.currentPosition === e.duration) {
          setIsPlaying(false);
          audioRecorderPlayer.stopPlayer();
        }
      });
    } else {
      console.warn("No recorded file available.");
    }
  };

  // Stop Playing
  const stopPlaying = async () => {
    setIsPlaying(false);
    console.log("stop click");

    await audioRecorderPlayer.stopPlayer();
  };

  return (
    <View style={styles.container}>
      <Button
        title={recording ? "녹음 중..." : "🎤 녹음 시작"}
        onPress={startRecording}
        disabled={recording}
      />
      <Button
        title="⏹️ 녹음 종료"
        onPress={stopRecording}
        disabled={!recording}
      />
      <Button
        title={isPlaying ? "🔊 재생 중..." : "▶️ 녹음 듣기"}
        onPress={playRecording}
        disabled={!filePath.current || isPlaying}
      />
      <Button
        title="⏹️ 재생 중지"
        onPress={stopPlaying}
        disabled={!isPlaying}
      />
      <Text style={styles.text}>🎧 변환된 텍스트: {transcription}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default App;
