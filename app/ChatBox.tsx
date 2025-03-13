import { useAuth } from "@/Contexts/authContext";
import { formatMessage } from "@/utils/utils";
import React, { useCallback, useEffect, useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";
interface Message {
  _id: number;
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    name: string;
    avatar: string;
  };
}
export default function ChatBox({ route }: { route: any }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { userId, userName, agentId, agentName } = route.params;
  const { user, socket } = useAuth();
  useEffect(() => {
    // setMessages([
    //   {
    //     _id: 1,
    //     text: "Hello developer",
    //     createdAt: new Date(),
    //     user: {
    //       _id: 2,
    //       name: "React Native",
    //       avatar: "https://placeimg.com/140/140/any",
    //     },
    //   },
    // ]);
    if (socket) {
      socket.on("receive_message", ({ sender, message }) => {
        // alert(`Received message: ${message}, Sender: ${sender}`);
        if (sender === userId) {
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [
              formatMessage(
                message,
                agentId,
                userId,
                sender,
                previousMessages.length
              ),
            ])
          );
        }
      });
      return () => {
        socket.off("receive_message");
      };
    }
  }, [socket]);

  // const onSend = useCallback((messages: Message[] = []) => {
  //   setMessages((previousMessages) =>
  //     GiftedChat.append(previousMessages, messages)
  //   );
  // }, []);
  const onSend = useCallback(
    (messages: Message[]) => {
      const message = messages[messages.length - 1].text;
      // alert(`Message sent: ${message}, ${user?.userId}, ${currentUserId}, Sender: ${user?.userId}`);
      if (socket && user?.userId) {
        socket.emit("send_message", {
          agentId,
          userId,
          message,
          sender: agentId,
        });

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [
            formatMessage(
              message,
              agentId,
              userId,
              agentId,
              previousMessages.length
            ),
          ])
        );
      }
    },
    [user, socket]
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
}
