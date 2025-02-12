import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProductItem from "../molecule/ProductItem";

const HighlightPage = () => {
  const navigation = useNavigation();
  const [highlightList, setHighlightList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/highlight_product_list?video_id=1")
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        setHighlightList(data || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
        setIsLoading(false); // 오류 발생 시 false로 변경
      });
  }, []);

  const handleClickProductItem = (productId) => {
    navigation.navigate("ProductDetail", { productId });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{
          uri: "https://image.tving.com/ntgs/contents/CTC/caip/CAIP0900/ko/20240329/0100/P001754312.jpg/dims/resize/480",
        }}
        style={styles.image}
      />
      <TouchableOpacity
        onPress={() => handleClickProductItem(item.product_id)}
        style={styles.infoContainer}
      >
        <ProductItem
          productId={item.product_id}
          productName={item.product_name}
          productPrice={item.price}
          productImage={
            "https://image.msscdn.net/thumbnails/images/goods_img/20230817/3469871/3469871_17321622059740_big.png?w=1200"
          }
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>주요 장면</Text>
      <FlatList
        data={highlightList}
        renderItem={renderItem}
        keyExtractor={(item) => item.product_id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#20302A" },
  itemContainer: { flexDirection: "row", marginRight: 10 },
  image: { width: 100, height: 100, borderRadius: 10 },
  infoContainer: { padding: 10 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
});

export default HighlightPage;
