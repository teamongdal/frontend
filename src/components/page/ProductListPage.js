import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const ProductListPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const productData = [
    {
      product_id: 1,
      product_pic_url:
        "https://image.msscdn.net/thumbnails/images/goods_img/20230817/3469871/3469871_17321622059740_big.png?w=1200",
      brand_name: "브랜드1",
      product_name: "프라블럼 수프림 LS 티셔츠 - 화이트 / STAR60023WHT",
      price: "243000원",
      product_pic_detail_url: [
        "https://image.msscdn.net/thumbnails/images/prd_img/20220311/2413945/detail_2413945_39_big.jpg?w=1200",
        "https://image.msscdn.net/thumbnails/images/prd_img/20220311/2413945/detail_2413945_4_big.jpg?w=1200",
        "https://image.msscdn.net/thumbnails/images/prd_img/20220311/2413945/detail_2413945_11_big.jpg?w=1200",
      ],
      detail: "https://www.musinsa.com/products/3213670",
    },
    {
      product_id: 2,
      product_pic_url:
        "https://image.msscdn.net/thumbnails/images/goods_img/20220311/2413945/2413945_2_big.jpg?w=1200",
      brand_name: "브랜드2",
      product_name: "오버 핏 타입2 트러커 재킷 [다크 그레이]",
      price: "35,890원",
      product_pic_detail_url: [
        "https://image.msscdn.net/thumbnails/images/prd_img/20220311/2413945/detail_2413945_39_big.jpg?w=1200",
        "https://image.msscdn.net/thumbnails/images/prd_img/20220311/2413945/detail_2413945_4_big.jpg?w=1200",
        "https://image.msscdn.net/thumbnails/images/prd_img/20220311/2413945/detail_2413945_11_big.jpg?w=1200",
      ],
      detail: "https://www.musinsa.com/products/2413945",
    },
  ];

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/similar_product_list")
      .then((response) => response.json())
      .then((data) => {
        console.log("API 응답 데이터:", data);
        setProductListData(data || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
        setIsLoading(true);
      });
  }, []);

  const handleClickProductItemLike = (userId, productId) => {
    fetch("http://127.0.0.1:8000/api/product_like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, product_id: productId }),
    })
      .then((response) => response.json())
      .then((data) => console.log("API 응답 데이터:", data))
      .catch((error) => console.error("API 요청 실패:", error));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <View style={styles.container}>
      {Array.isArray(productData) &&
        productData.map((data, idx) => (
          <React.Fragment key={idx}>
            <TouchableOpacity onPress={handlePrev} style={styles.arrowButton}>
              <Text style={styles.arrow}>{"〈"}</Text>
            </TouchableOpacity>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: data.product_pic_url }}
                style={styles.mainImage}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.brand}>{data.brand_name}</Text>
              <Text style={styles.productName}>{data.product_name}</Text>
              <Text style={styles.price}>{data.price}</Text>
              <View style={styles.thumbnailContainer}>
                {data.product_pic_detail_url.map((img, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setCurrentIndex(index)}
                  >
                    <Image
                      source={{ uri: img }}
                      style={[
                        styles.thumbnail,
                        currentIndex === index && styles.selectedThumbnail,
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.detailButton}>
                  <Text style={styles.detailText}>← 세부정보</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.detailButton}>
                  <Text style={styles.detailText}>〈 이전</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.detailButton}>
                  <Text style={styles.detailText}>다음 〉</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
              <Text style={styles.arrow}>{"〉"}</Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", padding: 20, backgroundColor: "#20302A" },
  imageContainer: { flex: 2, flexDirection: "row", alignItems: "center" },
  arrowButton: { padding: 10 },
  arrow: { fontSize: 24, color: "#FFD700" },
  mainImage: { width: 200, height: 200, resizeMode: "contain" },
  infoContainer: { flex: 3, padding: 20 },
  brand: { color: "#B0D840", fontSize: 16, fontWeight: "bold" },
  productName: { color: "#fff", fontSize: 18, marginVertical: 5 },
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

export default ProductListPage;
