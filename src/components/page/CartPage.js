import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
// import CheckBox from "@react-native-community/checkbox";
// import Icon from "react-native-vector-icons/FontAwesome";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      image:
        "https://image.msscdn.net/thumbnails/images/goods_img/20230817/3469871/3469871_17321622059740_big.png?w=1200",
      brand: "브랜드",
      name: "MA1 항공점퍼 아우터",
      size: "블랙 / XL",
      price: "38,400원",
      selected: false,
    },
    {
      id: "2",
      image:
        "https://image.msscdn.net/thumbnails/images/goods_img/20230817/3469871/3469871_17321622059740_big.png?w=1200",
      brand: "브랜드",
      name: "MA1 항공점퍼 아우터",
      size: "블랙 / XL",
      price: "38,400원",
      selected: false,
    },
  ]);

  const [selectAll, setSelectAll] = useState(false);

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCartItems(
      cartItems.map((item) => ({ ...item, selected: newSelectAll }))
    );
  };

  const toggleItemSelection = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const deleteSelectedItems = () => {
    setCartItems(cartItems.filter((item) => !item.selected));
    setSelectAll(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {/* <CheckBox
        value={item.selected}
        onValueChange={() => toggleItemSelection(item.id)}
      /> */}
      <Image source={{ uri: item?.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text>{item.name}</Text>
        <Text>{item.size}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <CheckBox value={selectAll} onValueChange={toggleSelectAll} /> */}
        <Text>전체 선택</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={deleteSelectedItems}
        >
          <Text style={styles.deleteText}>선택 삭제</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  deleteButton: {
    marginLeft: "auto",
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  deleteText: { color: "white" },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
  },
  itemImage: { width: 50, height: 50, marginRight: 10 },
  itemDetails: { flex: 1 },
  brand: { fontWeight: "bold" },
  price: { color: "blue" },
});

export default CartPage;
