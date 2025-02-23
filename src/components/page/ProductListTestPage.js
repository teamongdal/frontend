import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import ProductModal from "../molecule/ProductModal";
import ProductCard from "../molecule/ProductCard";

const { width, height } = Dimensions.get("window");

const ProductListTestPage = ({
  productList,
  closeProductList,
  productListVisible,
  videoName,
  setIsPlaying,
  isPlaying,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    setSelectedProduct(productList[0]);
  }, []);

  const closeModal = () => {
    setModalVisible(false);
    setActiveIdx(null);
  };

  // const toggleFilter = async () => {
  //   try {
  //     // const response = await fetch(
  //     //   ${server_url}/api/update_isContinue?user_id=user_0001&is_continue=${!isContinue},
  //     //   {
  //     //     method: "POST",
  //     //     headers: {
  //     //       "Content-Type": "application/json",
  //     //     },
  //     //   }
  //     // );

  //     // if (!response.ok) {
  //     //   throw new Error(서버 응답 실패: ${response.status});
  //     // }

  //     // const data = await response.json();
  //     // console.log("API 응답 데이터:", data);

  //     setIsContinue((prev) => !prev);
  //   } catch (error) {
  //     console.error("좋아요 실패:", error);
  //   }
  // };

  return (
    <View style={[styles.overlay, !productListVisible && { display: "none" }]}>
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <TouchableOpacity
            style={styles.watchButton}
            onPress={closeProductList}
          >
            <Image
              source={require("../../assets/back-arrow.png")}
              style={styles.backIcon}
            />
            <Text style={styles.watchButtonText}>상품 목록 나가기</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingTop: "2%" }}>
          <Text style={styles.recommendTitle}>
            유사한 제품을 추천해 드릴게요
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {productList?.map((product, idx) => (
              <ProductCard
                data={product}
                onPress={() => {
                  setSelectedProduct(product);
                  setModalVisible(true);
                  setActiveIdx(idx);
                }}
                isActive={idx == activeIdx}
                key={idx}
              />
            ))}
          </ScrollView>

          {/* 상품 상세 모달 */}
          {modalVisible && (
            <ProductModal
              modalVisible={modalVisible}
              closeModal={closeModal}
              selectedProduct={selectedProduct}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    // backgroundColor: "rgba(0, 0, 0, 0.7)", // 반투명 배경 유지
    zIndex: 1000,
    pointerEvents: "box-none",
  },
  container: {
    flex: 1,
    paddingTop: "29%",
    padding: 20,
    pointerEvents: "auto",
  },
  infoContainer: {
    left: 50,
  },
  watchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e50914",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 32,
    alignSelf: "flex-start",
    marginTop: "8%",
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
  backIcon: {
    padding: 3,
    width: 30,
    height: 30,
    marginRight: 10,
  },
});

export default ProductListTestPage;
