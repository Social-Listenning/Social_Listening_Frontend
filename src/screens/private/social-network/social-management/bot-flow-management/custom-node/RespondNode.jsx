import { Handle } from 'reactflow';
import {
  MessageOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

export default function RespondNode(props) {
  const { id, data } = props;

  return (
    <div className="node-wrapper flex-center">
      <div className="node-title flex-center">
        <MessageOutlined />
        Respond
      </div>
      <Handle id="resp-input-handle" type="target" position="left" />
      {/* <Handle
        id="resp-output-handle"
        type="source"
        position="right"
      /> */}
      <CloseCircleOutlined
        className="node-close-btn"
        onClick={(e) => {
          e.stopPropagation();
          data.deleteNode(id);
        }}
      />
    </div>
  );
}
