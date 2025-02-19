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
        <Icon name="angle-left" size={24} color="#ff6680" />
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
        <Icon name="angle-right" size={24} color="#ff6680" />
      </TouchableOpacity>

      {/* Bullets 페이지네이션 */}
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === currentIndex ? "#ff6680" : "#777" },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  productImage: {
    width: width * 0.42,
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
    position: "absolute",
    left: 0,
  },
  arrowLeft: {
    position: "absolute",
    left: 10,
    zIndex: 10,
    // backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 10,
    // borderRadius: 20,
  },
  arrowRight: {
    position: "absolute",
    right: 10,
    zIndex: 10,
    // backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 10,
    // borderRadius: 20,
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
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
