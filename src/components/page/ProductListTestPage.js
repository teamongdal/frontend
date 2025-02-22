import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProductModal from "../molecule/ProductModal";
import ProductCard from "../molecule/ProductCard";
import { server_url } from "../../api/function";

// import Swiper from "react-native-swiper";

const { width, height } = Dimensions.get("window"); // 화면 크기 가져오기

const ProductListTestPage = ({
  productList,
  closeProductList,
  productListVisible,
  videoName,
  isContinue,
  setIsContinue,
  setIsPlaying,
  isPlaying,
}) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    console.log("isContinue", isContinue);
    if (isContinue) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, []);
  const closeModal = () => {
    setModalVisible(false);
    setActiveIdx(null);
  };

  useEffect(() => {
    setSelectedProduct(productList[0]);
  }, []);

  const toggleFilter = async () => {
    try {
      // const response = await fetch(
      //   `${server_url}/api/update_isContinue?user_id=user_0001&is_continue=${!isContinue}`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      // if (!response.ok) {
      //   throw new Error(`서버 응답 실패: ${response.status}`);
      // }

      // const data = await response.json();
      // console.log("API 응답 데이터:", data);

      setIsContinue((prev) => !prev);
    } catch (error) {
      console.error("좋아요 실패:", error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={productListVisible}
      onRequestClose={closeProductList}
    >
      <View style={styles.container}>
        {/* 닫기 버튼 */}
        {/* <TouchableOpacity style={styles.closeButton} onPress={closeProductList}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity> */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>N 시리즈</Text>
          <Text style={styles.mainTitle}>{videoName}</Text>
          <Text style={styles.description}>
            {"7화 ・ 2025 드라마 ・ 시리즈"}
          </Text>
          <Text style={styles.description}>
            세 커플이 천국도로 향한다. 지금껏 숨겨온 주고받으며 더욱 가까워지는
            솔로들.
          </Text>
          {isContinue ? (
            <>
              <TouchableOpacity
                style={styles.watchButton}
                onPress={
                  isContinue ? setIsPlaying((prev) => !prev) : closeProductList
                }
              >
                <Text style={styles.watchButtonText}>
                  {isContinue
                    ? isPlaying
                      ? "재생 멈추기"
                      : "재생 하기"
                    : "▶ 이어서 시청"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.watchButton}
                onPress={closeProductList}
              >
                <Text style={styles.watchButtonText}>▶ 이어서 시청</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.toggleContainer}>
            <Text style={styles.grayText}>자동 재생</Text>
            <Switch
              value={isContinue}
              onValueChange={toggleFilter}
              trackColor={{ false: "#ccc", true: "#830023" }}
            />
          </View>
          {/* <TouchableOpacity
            style={styles.watchButton}
            onPress={closeProductList}
          >
            <Text style={styles.watchButtonText}>계속 재생하기</Text>
          </TouchableOpacity> */}
        </View>

        <View style={{ paddingTop: "5%" }}>
          <Text style={styles.recommendTitle}>
            유사한 제품을 추천해 드릴게요
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {productList?.map((product, idx) => (
              <ProductCard
                data={product}
                onPress={() => {
                  console.log("click!");
                  setSelectedProduct(product);
                  setModalVisible(true);
                  setActiveIdx(idx);
                }}
                isActive={idx == activeIdx}
                key={idx}
              />
            ))}
          </ScrollView>
          <ProductModal
            modalVisible={modalVisible}
            closeModal={closeModal}
            selectedProduct={selectedProduct}
          />
        </View>
      </View>
    </Modal>
  );
};
const styles = (isContinue) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 300,
      backgroundColor: isContinue ? "transparent" : "rgba(0, 0, 0, 0.8)",
      padding: 20,
      display: isContinue ? "none" : "flex", // isContinue가 true이면 숨김
    },
    closeButton: {
      position: "absolute",
      bottom: 10,
      left: 0,
      zIndex: 10,
    },
    closeButtonText: {
      fontSize: 100,
      color: "#fff",
    },
    infoContainer: {
      left: 50,
    },
    title: {
      color: "red",
      fontSize: 16,
      fontWeight: "bold",
    },
    mainTitle: {
      color: "#fff",
      fontSize: 60,
      fontWeight: "bold",
      marginTop: 5,
    },
    description: {
      color: "#ccc",
      fontSize: 14,
      marginVertical: 10,
    },
    watchButton: {
      backgroundColor: "#e50914",
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 30,
      paddingRight: 30,
      borderRadius: 32,
      alignSelf: "flex-start",
      marginBottom: 20,
      marginTop: 10,
    },
    watchButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    recommendTitle: {
      color: "#fff",
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      paddingLeft: 50,
    },
    productCard: {
      backgroundColor: "#222",
      padding: 10,
      borderRadius: 8,
      width: width * 0.4,
      marginRight: 10,
    },
    productImage: {
      width: "100%",
      height: 120,
      borderRadius: 8,
    },
    productName: {
      color: "#fff",
      fontSize: 14,
      marginTop: 5,
    },
    productPrice: {
      color: "#fff",
      fontSize: 12,
    },
    productDiscount: {
      color: "#FF82A3",
      fontSize: 12,
      fontWeight: "bold",
    },
    toggleContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  });

export default ProductListTestPage;
