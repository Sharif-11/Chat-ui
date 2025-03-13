export type RootStackParamList = {
  Login: undefined;
  Profile: undefined;
  AgentList: undefined;
  ChatList: undefined;
  ChatBox: {
    userId: string;
    userName: string;
    agentId: string;
    agentName: string;
  };
};
