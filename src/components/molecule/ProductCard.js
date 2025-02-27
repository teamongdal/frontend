import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

// 현재 기기의 화면 너비를 가져옴 (반응형 적용)
const { width } = Dimensions.get("window");

// 카드 크기를 기기 너비에 맞게 조정 (iPad Pro 13인치 기준 188px → 비율 유지)
const CARD_WIDTH = width * 0.15;
const CARD_HEIGHT = CARD_WIDTH * (251 / 188);

const ProductCard = ({ data, onPress, isActive }) => {
  return (
    <TouchableOpacity onPress={() => onPress(data)}>
      <View style={[styles.card, isActive && styles.active]}>
        {/* 상품 이미지 */}
        <Image source={{ uri: data.product_images[0] }} style={styles.image} />
        <View style={styles.overlay} />

        {/* 정보 영역 */}
        <View style={styles.textContainer}>
          <Text style={styles.brand}>{data.brand_name}</Text>
          <Text style={styles.productName} numberOfLines={1}>
            {data.product_name}
          </Text>

          <View style={styles.priceRow}>
            {data.discount_rate !== "0%" && (
              <Text style={styles.discount}>{data.discount_rate}</Text>
            )}
            <Text style={styles.price}>₩ {data.final_price}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    left: 30,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "flex-end",
    margin: 10,
  },
  active: {
    borderWidth: 4,
    borderColor: "#a11a32",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // 부모(Card) 전체를 덮도록 설정
    backgroundColor: "rgba(0, 0, 0, 0.7)", // 반투명 검은색 배경
    position: "absolute",
  },
  textContainer: {
    position: "absolute",
    paddingBottom: 10,
    paddingTop: 10,
    left: 10,
    right: 10,
  },
  brand: {
    fontSize: 12,
    color: "#ccc",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  discount: {
    fontSize: 14,
    color: "#FF82A3",
    fontWeight: "bold",
    marginRight: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default ProductCard;
