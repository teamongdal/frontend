import { React, useState, useEffect } from "react";
import ProductItem from "../molecule/ProductItem";
import { View, TouchableOpacity, Text } from "react-native";
// import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const ProductListPage = () => {
  // const navigation = useNavigation();
  const [productListData, setProductListData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/similar_product_list")
      .then((response) => response.json())
      .then((data) => {
        console.log("API 응답 데이터:", data);
        setProductListData(data || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
        setIsLoading(true);
      });
  }, []);

  const handleClickProductItemLike = (userId, productId) => {
    fetch("http://127.0.0.1:8000/api/product_like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, product_id: productId }),
    })
      .then((response) => response.json())
      .then((data) => console.log("API 응답 데이터:", data))
      .catch((error) => console.error("API 요청 실패:", error));
  };

  return (
    <>
      <View>
        {isLoading ? (
          <Text>로딩 중...</Text>
        ) : productListData.length > 0 ? (
          productListData.map((data, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleClickProductItemLike(1, data.product_id)}
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

export default ProductListPage;
