import { Empty } from 'antd';

export default function EmptyPlaceholder(props) {
  const { description, imageStyle } = props;
  
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={description}
      imageStyle={imageStyle}
    >
      {props.children}
    </Empty>
  );
}
