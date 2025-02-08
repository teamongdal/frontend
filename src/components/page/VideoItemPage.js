import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import VideoPlayer from "../molecule/VideoPlayer";

const VideoItemPage = ({ route }) => {
  const { videoId } = route.params; // ✅ useParams() 대신 route.params 사용
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("현재 Video ID:", videoId); // ✅ 디버깅 로그 추가

    if (!videoId) {
      console.error("잘못된 Video ID:", videoId);
      return;
    }

    fetch(`http://127.0.0.1:8000/api/video_fetch?video_id=${videoId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("API 응답 데이터:", data); // ✅ API 응답 확인
        setVideoData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
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

export default VideoItemPage;
