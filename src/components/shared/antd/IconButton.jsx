import { Button, Tooltip } from 'antd';

export default function IconButton(props) {
  const {
    tooltip,
    type = 'primary',
    shape = 'circle',
    ...other
  } = props;

  return (
    <Tooltip title={tooltip}>
      <Button type={type} shape={shape} {...other}>
        {props.children}
      </Button>
    </Tooltip>
  );
}
