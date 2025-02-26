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
// ★ 수정: "@react-native-community/checkbox" 대신 expo-checkbox를 import
import Checkbox from "expo-checkbox";
import Icon from "react-native-vector-icons/FontAwesome";
import { server_url } from "../../api/function";

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

  useEffect(() => {
    setProductCodeList(cartItems.map((item) => item.product_code));
  }, [cartItems]);

  const rules = [3.1, 3.1, 3, 3.2, 3, 3.4, 3, 3.1, 3.9, 3.6];

  // 아래 CustomCheckbox는 사용하지 않고 있으나, 필요시 대안으로 사용 가능합니다.
  const CustomCheckbox = ({ isChecked, onToggle }) => {
    return (
      <TouchableOpacity
        style={[styles.checkbox, isChecked && styles.checked]}
        onPress={onToggle}
      >
        {isChecked && <Icon name="check" size={14} color="#FFF" />}
      </TouchableOpacity>
    );
  };

  // 전체 선택 여부 동기화
  useEffect(() => {
    if (
      deleteItemList.length > 0 &&
      deleteItemList.length === productCodeList.length &&
      deleteItemList.every((item) => productCodeList.includes(item))
    ) {
      setSelectAll(true);
    }
  }, [deleteItemList]);

  // 데이터 불러오기
  useEffect(() => {
    fetch(`${server_url}/api/cart_list?user_id=user_0001`)
      .then((response) => response.json())
      .then((data) => {
        setCartItems(data.cart_list || []);
        setIsLoading(false);
        console.log("data.cart_list: ", data.cart_list);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
        setIsLoading(true);
      });
  }, []);

  // selectAll 변경 시 deleteItemList 동기화
  useEffect(() => {
    setDeleteItemList(() => (selectAll ? [...productCodeList] : []));
  }, [selectAll]);

  const toggleFilter = () => {
    setIsFilterEnabled((prev) => !prev);
  };

  const toggleSelectAll = () => {
    if (deleteItemList.length !== productCodeList.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };

  const toggleItemSelection = (productCode) => {
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
      fetch(`${server_url}/api/cart_unlike?user_id=user_0001`, {
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
      {/* 전체 선택 & 필터 */}
      <View style={styles.filterContainer}>
        <View style={styles.checkboxContainer}>
          {/* ★ 수정: <CheckBox> → <Checkbox> */}
          <Checkbox
            style={[styles.checkboxWrap, styles.bigCheckbox]}
            value={selectAll && deleteItemList.length === cartItems.length}
            onValueChange={toggleSelectAll}
          />
          <Text style={{ left: 26, fontWeight: "bold", paddingTop: 2 }}>
            전체
          </Text>
        </View>

        <View style={styles.toggleContainer}>
          <Text style={styles.grayText}>선택 상품만 보기</Text>
          <Switch
            value={isFilterEnabled}
            onValueChange={toggleFilter}
            trackColor={{ false: "#ccc", true: "#830023" }}
            thumbColor={isFilterEnabled ? "#fff" : "#f4f3f4"}
            style={styles.smallSwitch}
          />
          <View
            style={{
              borderWidth: 1,
              borderColor: "#E8E8E8",
              height: "14",
              gap: 8,
            }}
          />
          <TouchableOpacity onPress={deleteSelectedItems}>
            <Text style={styles.grayText}>선택 삭제</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 위시리스트 그리드 */}
      <FlatList
        ref={flatListRef}
        data={cartItems.filter((item) =>
          isFilterEnabled ? deleteItemList.includes(item.product_code) : true
        )}
        numColumns={2}
        keyExtractor={(item) => "wish" + item.product_code}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            {/* 이미지 + 체크박스 */}
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item.product_image }} style={styles.image} />
              {/* ★ 수정: <CheckBox> → <Checkbox> */}
              <Checkbox
                value={deleteItemList.includes(item.product_code)}
                onValueChange={() => toggleItemSelection(item.product_code)}
                style={styles.checkboxWrap}
              />
            </View>
            <Text style={styles.brand}>{item.brand_name}</Text>
            <Text style={styles.productName}>{item.product_name}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.discount}>
                {item.discount_rate === 0 ? "" : item.discount_rate}
              </Text>
              <Text style={styles.price}>{item.final_price}</Text>
            </View>
            {/* 평점 & 좋아요 */}
            <View style={styles.ratingContainer}>
              <View style={styles.ratingWrapper}>
                <Image
                  source={require("../../assets/icon-star.png")}
                  style={styles.icon}
                />
                <Text style={styles.rating}>
                  {item.review_rating && item.review_rating === "없음"
                    ? Math.floor(
                        rules[item.product_code[item.product_code.length - 1]] +
                          1
                      ) + 0.5
                    : item.review_rating}
                  (
                  {item.review_cnt &&
                    (item.review_cnt === "없음" ? 1 : item.review_cnt)}
                  ) <Text style={{ gap: 4 }}> ・ </Text>
                </Text>
                <View style={styles.heartWrapper}>
                  <Image
                    source={require("../../assets/icon-heart.png")}
                    style={styles.icon}
                  />
                  <Text style={styles.heart}>
                    {item.heart_cnt ??
                      rules[item.product_code[item.product_code.length - 1]] +
                        "K"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          setShowScrollTop(offsetY > height * 0.3);
        }}
      />

      {showScrollTop && (
        <TouchableOpacity style={styles.floatingButton} onPress={scrollToTop}>
          <Icon
            name="angle-up"
            size={24}
            color="#fff"
            style={{ left: 10, top: 4 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  checkboxContainer: {
    textAlign: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  grayText: {
    color: "#898D99",
    fontSize: 13,
  },
  smallSwitch: {
    transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }],
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    margin: 6,
    borderRadius: 10,
    position: "relative",
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 209,
    borderRadius: 8,
  },
  checkboxWrap: {
    position: "absolute",
    top: -200, // 체크박스 위치 (필요하다면 조정)
    left: 10,
    width: 16,
    height: 16,
  },
  bigCheckbox: {
    width: 20,
    height: 20,
    top: 0,
    left: 0,
  },
  brand: {
    fontSize: 12,
    color: "#898D99",
    marginTop: 12,
  },
  productName: {
    fontSize: 13,
    marginVertical: 4,
    minHeight: 31,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },
  discount: {
    fontWeight: "bold",
    color: "#FF2B2F",
    fontSize: 12,
  },
  price: {
    fontWeight: "bold",
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  ratingWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  heartWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 12,
    height: 12,
    marginRight: 4,
  },
  rating: {
    fontSize: 12,
    color: "#1C1F33",
  },
  heart: {
    fontSize: 12,
    color: "#1C1F33",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#1C1F33",
    width: 36,
    height: 36,
    borderRadius: 50,
  },
});

export default WishlistPage;
