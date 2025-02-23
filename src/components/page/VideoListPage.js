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
import { server_url } from "../../api/function";
const { width, height } = Dimensions.get("window"); // 화면 크기 가져오기

const sideIcons = ["star", "film", "gift", "gamepad", , "home", "smile-o"];

const VideoListPage = () => {
  const navigation = useNavigation();
  const [videoList, setVideoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // fetch(`http://127.0.0.1:8000/api/video_list?user_id=user_0001`)
    fetch(`${server_url}/api/video_list?user_id=user_0001`)
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

  const handleClickIcon = (index) => {
    if (index === 1) {
      navigation.navigate("HighLightPage", { user_id: "user_0001" });
    } else if (index === 0) {
      navigation.navigate("WishlistPage", { user_id: "user_0001" });
    }
  };
  return (
    <View style={styles.container}>
      {/* 사이드바 아이콘 */}
      <View style={styles.sidebar}>
        {sideIcons.map((icon, index) => (
          <TouchableOpacity key={index} onPress={() => handleClickIcon(index)}>
            <Icon
              name={icon}
              size={width * 0.025}
              color="gray"
              style={styles.icon}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* 메인 컨텐츠 */}
      <View style={styles.mainContent}>
        {/* 배너 이미지 추가 */}
        <Image
          source={require("../../assets/banner.png")}
          style={styles.bannerImage}
        />
        <View style={styles.textWrap}>
          <Text style={styles.headerTitle}>Google Play 무비</Text>
          <Text style={styles.headerSubtitle}>
            TV에서 보면 더 커지는 즐거움!
          </Text>
          <Text style={styles.headerSubtitle}>
            Google이 제공하는 다양한 게임과 앱을 지금 만나보세요
          </Text>
        </View>
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
    width: width * 0.03,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  icon: {
    marginVertical: 20,
  },
  mainContent: {
    flex: 1,
    paddingLeft: 20,
  },
  textWrap: {
    position: "absolute",
    top: "15%",
    left: "5%",
  },
  bannerImage: {
    width: "100%",
    height: height * 0.4, // 화면 높이에 맞춘 배너 크기
    resizeMode: "cover",
    marginBottom: 20,
    borderRadius: 10,
  },
  headerTitle: {
    color: "white",
    fontSize: width * 0.04,
    fontWeight: "bold",
    marginBottom: 8,
  },
  headerSubtitle: {
    color: "gray",
    fontSize: width * 0.018,
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
    width: width * 0.21,
    height: width * 0.35,
    marginRight: width * 0.03,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#222",
  },
  image: {
    width: "100%",
    height: "85%",
    resizeMode: "cover",
  },
  textContainer: {
    paddingHorizontal: 8,
    alignItems: "center",
    paddingTop: "20",
  },
  text: {
    color: "white",
    fontSize: width * 0.018,
    fontWeight: "600",
    textAlign: "center",
  },
});
export default VideoListPage;
