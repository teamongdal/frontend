import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

const ProductItem = ({
  productId,
  brandName = "",
  productImage,
  productName,
  price,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: productImage }} style={styles.mainImage} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.brand}>{brandName}</Text>
        <Text style={styles.productName}>{productName}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flexDirection: "row", padding: 20, backgroundColor: "#ddd" },
  imageContainer: { flex: 2, flexDirection: "row", alignItems: "center" },
  arrowButton: { padding: 10 },
  arrow: { fontSize: 24, color: "#FFD700" },
  mainImage: { width: 200, height: 200, resizeMode: "contain" },
  infoContainer: { flex: 1, padding: 20 },
  brand: { color: "#B0D840", fontSize: 16, fontWeight: "bold" },
  productName: { color: "#222", fontSize: 18, marginVertical: 5 },
  price: { color: "#FFD700", fontSize: 20, fontWeight: "bold" },
  thumbnailContainer: { flexDirection: "row", marginVertical: 10 },
  thumbnail: { width: 50, height: 50, marginHorizontal: 5, borderRadius: 5 },
  selectedThumbnail: { borderWidth: 2, borderColor: "#FFD700" },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  detailButton: { padding: 10 },
  detailText: { color: "#fff", fontSize: 16 },
});

export default ProductItem;
