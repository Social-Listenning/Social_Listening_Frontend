import { Handle } from 'reactflow';
import {
  PlayCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import useEffectOnce from '../../../../../../../components/hooks/useEffectOnce';

export default function ReceiveNode(props) {
  const { id, data } = props;

  useEffectOnce(() => {
    if (!data?.output?.variable) {
      data.syncData(id, {
        output: { variable: crypto.randomUUID() },
      });
    }
  });

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
        onClick={(e) => {
          e.stopPropagation();
          data.deleteNode(id);
        }}
      />
    </div>
  );
}
