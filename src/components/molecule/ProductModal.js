import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import ProductCarousel from "../molecule/ProductCarousel";

const { width, height } = Dimensions.get("window"); // 화면 크기 가져오기
const API_URL = "http://127.0.0.1:8000"; // 백엔드 서버 주소
const ProductModal = ({ modalVisible, closeModal, selectedProduct }) => {
  const [isLike, setIsLike] = useState(null);

  useEffect(() => {
    if (selectedProduct && selectedProduct.is_like !== undefined) {
      console.log("selectedProduct: ", selectedProduct);
      setIsLike(selectedProduct.is_like);
    }
  }, [selectedProduct]); // selectedProduct가 변경될 때 실행

  const handleClickLike = async () => {
    try {
      if (!selectedProduct || !selectedProduct.product_code) {
        throw new Error("제품 정보가 없습니다.");
      }

      const action = isLike ? "product_unlike" : "product_like";
      const response = await fetch(
        `${API_URL}/api/${action}?user_id=user_0001&product_code=${selectedProduct.product_code}`,
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

      setIsLike(!isLike); // 상태 반대로 변경
    } catch (error) {
      console.error("좋아요 실패:", error);
    }
  };
  return (
    <View>
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
              {<Text>{selectedProduct.product_images.length}</Text>}
              {selectedProduct.product_images.filter((image) => {
                image != "없음";
              }) > 1 ? (
                <ProductCarousel images={selectedProduct.product_images} />
              ) : (
                <Image
                  source={{ uri: selectedProduct.product_images[0] }}
                  style={styles.productImage}
                />
              )}

              {/* 브랜드 로고 & 이름 */}
              <View style={styles.brandContainer}>
                <Image
                  source={{ uri: selectedProduct.brand_image }}
                  style={styles.brandImage}
                />
                <Text style={styles.brandName}>
                  {selectedProduct.brand_name}
                </Text>
                <Text style={styles.rating}>
                  ⭐ {selectedProduct.rating ?? 4.2}
                </Text>
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
                  {selectedProduct.discount_rate !== "0" && (
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
                  <TouchableOpacity
                    style={styles.heartButton}
                    onPress={handleClickLike}
                  >
                    <Icon
                      name={"heart"}
                      size={22}
                      color={isLike ? "#a11a32" : "gray"}
                    />
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

const styles = {
  // 모달 시작!
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
    height: width * 0.35,
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
