import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import ProductCarousel from "../molecule/ProductCarousel";
import { server_url } from "../../api/function";

const { width, height } = Dimensions.get("window");

const ProductModal = ({ modalVisible, closeModal, selectedProduct }) => {
  const rules = [3.1, 3.1, 3, 3.2, 3, 3.4, 3, 3.1, 3.9, 3.6];
  const [isLike, setIsLike] = useState(null);
  const slideAnim = useState(new Animated.Value(width))[0];

  useEffect(() => {
    if (selectedProduct && selectedProduct.is_like !== undefined) {
      console.log("selectedProduct: ", selectedProduct);
      setIsLike(selectedProduct.is_like);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(slideAnim, {
        toValue: width * 0.7, // 70% 화면으로 슬라이드
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width, // 다시 오른쪽으로 이동하여 숨김
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [modalVisible]);

  const handleClickLike = async () => {
    try {
      if (!selectedProduct || !selectedProduct.product_code) {
        throw new Error("제품 정보가 없습니다.");
      }

      const action = isLike ? "product_unlike" : "product_like";
      const response = await fetch(
        `${server_url}/api/${action}?user_id=user_0001&product_code=${selectedProduct.product_code}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`서버 응답 실패: ${response.status}`);
      }

      const data = await response.json();
      console.log("API 응답 데이터:", data);

      setIsLike(!isLike);
    } catch (error) {
      console.error("좋아요 실패:", error);
    }
  };

  return (
    <>
      {modalVisible && selectedProduct && (
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackground}>
            <Animated.View
              style={[
                styles.modalContainer,
                { transform: [{ translateX: slideAnim }] },
              ]}
            >
              {/* 닫기 버튼 */}
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Icon name="times" size={16} color="#ff82a3" />
              </TouchableOpacity>

              {/* 이미지 캐러셀 */}
              {selectedProduct.product_images.filter(
                (image) => image !== "없음" // "없음"을 제외
              ).length > 1 ? (
                <ProductCarousel images={selectedProduct.product_images} />
              ) : (
                <Image
                  source={{ uri: selectedProduct.product_images[0] }}
                  style={styles.productImage}
                />
              )}

              <View style={styles.infoContainer}>
                {/* 브랜드 정보 */}
                <View style={styles.brandContainer}>
                  {selectedProduct?.brand_image && (
                    <Image
                      source={{ uri: selectedProduct.brand_image }}
                      style={styles.brandImage}
                    />
                  )}
                  <Text style={styles.brandName}>
                    {selectedProduct?.brand_name}
                  </Text>
                  <Text style={styles.rating}>
                    ⭐
                    {selectedProduct.review_rating ??
                    selectedProduct.review_rating == "없음"
                      ? Math.floor(
                          rules[
                            selectedProduct.product_code[
                              selectedProduct.product_code.length - 1
                            ]
                          ] + 1
                        ) + 0.5
                      : selectedProduct.review_rating}
                  </Text>
                </View>

                {/* 상품 정보 */}
                <Text style={styles.categoryTag}>
                  {selectedProduct?.category}
                </Text>
                <Text style={styles.productName}>
                  {selectedProduct?.product_name}
                </Text>

                {/* 가격 정보 */}
                <View style={styles.priceContainer}>
                  {selectedProduct?.discount_rate !== "0" && (
                    <Text style={styles.discount}>
                      {selectedProduct.discount_rate}
                    </Text>
                  )}
                  <Text style={styles.price}>
                    ₩ {selectedProduct?.final_price}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: "gray",
                  width: "100%",
                  shadowColor: "#000",
                  shadowOffset: { width: -2, height: 0 },
                  shadowOpacity: 0.08,
                  shadowRadius: 10,
                }}
              ></View>

              {/* 리뷰 정보 */}
              <View styles={styles.reviewContainer}>
                {/* Details 제목 */}
                <Text style={styles.detailsTitle}>Details</Text>

                {/* 설명 박스 */}
                <View style={[styles.detailsBox]}>
                  <Text style={styles.detailsText}>
                    <Icon name="plus-circle" size={14} color="#fff" />
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
              </View>

              {/* 좋아요 & 확인 버튼 */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.heartButton}
                  onPress={handleClickLike}
                >
                  <Icon
                    name={"heart"}
                    size={25}
                    color={isLike ? "#a11a32" : "gray"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={closeModal}
                >
                  <Text style={styles.confirmButtonText}>확인</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
};

const styles = {
  modalBackground: {
    position: "absolute",
    // top: 0, // 최상단 고정
    // right: 0, // 오른쪽 고정
    width: "100",
    height: "100%",
    // backgroundColor: "rgba(0, 0, 0, 0.3)", // 배경 어둡게 처리
  },
  modalContainer: {
    top: "-170%",
    width: "30%",
    height: "100%",
    // backgroundColor: "#1a1a1a",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 46,
    left: -10,
    borderWidth: 1,
    borderColor: "gray",
    padding: 8,
    borderRadius: 50,
  },
  productImage: {
    width: "100%",
    left: 10,
    resizeMode: "cover",
    borderRadius: 10,
  },

  infoContainer: {
    padding: 16,
    marginTop: 12,
    width: "370",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  brandImage: {
    width: 20,
    height: 20,
    borderRadius: 15,
    marginRight: 10,
  },
  brandName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    width: 316,
    flex: 1,
  },
  rating: {
    fontSize: 14,
    color: "#ffd700",
  },
  productImage: {
    width: width * 0.25,
    height: height * 0.4,
    resizeMode: "cover",
    borderRadius: 10,
    marginLeft: 15,
  },
  categoryTag: {
    backgroundColor: "#444",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    color: "#fff",
    alignSelf: "flex-start",
    marginBottom: 12,
    marginTop: 12,
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
    marginBottom: 18,
  },
  discount: {
    fontSize: 16,
    color: "#ff82a3",
    fontWeight: "bold",
    marginRight: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    marginTop: 16,
    marginLeft: 16,
    width: "370",
  },
  detailsBox: {
    margin: 16,
    backgroundColor: "#292929",
    padding: 16,
    borderRadius: 10,
    overflow: "hidden",
    width: "350",
  },
  detailsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 14,
    marginTop: 12,
    lineHeight: 18,
  },
  detailsHighlight: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  detailsContent: {
    fontSize: 18,
    color: "#ddd",
    lineHeight: 22,
    marginTop: 5,
    width: "330",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    width: "370",
  },
  heartButton: {
    padding: 10,
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
};

export default ProductModal;
