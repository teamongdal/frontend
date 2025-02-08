import React from "react";
import { StyleSheet, View, Text } from "react-native";

const ProductItem = ({ productId }) => {
  return (
    <View style={styles.container}>
      <Text>{`Product ID : ${productId}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
  },
});

export default ProductItem;
