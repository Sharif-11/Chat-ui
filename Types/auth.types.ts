interface LoginRequest {
  agentId: string;
  password: string;
}
interface LoginResponse {
  role: string;
  userId: string;
  name: string;
  token: string;
}
