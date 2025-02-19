import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 48) / 2; // 양쪽 패딩 포함한 2열 그리드 크기

const WishlistPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isFilterEnabled, setIsFilterEnabled] = useState(false);
  const [deleteItemList, setDeleteItemList] = useState([]); //
  const [selectAll, setSelectAll] = useState(false);
  const [productCodeList, setProductCodeList] = useState([]); // 전체 product_code 담음

  const API_URL = "http://127.0.0.1:8000"; // 백엔드 서버 주소

  useEffect(() => {
    setProductCodeList(cartItems.map((item) => item.product_code));
  }, [cartItems]);

  useEffect(() => {
    if (
      deleteItemList.length > 0 &&
      deleteItemList.length === productCodeList.length &&
      deleteItemList.every((item) => productCodeList.includes(item))
    ) {
      setSelectAll(true);
    }
    console.log("deleteItemList: ", deleteItemList);
  }, [deleteItemList]);
  useEffect(() => {
    fetch(`${API_URL}/api/cart_list?user_id=user_0001`)
      .then((response) => response.json())
      .then((data) => {
        // console.log("API 응답 데이터:", data);

        setCartItems(data.cart_list || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
        setIsLoading(true);
      });
  }, []);

  useEffect(() => {
    setDeleteItemList(() => (selectAll ? [...productCodeList] : []));
  }, [selectAll]);

  const toggleFilter = () => {
    setIsFilterEnabled((prev) => !prev);
  };

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

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>위시 리스트</Text>
      </View>

      {/* 전체 선택 & 필터 */}
      <View style={styles.filterContainer}>
        <CheckBox
          value={selectAll && deleteItemList.length == cartItems.length}
          onValueChange={toggleSelectAll}
        />
        {/* <TouchableOpacity> */}
        <Text style={styles.selectAll}>전체</Text>
        {/* </TouchableOpacity> */}
        <View style={styles.toggleContainer}>
          <Text>선택 상품만 보기</Text>
          <Switch
            value={isFilterEnabled}
            onValueChange={toggleFilter}
            trackColor={{ false: "#ccc", true: "#FF4D4D" }}
          />
        </View>

        <TouchableOpacity
          // style={styles.deleteButton}
          onPress={deleteSelectedItems}
        >
          <Text style={styles.deleteButton}>선택 삭제</Text>
        </TouchableOpacity>
      </View>

      {/* 위시리스트 그리드 */}
      <FlatList
        data={cartItems.filter((item) =>
          isFilterEnabled ? cartItems.includes(item.id) : true
        )}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          // <TouchableOpacity
          //   style={[
          //     styles.itemContainer,
          //     cartItems.includes(item.id) && styles.selectedItem,
          //   ]}
          //   onPress={() => toggleItemSelection(item.product_code)}
          // >
          <View
            style={[
              styles.itemContainer,
              cartItems.includes(item.id) && styles.selectedItem,
            ]}
          >
            <CheckBox
              value={deleteItemList.includes(item.product_code)}
              onValueChange={() => toggleItemSelection(item.product_code)}
            />
            <Text>{"선택 체크박스"}</Text>
            {/* <View style={styles.checkbox}>
              {cartItems.includes(item.id) && <Text>✅</Text>}
            </View> */}
            {/* 제품 이미지 */}
            <Image source={{ uri: item.product_image }} style={styles.image} />
            {/* 브랜드명 */}
            <Text style={styles.brand}>{item.brand_name}</Text>
            {/* 제품명 */}
            <Text style={styles.productName}>{item.product_name}</Text>
            {/* 가격 & 할인율 */}
            <View style={styles.priceContainer}>
              {/* <Text style={styles.discount}>{item.discount_rate}</Text> */}
              <Text style={styles.price}>{item.final_price}</Text>
            </View>
            {/* 평점 & 좋아요 */}
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>
                ⭐{" "}
                {item.review_rating ?? item.review_rating == "없음"
                  ? 0
                  : item.review_rating}
                ({item.review_cnt ?? 0})
              </Text>
              <Text style={styles.heart}>❤️ {item.heart_cnt ?? 0}</Text>
            </View>
          </View>
          // </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: { fontSize: 20, color: "black" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  selectAll: { fontSize: 14, fontWeight: "bold" },
  toggleContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  deleteButton: { color: "gray", fontSize: 14 },
  listContainer: { paddingHorizontal: 12, paddingBottom: 20 },
  itemContainer: {
    width: ITEM_WIDTH,
    margin: 6,
    padding: 10,
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    position: "relative",
  },
  selectedItem: { borderWidth: 2, borderColor: "#FF4D4D" },
  checkbox: { position: "absolute", top: 10, left: 10 },
  image: { width: "100%", height: 180, borderRadius: 8 },
  brand: { fontSize: 12, color: "gray", marginTop: 5 },
  productName: { fontSize: 14, fontWeight: "bold", marginVertical: 4 },
  priceContainer: { flexDirection: "row", alignItems: "center", gap: 5 },
  discount: { color: "red", fontWeight: "bold" },
  price: { fontWeight: "bold", fontSize: 16 },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  rating: { fontSize: 12, color: "#666" },
  heart: { fontSize: 12, color: "#FF4D4D" },
});

export default WishlistPage;
