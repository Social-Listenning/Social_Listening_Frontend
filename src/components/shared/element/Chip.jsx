import { Tag } from 'antd';
import { role } from '../../../constants/profile/profile';

export default function Chip(props) {
  return <Tag color={props.color}>{props.children}</Tag>;
}

export function RoleChip({ currentRole }) {
  const color = role.filter((x) => x?.value === currentRole)[0]?.color;
  return <Tag color={color}>{currentRole}</Tag>;
}
