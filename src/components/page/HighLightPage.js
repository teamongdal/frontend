import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import ProductInfo from "../molecule/ProductInfo";
import { server_url } from "../../api/function";

const { width } = Dimensions.get("window");

const renderItem = ({ item }) => {
  return (
    <View style={styles.itemContainer}>
      {/* 영상 장면 (왼쪽) */}
      <View style={styles.videoContainer}>
        <Image
          source={{ uri: item.highlight_image_url?.replace(/^C:\//, "/") }}
          style={styles.videoImage}
        />
      </View>

      {/* 상품 정보 (오른쪽) */}
      <View style={styles.productContainer}>
        <ProductInfo item={item} />
      </View>
    </View>
  );
};

const HighlightScreen = () => {
  const [highlightData, setHighlightData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("highlightData: ", highlightData);
  }, [highlightData]);

  useEffect(() => {
    fetch(
      `${server_url}/api/all_product_list?video_id=video_0001&user_id=user_0001`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("data: ", data);
        setHighlightData(data.all_product_list);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
        setIsLoading(true);
      });
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>하이라이트</Text>
      <FlatList
        data={highlightData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingTop: "7%",
    flex: 1,
    backgroundColor: "#F6CECC",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#1C3462",
    left: 20,
    marginBottom: 40,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#1A1A1A", // 다크 배경색
    borderRadius: 15,
    padding: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    paddingBottom: 40,
  },
  videoContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  videoImage: {
    width: "100%",
    height: width * 0.23, // 가로 너비의 25% 비율
    borderRadius: 10,
    borderWidth: 5,
    borderColor: "#1C3462",
  },
  productContainer: {
    flex: 1.5,
    paddingLeft: 35,
  },
});

export default HighlightScreen;
