import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import ProductInfo from "../molecule/ProductInfo";

const API_URL = "http://127.0.0.1:8000"; // 백엔드 서버 주소

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const [productCodeList, setProductCodeList] = useState([]); // 전체 product_code 담음
  const [deleteItemList, setDeleteItemList] = useState([]); //
  const productImage =
    "https://ai-shop-bucket.s3.ap-southeast-2.amazonaws.com/recommendations/images/product_images/blazer_0009_00.jpg";

  useEffect(() => {
    setProductCodeList(cartItems.map((item) => item.product_code));
  }, [cartItems]);

  useEffect(() => {
    if (
      deleteItemList.length > 0 &&
      deleteItemList.length === productCodeList.length &&
      deleteItemList.every((item) => productCodeList.includes(item))
    ) {
      console.log("deleteItemList: ", deleteItemList);
      setSelectAll(true);
    }
  }, [deleteItemList]);

  useEffect(() => {
    setDeleteItemList(() => (selectAll ? [...productCodeList] : []));
  }, [selectAll]);

  useEffect(() => {
    fetch(`${API_URL}/api/product_like_list?user_id=user_0001`)
      .then((response) => response.json())
      .then((data) => {
        console.log("API 응답 데이터:", data);
        setCartItems(data.product_like_list || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
        setIsLoading(true);
      });
  }, []);

  const toggleSelectAll = () => {
    if (deleteItemList.length != productCodeList.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };

  const toggleItemSelection = (productCode) => {
    if (selectAll) {
    }
    setDeleteItemList(
      (prevList) =>
        prevList.includes(productCode)
          ? prevList.filter((itemId) => itemId !== productCode) // 이미 있으면 제거
          : [...prevList, productCode] // 없으면 추가
    );
  };

  const deleteSelectedItems = async () => {
    if (deleteItemList.length === 0) {
      alert("삭제할 상품을 선택하세요.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/product_unlike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "user_0001", // ✅ FastAPI에서 Body로 받음
          product_code: deleteItemList, // ✅ 배열 형태로 전송
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("삭제 성공:", result);

        // ✅ 삭제된 항목을 UI에서 업데이트
        setCartItems((prevItems) =>
          prevItems.filter(
            (item) => !deleteItemList.includes(item.product_code)
          )
        );
        setSelectAll(false);
        setDeleteItemList([]);
      } else {
        console.error("삭제 실패:", result);
        alert("서버에서 삭제할 상품을 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("선택 삭제 요청 실패:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <CheckBox
        value={deleteItemList.includes(item.product_code)}
        onValueChange={() => toggleItemSelection(item.product_code)}
      />
      <Image source={{ uri: productImage }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.brand}>{item.brand_name}</Text>
        <Text>{item.product_name}</Text>
        <Text style={styles.price}>{item.final_price}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CheckBox
          value={selectAll && deleteItemList.length == productCodeList.length}
          onValueChange={toggleSelectAll}
        />
        <Text>전체 선택</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={deleteSelectedItems}
        >
          <Text style={styles.deleteText}>선택 삭제</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  deleteButton: {
    marginLeft: "auto",
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  deleteText: { color: "white" },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemImage: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  itemDetails: { flex: 1 },
  brand: { fontWeight: "bold" },
  price: { color: "blue" },
});

export default CartPage;
