import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { stampImages } from "./Home";

const { width } = Dimensions.get("window");

// Mock data for the social feed
const feedData = [
  {
    id: 1,
    name: "Sophia Patel",
    avatar: "https://i.pravatar.cc/150?img=4",
    stampImage: stampImages.casaloma,
    stampTitle: "Had a great time at Casa Loma!",
    timestamp: "2 days ago",
  },
  {
    id: 2,
    name: "Tyler Brooks",
    avatar: "https://i.pravatar.cc/150?img=5",
    stampImage: stampImages.highpark,
    stampTitle: "Beautiful Sakura Blossoms at High Park",
    timestamp: "3 days ago",
  },
  {
    id: 3,
    name: "David Lee",
    avatar: "https://i.pravatar.cc/150?img=3",
    stampImage: stampImages.stlawrence,
    stampTitle: "St. Lawrence Market is a must-visit for foodies!",
    timestamp: "1 day ago",
  },
  {
    id: 4,
    name: "Alex Chen",
    avatar: "https://i.pravatar.cc/150?img=1",
    stampImage: stampImages.cntower,
    stampTitle: "I love the view from the top of the CN Tower!",
    timestamp: "2 hours ago",
  },
  {
    id: 5,
    name: "Maria Gomez",
    avatar: "https://i.pravatar.cc/150?img=2",
    stampImage: stampImages.harbourfront,
    stampTitle: "Blob Blob Blob....",
    timestamp: "4 hours ago",
  },
];

const FeedItem = ({ item }) => (
  <View style={styles.feedItem}>
    <View style={styles.userInfo}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.userText}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
    <View style={styles.stampContainer}>
      <Image source={item.stampImage} style={styles.stampImage} />
      <Text style={styles.stampTitle}>{item.stampTitle}</Text>
    </View>
  </View>
);

const Social = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Friends' Activity</Text>
      </View>
      <ScrollView
        style={styles.feedContainer}
        showsVerticalScrollIndicator={false}
      >
        {feedData.map((item) => (
          <FeedItem key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3EB",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8D5C4",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2C1810",
    fontFamily: "System",
  },
  feedContainer: {
    flex: 1,
    padding: 16,
  },
  feedItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#2C1810",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#E8D5C4",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C1810",
    marginBottom: 4,
    fontFamily: "System",
  },
  timestamp: {
    fontSize: 14,
    color: "#8B4513",
    fontFamily: "System",
  },
  stampContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  stampImage: {
    width: "100%",
    height: width - 64, // Square image based on screen width
    borderRadius: 12,
  },
  stampTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C1810",
    marginTop: 12,
    fontFamily: "System",
  },
});

export default Social;
