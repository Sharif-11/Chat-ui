interface LoginRequest {
  agentId: string;
  password: string;
}
interface User {
  role: string;
  userId: string;
  name: string;
  token: string;
}
interface LoginResponse {
  success: boolean;
  message: string;
  data?: User;
}
interface CreateAgentRequest {
  name: string;
  userId: string;
  password: string;
}
interface CreateAgentResponse {
  success: boolean;
  message: string;
  data?: string;
}
interface Agent {
  userId: string;
  name: string;
}
interface GetAgentsResponse {
  success: boolean;
  message: string;
  data?: Agent[];
}
interface LogoutResponse {
  success: boolean;
  message: string;
}
