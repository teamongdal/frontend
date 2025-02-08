import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import VideoPlayer from "../molecule/VideoPlayer";

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
        setLoading(false);
      });
  }, [videoId]);

  return (
    <View>
      {!loading && !!videoData && (
        <VideoPlayer
          videoUrl={videoData.video_url}
          videoName={videoData.video_name}
        />
      )}
    </View>
  );
};

export default VideoDetailPage;
