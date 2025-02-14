//VideoDetailPage.js 복사본

import React, { useEffect, useState, useRef } from "react";

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
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const viewShotRef = useRef(null);
  const randomCount = Math.floor(Math.random() * 100000) + 1;

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

      <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }}>
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
