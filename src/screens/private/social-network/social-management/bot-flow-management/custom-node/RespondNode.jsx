import { Handle } from 'reactflow';
import {
  MessageOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Input } from 'antd';

export default function RespondNode(props) {
  const { id, data } = props;

  return (
    <div className="node-wrapper flex-center">
      <div className="node-title flex-center">
        <MessageOutlined />
        Your response
      </div>
      {/* <div className="your-msg-input">
        <Input.TextArea
          allowClear
          autoSize={{ minRows: 5, maxRows: 5 }}
          onChange={(e) => {
            data.syncData(id, { response: e.currentTarget.value });
          }}
        />
      </div> */}
      <Handle id="resp-input-handle" type="target" position="left" />
      <Handle
        id="resp-output-handle"
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
