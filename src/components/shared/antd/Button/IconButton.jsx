import { Button, Tooltip } from 'antd';
import './button.scss';

export default function IconButton(props) {
  const {
    tooltip = '',
    placement = 'top',
    icon,
    className = '',
    ...other
  } = props;

  return (
    <Tooltip title={tooltip} placement={placement}>
      <Button className={`icon-btn ${className}`} shape="circle" icon={icon} {...other} />
    </Tooltip>
  );
}
