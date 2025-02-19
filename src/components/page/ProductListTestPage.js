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
import { useNavigation } from "@react-navigation/native";
import { ProductModal } from "../molecule/modal/ProductModal";
// import Swiper from "react-native-swiper";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window"); // 화면 크기 가져오기

const ProductListTestPage = () => {
  const carouselRef = useRef(null);

  const productId = "cardigan_0002"; //route?.params?.videoId || null;
  const navigation = useNavigation();
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    console.log("selectedProduct", selectedProduct);
  }, [selectedProduct]);

  useEffect(() => {
    if (!productId) return;

    fetch(
      `http://127.0.0.1:8000/api/product_list?user_id=user_0001&product_code=${productId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setProductList(data.product_list);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
        setIsLoading(false);
      });
  }, [productId]);

  const handleClickProductItem = (data) => {
    setSelectedProduct(data);
    setModalVisible(true);
  };
  return (
    <View style={styles.container}>
      {/* 메인 컨텐츠 */}
      <View style={styles.mainContent}>
        <Text style={styles.headerTitle}>Google Play 무비</Text>
        <Text style={styles.headerSubtitle}>TV에서 보면 더 커지는 즐거움!</Text>
        <Text style={styles.headerSubtitle}>
          Google이 제공하는 다양한 게임과 앱을 지금 만나보세요
        </Text>

        {/* 컨텐츠 리스트 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
          {productList.map((data, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleClickProductItem(data)}
            >
              <View style={styles.card}>
                <Image
                  source={{ uri: data.product_images[0] }}
                  style={styles.image}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.text}>{data.product_name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* 모달 */}
      {selectedProduct && (
        // <Modal
        //   animationType="slide"
        //   transparent={true}
        //   visible={modalVisible}
        //   onRequestClose={closeModal}
        // >
        //   <View style={styles.modalOverlay}>
        //     <View style={styles.modalContent}>
        //       {/* 닫기 버튼 */}
        //       <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
        //         <Text style={styles.closeButtonText}>✕</Text>
        //       </TouchableOpacity>

        //       {/* 브랜드 로고 & 이름 */}
        //       <Image
        //         source={{ uri: selectedProduct.brand_image }}
        //         style={styles.brandImage}
        //       />
        //       <Text style={styles.brandName}>{selectedProduct.brand_name}</Text>

        //       <Swiper
        //         style={styles.swiper}
        //         loop={true} // 무한 반복 가능하게 설정
        //         showsPagination={true} // 아래 점 표시 활성화
        //         paginationStyle={styles.pagination}
        //         autoplay={false} // 자동 슬라이드 끄기 (필요 시 true로 변경)
        //         horizontal={true} // 가로 스와이프 활성화 (기본값이지만 명시)
        //       >
        //         {selectedProduct.product_images.map((image, index) => (
        //           <View key={index} style={styles.slide}>
        //             <Image
        //               source={{ uri: image }}
        //               style={styles.productImage}
        //             />
        //           </View>
        //         ))}
        //       </Swiper>

        //       {/* 상품 정보 */}
        //       <ScrollView style={styles.scrollContainer}>
        //         <Text style={styles.productName}>
        //           {selectedProduct.product_name}
        //         </Text>
        //         <Text style={styles.discountRate}>
        //           {selectedProduct.discount_rate} 할인
        //         </Text>
        //         <Text style={styles.finalPrice}>
        //           {selectedProduct.final_price}
        //         </Text>
        //         <Text style={styles.finalPrice}>
        //           ♥ {selectedProduct.heart_cnt} | {selectedProduct.category}
        //         </Text>
        //       </ScrollView>

        //       {/* 구매 버튼 */}
        //       <TouchableOpacity style={styles.confirmButton}>
        //         <Text style={styles.confirmButtonText}>구매하기</Text>
        //       </TouchableOpacity>
        //     </View>
        //   </View>
        // </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* 닫기 버튼 */}
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>

              {/* 브랜드 로고 & 이름 */}
              <Image
                source={{ uri: selectedProduct.brand_image }}
                style={styles.brandImage}
              />
              <Text style={styles.brandName}>{selectedProduct.brand_name}</Text>

              {/* 이미지 캐러셀 적용 (react-native-reanimated-carousel) */}
              <Carousel
                ref={carouselRef}
                data={selectedProduct.product_images}
                width={width * 0.8}
                height={200}
                loop
                autoPlay={false}
                pagingEnabled
                scrollAnimationDuration={500}
                renderItem={({ item }) => (
                  <View style={styles.slide}>
                    <Image source={{ uri: item }} style={styles.productImage} />
                  </View>
                )}
              />

              {/* 상품 정보 */}
              <ScrollView style={styles.scrollContainer}>
                <Text style={styles.productName}>
                  {selectedProduct.product_name}
                </Text>
                <Text style={styles.discountRate}>
                  {selectedProduct.discount_rate} 할인
                </Text>
                <Text style={styles.finalPrice}>
                  {selectedProduct.final_price}
                </Text>
                <Text style={styles.finalPrice}>
                  ♥ {selectedProduct.heart_cnt} | {selectedProduct.category}
                </Text>
              </ScrollView>

              {/* 구매 버튼 */}
              <TouchableOpacity style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>구매하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "black",
    padding: 16,
  },
  sidebar: {
    width: width * 0.08,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  icon: {
    marginBottom: 20,
  },
  mainContent: {
    flex: 1,
    paddingLeft: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: width * 0.04,
    fontWeight: "bold",
    marginBottom: 8,
  },
  headerSubtitle: {
    color: "gray",
    fontSize: width * 0.018,
    marginBottom: 4,
  },
  title: {
    color: "white",
    fontSize: width * 0.03,
    fontWeight: "bold",
    marginVertical: 16,
  },
  scrollView: {
    flexDirection: "row",
  },
  card: {
    width: width * 0.22,
    height: width * 0.38,
    marginRight: width * 0.03,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#222",
  },
  image: {
    width: "100%",
    height: "85%",
    resizeMode: "cover",
  },
  textContainer: {
    padding: 8,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: width * 0.018,
    fontWeight: "600",
    textAlign: "center",
  },
  // 모달 오버레이 (반투명 배경)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },

  // 모달 컨텐츠 (오른쪽에서 나오는 스타일)
  modalContent: {
    position: "absolute",
    height: "100%",
    width: "80%",
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  // 닫기 버튼
  closeButton: { position: "absolute", top: 15, left: 15, zIndex: 10 },
  closeButtonText: { fontSize: 20, color: "#fff" },

  // 브랜드 이미지 & 브랜드명
  brandImage: { width: 50, height: 50, borderRadius: 25, marginBottom: 10 },
  brandName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },

  // // 스와이퍼
  // swiper: { height: 220, width: "100%" },
  // productImage: {
  //   width: "100%",
  //   height: 220,
  //   borderRadius: 10,
  //   resizeMode: "cover",
  // },
  // pagination: { bottom: 10 },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  productImage: {
    width: width * 0.8,
    height: 200,
    borderRadius: 10,
  },
  scrollContainer: {
    width: "100%",
    marginTop: 10,
  },
  // 상품 정보 텍스트
  scrollContainer: { width: "100%", marginVertical: 10 },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  discountRate: {
    fontSize: 18,
    color: "#ffcc00",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  finalPrice: {
    fontSize: 16,
    color: "#ddd",
    textAlign: "center",
    marginBottom: 5,
  },

  // 구매 버튼
  confirmButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#ff9900",
    borderRadius: 10,
    marginTop: 10,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
});

export default ProductListTestPage;
