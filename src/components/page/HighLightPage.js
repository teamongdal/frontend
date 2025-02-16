import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import highlightImage from "../../assets/video/highlight_0001_0001.png";
const { width } = Dimensions.get("window"); // 화면 크기 가져오기
const SERVER_URL = "http://127.0.0.1:8000"; // 백엔드 서버 주소

const HighlightScene = () => {
  const [highlightData, setHighlightData] = useState([]);
  const [loading, setLoading] = useState(true);
  const productImage =
    "https://ai-shop-bucket.s3.ap-southeast-2.amazonaws.com/recommendations/images/product_images/blazer_0009_00.jpg";

  useEffect(() => {
    fetch(`${SERVER_URL}/api/all_product_list?video_id=video_0001`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data: ", data);
        setHighlightData(data.all_product_list);
        setLoading(false);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
        setIsLoading(true);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={highlightData}
        keyExtractor={(item) => item.highlight_idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.highlightContainer}>
            {/* 왼쪽: 주요 장면 */}
            <Image
              source={highlightImage}
              style={[
                styles.sceneImage,
                { width: width * 0.35, height: width * 0.2 },
              ]} // 반응형 크기
            />

            {/* 오른쪽: 상품 정보 */}
            <View style={styles.productContainer}>
              <Image
                source={{ uri: productImage }}
                style={[
                  styles.productImage,
                  { width: width * 0.15, height: width * 0.15 },
                ]}
              />
              <View style={styles.textContainer}>
                <Text style={styles.brand}>{item.brand_name}</Text>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.product_name}
                </Text>
                <Text style={styles.price}>{item.final_price}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2E4A41",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2E4A41",
  },
  highlightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sceneImage: {
    borderRadius: 10,
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    flex: 1,
  },
  productImage: {
    borderRadius: 10,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  brand: {
    fontSize: width * 0.018, // 가변적인 폰트 크기
    fontWeight: "bold",
    color: "#D4A017",
  },
  productName: {
    fontSize: width * 0.016,
    color: "#EDEDED",
    marginVertical: 4,
  },
  price: {
    fontSize: width * 0.02,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
export default HighlightScene;
