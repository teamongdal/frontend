import { React, useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import VideoItem from "../molecule/VideoItem";

const VideoListPage = () => {
  const navigation = useNavigation();
  const [videoList, setVideoListData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/video_list")
      .then((response) => response.json())
      .then((data) => {
        console.log("API 응답 데이터:", data);
        setVideoListData(data || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
        setIsLoading(true);
      });
  }, []);

  const handleClickVideoItem = (videoId) => {
    navigation.navigate("VideoDetail", { videoId });
  };

  return (
    <View>
      {isLoading ? (
        <Text>로딩 중...</Text>
      ) : videoList.length > 0 ? (
        videoList.map((data, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => handleClickVideoItem(data.video_id)}
          >
            <VideoItem videoId={data.video_id} />
          </TouchableOpacity>
        ))
      ) : (
        <Text>비디오가 없습니다.</Text>
      )}
    </View>
  );
};

export default VideoListPage;
