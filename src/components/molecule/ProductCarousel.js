import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Icon from "react-native-vector-icons/FontAwesome";
const { width, height } = Dimensions.get("window");

const ProductCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = React.useRef(null);

  // 왼쪽 / 오른쪽 화살표 클릭 시 동작
  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  return (
    <View style={styles.carouselContainer}>
      {/* 왼쪽 화살표 버튼 */}
      <TouchableOpacity style={styles.arrowLeft} onPress={handlePrev}>
        <Icon name="angle-left" size={20} color="#ff82a3" />
      </TouchableOpacity>

      {/* 이미지 캐러셀 */}
      <Carousel
        ref={carouselRef}
        loop
        width={width * 0.42}
        height={height * 0.4}
        data={images}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.productImage} />
        )}
        autoPlay={false}
        pagingEnabled
        scrollAnimationDuration={500}
        onSnapToItem={(index) => setCurrentIndex(index)} // 현재 페이지 업데이트
      />

      {/* 오른쪽 화살표 버튼 */}
      <TouchableOpacity style={styles.arrowRight} onPress={handleNext}>
        <Icon name="angle-right" size={20} color="#ff82a3" />
      </TouchableOpacity>

      {/* Bullets 페이지네이션 */}
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === currentIndex ? "#830023" : "#777" },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    left: "23%",
    top: "10%",
  },
  productImage: {
    width: width * 0.25,
    height: height * 0.45,
    resizeMode: "cover",
    borderRadius: 10,
    marginLeft: 15,
  },
  arrowLeft: {
    position: "absolute",
    left: 10,
    zIndex: 10,
    padding: 10,
    top: "45%",
  },
  arrowRight: {
    position: "absolute",
    right: -360,
    zIndex: 10,
    top: "45%",
    padding: 10,
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    left: 160,
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
});

export default ProductCarousel;
