import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  Switch,
} from "react-native";
import ProductInfo from "../molecule/ProductInfo";
import { server_url } from "../../api/function";

const { width } = Dimensions.get("window");

const HighlightScreen = () => {
  const [highlightData, setHighlightData] = useState([]);
  const [isFilterEnabled, setIsFilterEnabled] = useState(false);

  const renderItem = ({ item }) => {
    return (
      <View style={currentStyles.itemContainer}>
        {/* 영상 장면 (왼쪽) */}
        <View style={currentStyles.videoContainer}>
          <Image
            source={{ uri: item.highlight_image_url }}
            style={currentStyles.videoImage}
          />
        </View>

        {/* 상품 정보 (오른쪽) */}
        <View style={currentStyles.productContainer}>
          <ProductInfo item={item} isFilterEnabled={isFilterEnabled} />
        </View>
      </View>
    );
  };

  useEffect(() => {
    fetch(
      `${server_url}/api/all_product_list?video_id=video_0001&user_id=user_0001`
    )
      .then((response) => response.json())
      .then((data) => {
        setHighlightData(data.all_product_list);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  }, []);

  const toggleFilter = () => {
    setIsFilterEnabled((prev) => !prev);
  };

  const currentStyles = isFilterEnabled ? styles1 : styles2;

  return (
    <View style={currentStyles.screen}>
      <View style={currentStyles.titleWrap}>
        <Text style={currentStyles.header}>하이라이트</Text>
        <Switch
          value={isFilterEnabled}
          onValueChange={toggleFilter}
          trackColor={{ false: "#ccc", true: "#830023" }}
          thumbColor={isFilterEnabled ? "#fff" : "#f4f3f4"}
          style={currentStyles.smallSwitch}
        />
      </View>
      <FlatList
        data={highlightData}
        renderItem={renderItem}
        isFilterEnabled={isFilterEnabled}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles1 = StyleSheet.create({
  screen: {
    paddingTop: "5%",
    flex: 1,
    backgroundColor: "#F6CECC",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#1C3462",
    left: 20,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    padding: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginBottom: 50,
  },
  videoContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  videoImage: {
    width: "100%",
    height: width * 0.25,
    borderRadius: 10,
    borderWidth: 17,
    borderColor: "#1C3462",
  },
  productContainer: {
    flex: 1.5,
    paddingLeft: 35,
  },
  smallSwitch: {
    marginRight: 20,
  },
});

const styles2 = StyleSheet.create({
  screen: {
    paddingTop: "7%",
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    paddingBottom: 10,
  },
  videoContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  videoImage: {
    width: "100%",
    height: width * 0.23,
    borderRadius: 10,
  },
  productContainer: {
    flex: 1.5,
    paddingLeft: 15,
    height: "80%",
  },
  smallSwitch: {
    marginRight: 20,
  },
});
export default HighlightScreen;
