import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { colors } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { useMessageStore } from "@/store/message-store";
import { Message } from "@/types";
import { mockUsers } from "@/mocks/users";
import { MessageSquare } from "lucide-react-native";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const { messages, fetchComplaintMessages, sendMessage, isLoading } = useMessageStore();
  
  const [complaintMessages, setComplaintMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (id && user) {
      loadMessages();
    }
  }, [id, user]);

  const loadMessages = async () => {
    if (!id) return;
    
    const msgs = await fetchComplaintMessages(id);
    setComplaintMessages(msgs);
  };

  const handleSendMessage = async (text: string) => {
    if (!id || !user || !text.trim()) return;
    
    try {
      setIsSending(true);
      
      // Determine receiver based on user role
      let receiverId = "";
      if (user.role === "citizen") {
        // Find the employee assigned to this complaint
        const complaint = mockUsers.find(u => u.role === "employee");
        receiverId = complaint?.id || "employee-1"; // Fallback
      } else {
        // Find the citizen who created this complaint
        const complaint = mockUsers.find(u => u.role === "citizen");
        receiverId = complaint?.id || "citizen-1"; // Fallback
      }
      
      await sendMessage({
        complaintId: id,
        senderId: user.id,
        senderRole: user.role,
        receiverId,
        message: text,
      });
      
      await loadMessages();
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const getSender = (senderId: string) => {
    return mockUsers.find(u => u.id === senderId) || null;
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.messagesContainer}>
        {complaintMessages.length === 0 ? (
          <EmptyState
            title="No messages yet"
            description="Start the conversation by sending a message."
            icon={<MessageSquare size={48} color={colors.primary} />}
          />
        ) : (
          <FlatList
            ref={flatListRef}
            data={complaintMessages}
            renderItem={({ item }) => (
              <ChatMessage
                message={item}
                isCurrentUser={item.senderId === user?.id}
                sender={getSender(item.senderId)}
              />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />
        )}
      </View>
      
      <ChatInput onSend={handleSendMessage} isLoading={isSending} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesList: {
    paddingBottom: 16,
  },
});