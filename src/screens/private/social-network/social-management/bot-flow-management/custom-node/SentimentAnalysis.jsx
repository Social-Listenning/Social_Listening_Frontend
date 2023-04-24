import { Button } from 'antd';
import { Handle } from 'reactflow';
import {
  ExperimentOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import useEffectOnce from '../../../../../../components/hooks/useEffectOnce';

const listSentiment = ['Negative', 'Neutral', 'Positive'];

export default function SentimentAnalysis(props) {
  const { id, data } = props;

  useEffectOnce(() => {
    data.syncData(id, {
      handle: {
        negative: `sentiment-output-handle-0`,
        neutral: `sentiment-output-handle-1`,
        positive: `sentiment-output-handle-2`,
      },
    });
  });

  return (
    <div className="node-wrapper flex-center">
      <Handle
        className="msg-handle"
        id="sentiment-input-handle"
        type="target"
        position="left"
      />
      <div className="node-title flex-center">
        <ExperimentOutlined />
        Sentiment Analysis
      </div>
      <div className="customer-resp-wrapper flex-center">
        {listSentiment?.map((item, index) => (
          <div key={item} className="customer-resp">
            <Button className="full-width">{item}</Button>
            <Handle
              id={`sentiment-output-handle-${index}`}
              className="resp-handle"
              type="source"
              position="right"
            />
          </div>
        ))}
      </div>
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
