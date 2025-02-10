import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

const sideIcons = [
  "gift",
  "gamepad",
  "star",
  "home",
  "film",
  "theater-masks",
  "smile-o",
];

export default function VideoContentPage() {
  const navigation = useNavigation();
  const [videoList, setVideoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const thumbnail =
    "https://image.tving.com/ntgs/contents/CTC/caip/CAIP0900/ko/20240329/0100/P001754312.jpg/dims/resize/480";

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/video_list")
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
      <View style={styles.sidebar}>
        {sideIcons.map((icon, index) => (
          <Icon name={icon} size={30} color="gray" />
        ))}
      </View>
      <View style={styles.mainContent}>
        <Text style={styles.headerTitle}>Google Play 무비</Text>
        <Text style={styles.headerSubtitle}>TV에서 보면 더 커지는 즐거움!</Text>
        <Text style={styles.headerSubtitle}>
          Google이 제공하는 다양한 게임과 앱을 지금 만나보세요
        </Text>
        <Text style={styles.title}>컨텐츠</Text>
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
                <Image source={{ uri: thumbnail }} style={styles.image} />
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "black",
    padding: 16,
  },
  sidebar: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  mainContent: {
    flex: 1,
    paddingLeft: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  headerSubtitle: {
    color: "gray",
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
  },
  scrollView: {
    flexDirection: "row",
  },
  card: {
    width: 120,
    marginRight: 12,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#222",
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  textContainer: {
    padding: 8,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
