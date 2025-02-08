import { React, useState, useEffect } from "react";
import ProductItem from "../molecule/ProductItem";
import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const HighlightPage = () => {
  // const navigation = useNavigation();
  const [highlightListData, setProductListData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/highlight_product_list?video_id=1")
      .then((response) => response.json())
      .then((data) => {
        setProductListData(data || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
        setIsLoading(true);
      });
  }, []);

  const handleClickProductItem = (productId) => {
    // navigation.navigate("ProductItem", { productId });
    fetch(`http://127.0.0.1:8000/api/product_item?product_id=${productId}`)
      .then((response) => response.json())
      .then((data) => {
        setProductListData(data || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
        setIsLoading(true);
      });
  };

  return (
    <>
      <View>
        {isLoading ? (
          <Text>로딩 중...</Text>
        ) : highlightListData.length > 0 ? (
          highlightListData.map((data, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleClickHighlight(1, data.product_id)}
            >
              <ProductItem productId={data.product_id}></ProductItem>
            </TouchableOpacity>
          ))
        ) : (
          <Text>상품이 없습니다.</Text>
        )}
      </View>
    </>
  );
};

export default HighlightPage;
