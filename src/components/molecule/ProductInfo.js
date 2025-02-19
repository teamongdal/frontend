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
    flex: 1.2,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  productInfo: {
    flex: 1,
  },
  brand: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#888",
    marginBottom: 2,
  },
  categoryTag: {
    backgroundColor: "#6C3641",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  discount: {
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProductInfo;
