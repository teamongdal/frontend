import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

const VideoItem = ({ idx, videoId, thumbnail, videoName }) => {
  return (
    <>
      <View
        key={idx}
        className="w-48 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform"
      >
        <Image
          src={thumbnail}
          alt={videoName}
          className="w-full h-64 object-cover"
        />
        <View className="p-2 bg-gray-900 text-center text-sm font-semibold">
          {videoName}
        </View>
        <View className="p-2 bg-gray-900 text-center text-sm font-semibold">
          {videoId}
        </View>
      </View>
    </>
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
