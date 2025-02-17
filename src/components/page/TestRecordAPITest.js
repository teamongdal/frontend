import React, { useState, useRef } from "react";
import { View, Button, Text, StyleSheet, Platform } from "react-native";
import { Audio } from "expo-av";

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
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  // const startRecording = async () => {
  //   try {
  //     // 🔹 마이크 권한 요청
  //     const { granted } = await Audio.requestPermissionsAsync();
  //     if (!granted) {
  //       alert("마이크 접근 권한이 필요합니다.");
  //       return;
  //     }

  //     // 🔹 iOS에서 녹음 가능하도록 오디오 모드 설정
  //     await Audio.setAudioModeAsync({
  //       allowsRecordingIOS: true, // iOS에서 녹음 가능하도록 설정
  //       playsInSilentModeIOS: true, // 무음 모드에서도 녹음 가능
  //       staysActiveInBackground: false, // 백그라운드 유지 비활성화
  //       interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS, // 다른 오디오와 함께 사용 가능
  //       shouldDuckAndroid: true, // Android에서는 다른 오디오보다 우선 사용
  //     });

  //     // 🔹 녹음 객체 생성 및 설정
  //     const newRecording = new Audio.Recording();
  //     await newRecording.prepareToRecordAsync(
  //       Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
  //     );
  //     await newRecording.startAsync();
  //     setRecording(newRecording);
  //   } catch (error) {
  //     console.error("Error starting recording:", error);
  //   }
  // };

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    // sendAudioToServer(uri);
  }

  // const stopRecording = async () => {
  //   try {
  //     if (!recording) {
  //       console.warn("No active recording found.");
  //       return;
  //     }

  //     await recording.stopAndUnloadAsync();
  //     const uri = recording.getURI();

  //     console.log("uri", uri);

  //     if (!uri) {
  //       console.error("Failed to retrieve recording URI.");
  //       return;
  //     }

  //     setFilePath(uri);
  //     console.log("Recording saved at:", uri);
  //     sendAudioToServer(uri);

  //     // 녹음 상태 초기화
  //     setRecording(null);
  //   } catch (error) {
  //     console.error("Error stopping recording:", error);
  //   }
  // };

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
        formData.append("audio", fileBlob, "recorded_audio.webm"); // Web에서는 Blob 객체 사용 <-- .webm -> wav
      } else {
        const fileType = uri.endsWith(".wav") ? "audio/wav" : "audio/m4a"; // iOS의 경우 확장자 확인
        formData.append("audio", {
          uri: uri.startsWith("file://") ? uri : `file://${uri}`,
          name: `recorded_audio.${fileType === "audio/wav" ? "wav" : "m4a"}`, // iOS 확장자 확인
          type: fileType,
        });
        // formData.append("audio", {
        //   uri: uri.startsWith("file://") ? uri : `file://${uri}`,
        //   name: "recorded_audio.wav",
        //   type: "audio/wav",
        // });
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

  const playRecording = async () => {
    const recordUri = recording.getURI();
    try {
      if (!recordUri) {
        console.warn("No recording available to play.");
        return;
      }

      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordUri },
        { shouldPlay: true }
      );

      setSound(newSound);
      await newSound.playAsync();
      console.log("uri", recordUri);
    } catch (error) {
      console.error("Error playing recording:", error);
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

// import React, { useState, useRef } from "react";
// import { View, Button, Text, StyleSheet, Platform } from "react-native";
// import { Audio } from "expo-av";

// import * as FileSystem from "expo-file-system";
// import axios from "axios";

// const AudioRecorder = () => {
//   const [recording, setRecording] = useState(null);
//   const [filePath, setFilePath] = useState(null);

//   async function startRecording() {
//     try {
//       // iOS에서 녹음이 가능하도록 설정
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true, // iOS에서 녹음 허용
//         playsInSilentModeIOS: true, // 무음 모드에서도 녹음 허용
//       });

//       const recording = new Audio.Recording();
//       await recording.prepareToRecordAsync(
//         Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
//       );
//       await recording.startAsync();
//       setRecording(recording);
//     } catch (error) {
//       console.error("Error starting recording:", error);
//     }
//   }

//   const stopRecording = async () => {
//     try {
//       if (!recording) return;
//       await recording.stopAndUnloadAsync();
//       const uri = recording.getURI();
//       setFilePath(uri);
//       console.log("Recording saved at:", uri);
//       sendAudioToServer(uri);
//     } catch (error) {
//       console.error("Error stopping recording:", error);
//     }
//   };

//   // 녹음된 파일 재생
//   const playRecording = async () => {
//     try {
//       if (!filePath) {
//         console.warn("No recording available to play.");
//         return;
//       }

//       if (sound) {
//         await sound.unloadAsync();
//         setSound(null);
//       }

//       const { sound: newSound } = await Audio.Sound.createAsync(
//         { uri: filePath },
//         { shouldPlay: true }
//       );

//       setSound(newSound);
//       await newSound.playAsync();
//     } catch (error) {
//       console.error("Error playing recording:", error);
//     }
//   };

//   //blob 사용
//   const sendAudioToServer = async (uri) => {
//     try {
//       let fileBlob = null;

//       // Web 환경에서는 `blob:` URL을 fetch하여 Blob 데이터로 변환
//       if (Platform.OS === "web") {
//         const response = await fetch(uri);
//         fileBlob = await response.blob();
//       }

//       const formData = new FormData();

//       if (Platform.OS === "web") {
//         console.log("fileBlob", fileBlob);
//         formData.append("audio", fileBlob, "recorded_audio.webm"); // Web에서는 Blob 객체 사용
//       } else {
//         formData.append("audio", {
//           uri: uri.startsWith("file://") ? uri : `file://${uri}`,
//           name: "recorded_audio.wav",
//           type: "audio/wav",
//         });
//       }

//       const response = await axios.post(
//         "http://127.0.0.1:8000/api/search_product?user_id=1",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       console.log("Response from server:", response.data);
//     } catch (error) {
//       console.error(
//         "Error sending audio:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Button
//         title="녹음 시작"
//         onPress={startRecording}
//         disabled={!!recording}
//       />
//       <Button title="녹음 종료" onPress={stopRecording} disabled={!recording} />
//       <Button title="녹음 듣기" onPress={playRecording} disabled={!filePath} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
// });

// export default AudioRecorder;
