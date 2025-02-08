import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

const VideoItem = ({ videoId }) => {
  return (
    <View style={styles.container}>
      <Text>{`video ID : ${videoId}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
  },
});

export default VideoItem;
