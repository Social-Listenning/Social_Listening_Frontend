const baseUrl = 'http://localhost:3000';
const webSocket = 'ws://localhost:3000';
const botUrl = 'http://localhost:8000';
const facebookGraph = 'https://graph.facebook.com';

const environment = {
  baseUrl: baseUrl,
  webSocket: webSocket,
  facebookGraph: facebookGraph,
  auth: `${baseUrl}/auth`,
  user: `${baseUrl}/user`,
  role: `${baseUrl}/role`,
  permission: `${baseUrl}/permission`,
  notification: `${baseUrl}/notification`,
  socialNetwork: `${baseUrl}/socialNetwork`,
  socialGroup: `${baseUrl}/socialGroup`,
  socialMessage: `${baseUrl}/social-message`,
  socialPost: `${baseUrl}/social-post`,
  setting: `${baseUrl}/setting`,
  socialTabSetting: `${baseUrl}/socialTabSeting`,
  workflow: `${baseUrl}/workflow`,
  message: `${baseUrl}/message`,
  botUrl: botUrl,
  dialogFlowConfig: `projects/boxwood-spirit-385514/locations/global`,
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
