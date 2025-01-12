import { Redirect } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import { Storage } from "expo-sqlite/kv-store";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default function Index() {
  const videoSource = require("@/assets/videos/bismilAllah.mp4");
  const [isFirstOpen, setIsFirstOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State to handle the loading check
  const [videoEnded, setVideoEnded] = useState(false);

  // Initialize the video player
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false; // Play only once
  });

  // Check if this is the first open
  useEffect(() => {
    const checkFirstOpen = async () => {
      const firstOpen = await Storage.getItem("FirstOpenHasHappened");
      if (!firstOpen) {
        setIsFirstOpen(true);
        await Storage.setItem("FirstOpenHasHappened", "true");
      }
      setIsLoading(false); // Finished loading the first-open check
    };
    checkFirstOpen();
  }, []);

  // Listen for the video to finish playing
  useEffect(() => {
    const listener = player.addListener("playToEnd", () => {
      setVideoEnded(true); // Mark the video as ended
    });

    return () => {
      listener.remove(); // Clean up the listener
    };
  }, [player]);

  // Play the video when the component mounts if it's the first open
  useEffect(() => {
    if (isFirstOpen) {
      player.play();
    }
  }, [isFirstOpen, player]);

  // Show nothing while loading the first-open state
  if (isLoading) {
    return null;
  }

  if (videoEnded || !isFirstOpen) {
    // Redirect after the video ends or if it's not the first open
    return <Redirect href="/(tabs)/home/" />;
  }

  // Show the video if it's the first open
  return (
    <View style={styles.videoContainer}>
      <VideoView
        player={player}
        style={styles.video}
        nativeControls={false} // Disable native controls
        allowsFullscreen={false} // Prevent fullscreen mode
        allowsPictureInPicture={false} // Disable Picture-in-Picture
      />
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.universal.bismilAllahBackground,
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
