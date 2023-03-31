const baseUrl = 'http://localhost:3000';
const webSocket = 'ws://localhost:3000';
const facebookGraph = 'https://graph.facebook.com';

const environment = {
  baseUrl: baseUrl,
  webSocket: webSocket,
  facebookGraph: facebookGraph,
  user: `${baseUrl}/user`,
  role: `${baseUrl}/role`,
  permission: `${baseUrl}/permission`,
  notification: `${baseUrl}/notification`,
  socialNetwork: `${baseUrl}/socialNetwork`,
  socialGroup: `${baseUrl}/socialGroup`,
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
