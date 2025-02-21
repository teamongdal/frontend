import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import ProductInfo from "../molecule/ProductInfo";
import { server_url } from "../../api/function";

const renderItem = ({ item }) => {
  return (
    <View style={styles.container}>
      {/* 영상 장면 */}
      <View style={styles.videoContainer}>
        <Image
          source={{ uri: item.highlight_image_url.replace(/^C:\//, "/") }}
          style={styles.videoImage}
        />
      </View>

      {/* 상품 정보 */}
      <ProductInfo item={item} />
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
    fetch(`${server_url}/api/all_product_list?video_id=video_0001`)
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
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 15,
    padding: 10,
  },
  videoContainer: {
    flex: 1,
    marginRight: 10,
  },
  videoImage: {
    width: "100%",
    height: 334,
    borderRadius: 10,
  },
  itemImage: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  itemDetails: { flex: 1 },
});

export default HighlightScreen;
