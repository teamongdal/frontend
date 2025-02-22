import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import HighLightPage from "./src/components/page/HighLightPage";
import WishlistPage from "./src/components/page/WishlistPage";
import VideoDetailPage from "./src/components/page/VideoDetailPage";
import VideoListPage from "./src/components/page/VideoListPage";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="VideoList" component={VideoListPage} />
      <Tab.Screen name="WishlistPage" component={WishlistPage} />
      <Tab.Screen name="HighLightPage" component={HighLightPage} />
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
        <Stack.Screen name="WishlistPage" component={WishlistPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
