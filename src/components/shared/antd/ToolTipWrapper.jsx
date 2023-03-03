import { Tooltip } from 'antd';
export default function ToolTipWrapper(props) {
  const { tooltip, placement = 'top', ...other } = props;
  return (
    <Tooltip title={tooltip} placement={placement} {...other}>
      {props.children}
    </Tooltip>
  );
}
