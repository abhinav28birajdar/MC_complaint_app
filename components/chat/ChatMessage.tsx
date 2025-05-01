import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { colors } from "@/constants/Colors";
import { Message, User } from "@/types";

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  sender?: User | null;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isCurrentUser,
  sender,
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View
      style={[
        styles.container,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
      ]}
    >
      {!isCurrentUser && (
        <Avatar
          source={sender?.avatar}
          name={sender?.name || ""}
          size="sm"
          style={styles.avatar}
        />
      )}
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        {!isCurrentUser && sender && (
          <Text style={styles.senderName}>{sender.name}</Text>
        )}
        <Text style={styles.messageText}>{message.message}</Text>
        <Text
          style={[
            styles.timestamp,
            isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp,
          ]}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 16,
    maxWidth: "80%",
  },
  currentUserContainer: {
    alignSelf: "flex-end",
  },
  otherUserContainer: {
    alignSelf: "flex-start",
  },
  avatar: {
    marginRight: 8,
    alignSelf: "flex-end",
  },
  messageContainer: {
    padding: 12,
    borderRadius: 16,
  },
  currentUserMessage: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherUserMessage: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  currentUserTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  otherUserTimestamp: {
    color: colors.textSecondary,
  },
});