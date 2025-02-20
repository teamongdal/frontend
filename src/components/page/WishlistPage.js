import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Dimensions,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import Icon from "react-native-vector-icons/FontAwesome";

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = (width - 48) / 2;

const WishlistPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isFilterEnabled, setIsFilterEnabled] = useState(false);
  const [deleteItemList, setDeleteItemList] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productCodeList, setProductCodeList] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const flatListRef = useRef(null); // FlatList 참조

  const API_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    setProductCodeList(cartItems.map((item) => item.product_code));
  }, [cartItems]);

  const rules = [3.1, 2.1, 1, 1.2, 3, 1.4, 2, 1.1, 1.9, 1.6];

  useEffect(() => {
    if (
      deleteItemList.length > 0 &&
      deleteItemList.length === productCodeList.length &&
      deleteItemList.every((item) => productCodeList.includes(item))
    ) {
      setSelectAll(true);
    }
  }, [deleteItemList]);
  useEffect(() => {
    fetch(`${API_URL}/api/cart_list?user_id=user_0001`)
      .then((response) => response.json())
      .then((data) => {
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
    setDeleteItemList((prevList) =>
      prevList.includes(productCode)
        ? prevList.filter((itemId) => itemId !== productCode)
        : [...prevList, productCode]
    );
  };
  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  };
  const deleteSelectedItems = async () => {
    if (deleteItemList.length === 0) {
      alert("삭제할 상품을 선택하세요.");
      return;
    }

    try {
      fetch(`${API_URL}/api/cart_unlike?user_id=user_0001`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deleteItemList),
      })
        .then((response) => response.json())
        .then((data) => {
          setCartItems(data.cart_list);
        })
        .catch((error) => console.error("API 요청 실패:", error));
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
        <View>
          <CheckBox
            value={selectAll && deleteItemList.length == cartItems.length}
            onValueChange={toggleSelectAll}
          />
          <Text>{"전체"}</Text>
        </View>

        <View style={styles.toggleContainer}>
          <Text>선택 상품만 보기</Text>
          <Switch
            value={isFilterEnabled}
            onValueChange={toggleFilter}
            trackColor={{ false: "#ccc", true: "#FF4D4D" }}
          />
        </View>

        <TouchableOpacity onPress={deleteSelectedItems}>
          <Text style={styles.deleteButton}>선택 삭제</Text>
        </TouchableOpacity>
      </View>

      {/*위시리스트 그리드*/}
      <FlatList
        ref={flatListRef}
        data={cartItems.filter((item) =>
          isFilterEnabled ? deleteItemList.includes(item.product_code) : true
        )}
        numColumns={2}
        keyExtractor={(item) => "wish" + item.product_code}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
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
            {/* 제품 이미지 */}
            <Image source={{ uri: item.product_image }} style={styles.image} />
            {/* 브랜드명 */}
            <Text style={styles.brand}>{item.brand_name}</Text>
            {/* 제품명 */}
            <Text style={styles.productName}>{item.product_name}</Text>
            {/* 가격 & 할인율 */}
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{item.final_price}</Text>
            </View>
            {/* 평점 & 좋아요 */}
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>
                ⭐
                {item.review_rating ?? item.review_rating == "없음"
                  ? Math.floor(
                      rules[item.product_code[item.product_code.length - 1]] + 1
                    ) + 0.5
                  : item.review_rating}
                (
                {item.review_cnt ?? item.review_rating == "없음"
                  ? 1
                  : item.review_rating}
                )
              </Text>
              <Text style={styles.heart}>
                ❤️
                {item.heart_cnt ??
                  rules[item.product_code[item.product_code.length - 1]] + "k"}
              </Text>
            </View>
          </View>
        )}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          setShowScrollTop(offsetY > height * 0.3); // 일정 높이 이상 내려가면 버튼 표시
        }}
      />
      {showScrollTop && (
        <TouchableOpacity style={styles.floatingButton} onPress={scrollToTop}>
          <Icon name="arrow-up" size={24} color="#fff" />
        </TouchableOpacity>
      )}
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
  // selectAll: { fontSize: 14, fontWeight: "bold" },
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
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#FF4D4D",
    padding: 15,
    borderRadius: 50,
    elevation: 5, // Android 그림자
    shadowColor: "#000", // iOS 그림자
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default WishlistPage;
