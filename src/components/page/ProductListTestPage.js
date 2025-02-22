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
} from "react-native";
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
  setIsPlaying,
  isPlaying,
}) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const closeModal = () => {
    setModalVisible(false);
    setActiveIdx(null);
  };

  useEffect(() => {
    setSelectedProduct(productList[0]);
  }, []);

  const toggleFilter = () => {
    setIsContinue((prev) => !prev);
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={productListVisible}
      onRequestClose={closeProductList}
    >
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          {/* <Text style={styles.title}>N 시리즈</Text>
          <Text style={styles.mainTitle}>{videoName}</Text>
          <Text style={styles.description}>
            {"7화 ・ 2025 드라마 ・ 시리즈"}
          </Text>
          <Text style={styles.description}>
            지금껏 숨겨온 주고받으며 더욱 가까워지는 모습들
          </Text> */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "35%",
    padding: 20,
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
  // playPauseButton: {
  //   position: "absolute",
  //   top: "-100%",
  //   left: "30%",
  //   transform: [{ translateX: -30 }],
  //   backgroundColor: "rgba(0, 0, 0, 0.5)",
  //   padding: 15,
  //   borderRadius: 50,
  //   alignItems: "center",
  // },
  watchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e50914",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 32,
    alignSelf: "flex-start",
    // marginBottom: 20,
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
  backIcon: {
    padding: 3,
    width: 30,
    height: 30,
    marginRight: 10,
  },
});

export default ProductListTestPage;
