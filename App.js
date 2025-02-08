import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import CartPage from "./src/components/page/CartPage";
import HighlightPage from "./src/components/page/HighlightPage";
import ProductListPage from "./src/components/page/ProductListPage";
import VideoDetailPage from "./src/components/page/VideoDetailPage";
import VideoListPage from "./src/components/page/VideoListPage";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="VideoList" component={VideoListPage} />
      <Tab.Screen name="ProductList" component={ProductListPage} />
      <Tab.Screen name="Highlight" component={HighlightPage} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="VideoDetail" component={VideoDetailPage} />
        <Stack.Screen name="Highlight" component={HighlightPage} />
        <Stack.Screen name="Products" component={ProductListPage} />
        <Stack.Screen name="Cart" component={CartPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
