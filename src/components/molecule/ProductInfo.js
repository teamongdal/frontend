import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { server_url } from "../../api/function";
import Icon from "react-native-vector-icons/FontAwesome";

const ProductInfo = ({ item, isFilterEnabled }) => {
  const styles = isFilterEnabled ? styles1 : styles2;
  const [isLike, setIsLike] = useState(null);

  useEffect(() => {
    if (item && item.is_like !== undefined) {
      setIsLike(item.is_like);
    }
  }, [item]);

  const handleClickLike = async () => {
    try {
      const action = isLike ? "product_unlike" : "product_like";
      const response = await fetch(
        `${server_url}/api/${action}?user_id=user_0001&product_code=${item.product_code}`,
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
    <View style={styles.productContainer}>
      <Image
        source={{ uri: item.product_image_url ?? "" }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <View style={styles.infoWrap}>
          <View style={styles.brandWrap}>
            <Image
              source={{ uri: item.brand_image ?? "" }}
              style={styles.brandImage}
            />
            <Text style={styles.brand}>{item.brand_name}</Text>
          </View>
          {/* 좋아요 버튼 */}
          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => {
              handleClickLike();
            }}
          >
            <Icon name={"heart"} size={30} color={"gray"} />
          </TouchableOpacity>
        </View>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.productTitle}>{item.product_name}</Text>
        {item.discount_rate != "0%" && item.discount_rate != "0" && (
          <Text style={styles.discount}>{item.discount_rate}</Text>
        )}
        <Text style={styles.price}>{item.final_price}</Text>
      </View>
    </View>
  );
};

const styles1 = StyleSheet.create({
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1.2,
    backgroundColor: "#fff",
    paddingHorizontal: 49,
    paddingVertical: 26,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderWidth: 5,
    borderColor: "#1C3462",
  },
  productImage: {
    width: 217,
    height: 217,
    borderRadius: 10,
    marginBottom: 10,
    marginRight: 26,
  },
  productInfo: {
    flex: 1,
  },
  infoWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandImage: {
    width: 40,
    height: 40,
    marginRight: 12,
    resizeMode: "contain",
  },
  brand: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#888",
  },
  categoryTag: {
    backgroundColor: "#6C3641",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  productTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  discount: {
    fontSize: 20,
    color: "red",
    fontWeight: "bold",
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
  },
  heartButton: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
});

const styles2 = StyleSheet.create({
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 29,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginHorizontal: 20,
  },
  productImage: {
    width: 177,
    height: 177,
    borderRadius: 10,
    marginRight: 26,
  },
  infoWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  productInfo: {
    flex: 1,
  },
  brandImage: {
    width: 40,
    height: 40,
    marginRight: 12,
    marginBottom: 12,
    resizeMode: "contain",
  },
  brand: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#888",
    marginBottom: 16,
  },
  categoryTag: {
    backgroundColor: "#6C3641",
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  discount: {
    fontSize: 20,
    color: "red",
    fontWeight: "bold",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
  },
  heartButton: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
});
export default ProductInfo;
