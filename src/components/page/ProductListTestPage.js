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
import ProductModal from "../molecule/ProductModal";
import ProductCard from "../molecule/ProductCard";

// import Swiper from "react-native-swiper";

const { width, height } = Dimensions.get("window"); // 화면 크기 가져오기

const ProductListTestPage = ({
  productList,
  closeProductList,
  productListVisible,
}) => {
  const productId = "musinsa_cardigan_0002"; //route?.params?.videoId || null;
  // const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={productListVisible}
      onRequestClose={closeProductList}
    >
      <View style={styles.container}>
        <Text style={styles.title}>N 시리즈</Text>
        <Text style={styles.mainTitle}>솔로지옥</Text>
        <Text style={styles.description}>
          세 커플이 천국도로 향한다. 지금껏 숨겨온 주고받으며 더욱 가까워지는
          솔로들.
        </Text>
        <TouchableOpacity
          style={styles.watchButton}
          onPress={() => {
            closeProductList();
          }}
        >
          <Text style={styles.watchButtonText}>▶ 이어서 시청</Text>
        </TouchableOpacity>

        <View style={{ paddingTop: "30%" }}>
          <Text style={styles.recommendTitle}>
            유사한 제품을 추천해 드릴게요
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {productList?.map((product, idx) => (
              <ProductCard
                data={product}
                onPress={() => {
                  setSelectedProduct(product);
                  setModalVisible(true);
                }}
                key={idx}
              />
            ))}
          </ScrollView>
          <ProductModal
            modalVisible={modalVisible}
            closeModal={closeModal}
            selectedProduct={selectedProduct}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    // backgroundColor: "#000",
    padding: 20,
  },
  title: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
  mainTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 5,
  },
  description: {
    color: "#ccc",
    fontSize: 14,
    marginVertical: 10,
  },
  watchButton: {
    backgroundColor: "#e50914",
    padding: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  watchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  recommendTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productCard: {
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 8,
    width: width * 0.4,
    marginRight: 10,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },
  productName: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
  },
  productPrice: {
    color: "#fff",
    fontSize: 12,
  },
  productDiscount: {
    color: "#e50914",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ProductListTestPage;
