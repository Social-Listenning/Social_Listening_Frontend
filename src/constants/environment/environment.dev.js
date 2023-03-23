const baseUrl = 'http://localhost:3000';
const webSocket = 'ws://localhost:3000';

const environment = {
  baseUrl: baseUrl,
  webSocket: webSocket,
  user: `${baseUrl}/user`,
  role: `${baseUrl}/role`,
  permission: `${baseUrl}/permission`,
};

export default environment;
