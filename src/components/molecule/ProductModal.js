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
  Linking,
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
      setIsLike(!isLike);
    } catch (error) {
      console.error("좋아요 실패:", error);
    }
  };

  const handleGoShopping = () => {
    Linking.openURL(selectedProduct.detail_url);
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
                  <Image
                    source={require("../../assets/icon-star.png")}
                    style={styles.iconStar}
                  />
                  <Text style={styles.rating}>
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
                  {selectedProduct?.discount_rate !== "0%" && (
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
                    <Image
                      source={require("../../assets/icon-robot.png")}
                      style={styles.iconRobot}
                    />
                    <Text style={styles.detailsHighlight}>
                      {"   AI 리뷰 요약  "}
                    </Text>
                  </Text>
                  <Text style={styles.detailsContent} numberOfLines={4}>
                    {selectedProduct.reviews[0]}
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
                  onPress={handleGoShopping}
                >
                  <Text style={styles.confirmButtonText}>상품 바로가기</Text>
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
    top: "-200%",
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
  infoContainer: {
    padding: 16,
    marginTop: 30,
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
    backgroundColor: "white",
  },
  brandName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    width: 316,
    flex: 1,
  },
  iconStar: {
    width: 16,
    height: 16,
    marginRight: 4,
    marginBottom: 4,
  },
  iconRobot: {
    width: 20,
    height: 20,
  },
  rating: {
    fontSize: 14,
    color: "#ffd700",
    marginBottom: 5,
    paddingLeft: 5,
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
    fontSize: 24,
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
    justifyContent: "center",
  },
  detailsHighlight: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 17,
    paddingBottom: 10,
  },
  detailsContent: {
    fontSize: 18,
    color: "#ddd",
    lineHeight: 22,
    marginTop: 5,
    width: "100%",
    height: "70",
  },
  reviewContainer: {
    marginTop: -30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
