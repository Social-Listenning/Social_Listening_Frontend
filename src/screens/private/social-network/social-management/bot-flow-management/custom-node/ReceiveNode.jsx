import { Handle } from 'reactflow';
import {
  PlayCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

export default function ReceiveNode(props) {
  const { id, data } = props;

  return (
    <div className="node-wrapper flex-center">
      <div className="node-title flex-center">
        <PlayCircleOutlined />
        Receive message
      </div>
      <Handle
        id="receive-output-handle"
        type="source"
        position="right"
      />
      <CloseCircleOutlined
        className="node-close-btn"
        onClick={() => {
          data.deleteNode(id);
        }}
      />
    </div>
  );
}
