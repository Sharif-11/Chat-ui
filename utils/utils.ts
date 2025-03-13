export const formatMessage = (
  text: string,
  agentId: string,
  userId: string,
  sender: string,
  messagesLength: number
) => {
  return {
    _id: messagesLength + 1,
    text,
    createdAt: new Date(),
    user: {
      _id: sender === agentId ? 1 : 2,
      name: sender === agentId ? "Agent" : "User",
      avatar: "https://placeimg.com/140/240/any",
    },
  };
};
