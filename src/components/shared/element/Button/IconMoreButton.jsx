import { MoreOutlined } from '@ant-design/icons';
import IconButton from './IconButton';

export default function IconMoreButton({
  tooltip = 'Click to open actions',
  placement,
  ...other
}) {
  return (
    <IconButton
      tooltip={tooltip}
      placement={placement}
      icon={<MoreOutlined />}
      {...other}
    />
  );
}
