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
import Icon from "react-native-vector-icons/FontAwesome"; // ✅ 아이콘 변경
import ProductCarousel from "../molecule/ProductCarousel"; // ✅ 추가된 Carousel 컴포넌트 불러오기

const { width, height } = Dimensions.get("window"); // 화면 크기 가져오기

const ProductListTestPage = () => {
  const carouselRef = useRef(null);

  const productId = "musinsa_cardigan_0002"; //route?.params?.videoId || null;
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
    console.log("productList: ", productList);
  }, [productList]);

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
              {/*이미지 캐러셀*/}
              <ProductCarousel images={selectedProduct.product_images} />
              {/* 브랜드 로고 & 이름 */}
              <View style={styles.brandContainer}>
                <Image
                  source={{ uri: selectedProduct.brand_image }}
                  style={styles.brandImage}
                />
                <Text style={styles.brandName}>
                  {selectedProduct.brand_name}
                </Text>
                <Text style={styles.rating}>⭐ {selectedProduct.rating}</Text>
              </View>
              {/* 상품 정보 */}
              <View>
                <Text style={styles.categoryTag}>
                  {selectedProduct.category}
                </Text>
                <Text style={styles.productName}>
                  {selectedProduct.product_name}
                </Text>

                {/* 가격 및 할인율 */}
                <View style={styles.priceContainer}>
                  {selectedProduct.discount_rate !== "0%" && (
                    <Text style={styles.discount}>
                      {selectedProduct.discount_rate}
                    </Text>
                  )}
                  <Text style={styles.price}>
                    ₩ {selectedProduct.final_price}
                  </Text>
                </View>

                {/* 찜(♥) 개수 & 카테고리 */}
                <Text style={styles.heartCount}>
                  ♥ {selectedProduct.heart_cnt} | {selectedProduct.category}
                </Text>
              </View>
              {/* 리뷰 정보 */}
              <View>
                {/* Details 제목 */}
                <Text style={styles.detailsTitle}>Details</Text>

                {/* 설명 박스 */}
                <View style={[styles.detailsBox]}>
                  <Text style={styles.detailsText}>
                    <Icon name="plus-circle" size={14} color="#fff" />{" "}
                    <Text style={styles.detailsHighlight}>
                      클래식과 트렌드의 완벽한 조화
                    </Text>
                  </Text>
                  <Text style={styles.detailsContent}>
                    리바이스의 시그니처 트러커 재킷 디자인에 코듀로이 소재를
                    더해 클래식하면서도 트렌디한 무드를 완성했습니다. 어떤
                    스타일에도 쉽게 매치할 수 있어 데일리룩부터 캐주얼룩까지
                    활용도가 높습니다.
                  </Text>
                </View>

                {/* 하트 아이콘 & 확인 버튼 */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.heartButton}>
                    <Icon name="heart" size={22} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.confirmButton}>
                    <Text style={styles.confirmButtonText}>확인</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    width: "42%",
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
  closeButton: {
    position: "absolute",
    top: 10,
    left: -30,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#fff",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  brandImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  brandName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    flex: 1,
  },
  rating: {
    fontSize: 14,
    color: "#ffd700",
  },
  productImage: {
    width: "100%",
    height: width * 0.42,
    borderRadius: 10,
    resizeMode: "cover",
  },
  categoryTag: {
    backgroundColor: "#444",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    color: "#fff",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  discount: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
    marginRight: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  colorContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#fff",
  },
  heartCount: {
    fontSize: 14,
    color: "#bbb",
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  detailsBox: {
    backgroundColor: "#292929",
    padding: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  detailsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  detailsHighlight: {
    fontWeight: "bold",
    color: "#fff",
  },
  detailsContent: {
    fontSize: 18,
    color: "#ddd",
    lineHeight: 22,
    marginTop: 5,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  heartButton: {
    backgroundColor: "#a11a32",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#a11a32",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 10,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default ProductListTestPage;
