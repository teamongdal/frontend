import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CartPage from "./src/components/page/CartPage";
import HighlightPage from "./src/components/page/HighlightPage";
import ProductListPage from "./src/components/page/ProductListPage";
import VideoItemPage from "./src/components/page/VideoItemPage";
import VideoListPage from "./src/components/page/VideoListPage";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="VideoList" component={VideoListPage} />
        <Stack.Screen name="VideoItem" component={VideoItemPage} />
        <Stack.Screen name="Highlight" component={HighlightPage} />
        <Stack.Screen name="Products" component={ProductListPage} />
        <Stack.Screen name="Cart" component={CartPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
