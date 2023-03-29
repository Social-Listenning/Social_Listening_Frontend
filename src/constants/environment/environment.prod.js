const baseUrl = 'http://localhost:3000';
const webSocket = 'ws://localhost:3000';

const environment = {
  baseUrl: baseUrl,
  webSocket: webSocket,
  user: `${baseUrl}/user`,
  role: `${baseUrl}/role`,
  permission: `${baseUrl}/permission`,
  notification: `${baseUrl}/notification`,
};

export const gender = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

export const role = [
  { label: 'Admin', value: 'ADMIN', color: 'red' },
  { label: 'Owner', value: 'OWNER', color: 'blue' },
  { label: 'Manager', value: 'MANAGER', color: 'green' },
  { label: 'Supporter', value: 'SUPPORTER', color: 'purple' },
];

export default environment;
