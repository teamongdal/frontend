import { React, useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import VideoItem from "../molecule/VideoItem";

const VideoListPage = () => {
  const navigation = useNavigation();
  const [videoLisData, setVideoListData] = useState([]); // ✅ 배열로 초기화
  const [isLoading, setIsLoading] = useState(true); // ✅ 초기값 `true`

  useEffect(() => {
    console.log("videoLisData: ", videoLisData);
  }, [videoLisData]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/video_list")
      .then((response) => response.json())
      .then((data) => {
        console.log("API 응답 데이터:", data); // ✅ 응답 데이터 구조 확인
        setVideoListData(data || []); // ✅ 데이터가 undefined일 경우 빈 배열 설정
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
        setIsLoading(true);
      });
  }, []);

  const handleClickVideoItem = (videoId) => {
    navigation.navigate("VideoItem", { videoId });
  };

  return (
    <View>
      {isLoading ? (
        <Text>로딩 중...</Text>
      ) : videoLisData.length > 0 ? (
        videoLisData.map((data, idx) => (
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
