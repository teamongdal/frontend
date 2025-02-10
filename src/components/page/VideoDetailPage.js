import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import VideoPlayer from "../molecule/VideoPlayer";

const { width, height } = Dimensions.get("window");

const VideoDetailPage = ({ route }) => {
  const { videoId } = route.params;
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videoId) {
      return;
    }

    fetch(`http://127.0.0.1:8000/api/video_fetch?video_id=${videoId}`)
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{videoData?.video_name}</Text>
      {!loading && videoData && (
        <VideoPlayer
          videoUrl={videoData.video_url}
          videoName={videoData.video_name}
        />
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
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default VideoDetailPage;
