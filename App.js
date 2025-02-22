import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import CartPage from "./src/components/page/CartPage";
import HighLightPage from "./src/components/page/HighLightPage";
import WishlistPage from "./src/components/page/WishlistPage";
import VideoDetailPage from "./src/components/page/VideoDetailPage";
import VideoListPage from "./src/components/page/VideoListPage";
// import TestAPIPage from "./src/components/page/TestAPIPage";
import ProductListTest2Page from "./src/components/page/ProductListTest2Page";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="VideoList" component={VideoListPage} />
      <Tab.Screen name="WishlistPage" component={WishlistPage} />
      <Tab.Screen name="HighLightPage" component={HighLightPage} />
      {/* <Tab.Screen name="Cart" component={CartPage} /> */}
      {/* <Tab.Screen name="ProductListTest2" component={ProductListTest2Page} /> */}
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
        <Stack.Screen name="HighLightPage" component={HighLightPage} />
        {/* <Stack.Screen name="WishlistPage" component={WishlistPage} /> */}
        {/* <Stack.Screen name="Cart" component={CartPage} /> */}
        <Stack.Screen
          name="ProductListTest2"
          component={ProductListTest2Page}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
