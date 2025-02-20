import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window"); // 화면 크기 가져오기

const sideIcons = ["gift", "gamepad", "star", "home", "film", "smile-o"];

const VideoListPage = () => {
  const navigation = useNavigation();
  const [videoList, setVideoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/video_list?user_id=user_0001`)
      .then((response) => response.json())
      .then((data) => {
        console.log("API 응답 데이터:", data);
        setVideoList(data || []);
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
    <View style={styles.container}>
      {/* 사이드바 아이콘 */}
      <View style={styles.sidebar}>
        {sideIcons.map((icon, index) => (
          <Icon
            key={index}
            name={icon}
            size={width * 0.035}
            color="gray"
            style={styles.icon}
          />
        ))}
      </View>

      {/* 메인 컨텐츠 */}
      <View style={styles.mainContent}>
        <Text style={styles.headerTitle}>Google Play 무비</Text>
        <Text style={styles.headerSubtitle}>TV에서 보면 더 커지는 즐거움!</Text>
        <Text style={styles.headerSubtitle}>
          Google이 제공하는 다양한 게임과 앱을 지금 만나보세요
        </Text>
        <Text style={styles.title}>컨텐츠</Text>

        {/* 컨텐츠 리스트 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
          {videoList.map((data, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleClickVideoItem(data.video_id)}
            >
              <View style={styles.card}>
                <Image
                  source={{ uri: data.video_image.replace(/^C:\//, "/") }}
                  style={styles.image}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.text}>{data.video_name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "black",
    padding: 16,
  },
  sidebar: {
    width: width * 0.08, // 반응형 크기 조정
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40, // 상단에서 너무 가까운 경우 조정
  },
  icon: {
    marginBottom: 20, // 아이콘 간격 조정
  },
  mainContent: {
    flex: 1,
    paddingLeft: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: width * 0.04, // 반응형 폰트 크기
    fontWeight: "bold",
    marginBottom: 8,
  },
  headerSubtitle: {
    color: "gray",
    fontSize: width * 0.018, // 반응형 폰트 크기
    marginBottom: 4,
  },
  title: {
    color: "white",
    fontSize: width * 0.03,
    fontWeight: "bold",
    marginVertical: 16,
  },
  scrollView: {
    flexDirection: "row",
  },
  card: {
    width: width * 0.22, // 반응형 크기
    height: width * 0.38, // 비율 조정
    marginRight: width * 0.03,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#222",
  },
  image: {
    width: "100%",
    height: "85%", // 이미지 비율 맞추기
    resizeMode: "cover",
  },
  textContainer: {
    padding: 8,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: width * 0.018, // 가변적인 폰트 크기
    fontWeight: "600",
    textAlign: "center",
  },
});

export default VideoListPage;
