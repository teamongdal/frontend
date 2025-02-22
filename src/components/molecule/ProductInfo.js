import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const ProductInfo = ({ item }) => {
  return (
    <View style={styles.productContainer}>
      <Image
        source={{ uri: item.product_image_url }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.brand}>{item.brand_name}</Text>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.productTitle}>{item.product_name}</Text>
        <Text style={styles.discount}>
          {item.discount_rate == 0 ? "" : `${item.discount_rate}`}
        </Text>
        <Text style={styles.price}>{item.final_price} 원</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  brand: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#888",
    marginBottom: 16,
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
    fontSize: 16,
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
});

export default ProductInfo;
