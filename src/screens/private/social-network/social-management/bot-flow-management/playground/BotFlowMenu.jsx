import { useState } from 'react';
import { Input, Slider } from 'antd';
import {
  NotificationOutlined,
  ExperimentOutlined,
  MessageOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import useUpdateEffect from '../../../../../../components/hooks/useUpdateEffect';
import ClassicSelect from '../../../../../../components/shared/antd/Select/Classic';
import ToolTipWrapper from '../../../../../../components/shared/antd/ToolTipWrapper';

const nodeTypes = [
  {
    icon: <ExperimentOutlined />,
    label: 'Sentiment Analysis',
    value: 'SentimentAnalysis',
  },
  {
    icon: <NotificationOutlined />,
    label: 'Notify Agent',
    value: 'NotifyAgent',
  },
  { icon: <MessageOutlined />, label: 'Respond', value: 'Respond' },
];

const onDragStart = (event, nodeType) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

export default function BotFlowMenu(props) {
  const { selectedNode, goBackMenu } = props;
  const type = nodeTypes?.filter(
    (item) => item.value === selectedNode?.type
  )[0]?.label;

  let hasMenu = true;
  if (
    !selectedNode ||
    selectedNode?.type === 'Receive' ||
    selectedNode?.type === 'NotifyAgent'
  ) {
    hasMenu = false;
  }

  useUpdateEffect(() => {
    if (selectedNode?.type === 'Receive') {
    } else if (selectedNode?.type === 'SentimentAnalysis') {
      setSentiment(
        selectedNode?.data?.sentiment?.neutral?.split(' - ') ?? [
          0.3, 0.7,
        ]
      );
    } else if (selectedNode?.type === 'Respond') {
      setRespond(selectedNode?.data?.respond);
    }
  }, [selectedNode]);

  // #region sentiment analysis
  const [sentiment, setSentiment] = useState([0.3, 0.7]);
  const handleChangeSentiment = (value) => {
    setSentiment(value);
    selectedNode?.data?.syncData(selectedNode?.id, {
      sentiment: {
        negative: `0 - ${value[0]}`,
        neutral: `${value[0]} - ${value[1]}`,
        positive: `${value[1]} - 1`,
      },
    });
  };
  // #endregion

  // #region respond
  const [respond, setRespond] = useState(null);
  const handleRepond = (e) => {
    setRespond(e);
    selectedNode?.data?.syncData(selectedNode?.id, {
      respond: e,
    });
  };
  // #endregion

  return (
    <div className="flow-menu">
      {!hasMenu ? (
        <>
          <ul className="flow-item-wrapper flex-center">
            {nodeTypes?.map((item, index) => (
              <li
                key={index}
                className="flow-item"
                onDragStart={(event) =>
                  onDragStart(event, item.value)
                }
                draggable
              >
                {item.icon}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <div className="flow-title flex-center">
            <LeftOutlined onClick={goBackMenu} />
            <b>{type}</b>
          </div>
          <div className="flow-body">
            {selectedNode?.type === 'SentimentAnalysis' ? (
              <>
                <div className="flow-node-data">
                  <span>Select the sentiment range</span>
                  <Slider
                    range
                    value={sentiment}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={handleChangeSentiment}
                  />
                  <div className="sentiment-display">
                    <span className="negative">
                      Negative: 0 - {sentiment[0]}
                    </span>
                    <span className="neutral">
                      Neutral: {sentiment[0]} - {sentiment[1]}
                    </span>
                    <span className="positive">
                      Positive: {sentiment[1]} - 1
                    </span>
                  </div>
                </div>
                <ToolTipWrapper
                  tooltip="Notify agent will end the flow"
                  placement="left"
                >
                  <div className="flow-node-data">
                    <span>
                      Select sentiment's amount to notify agent
                    </span>
                    <ClassicSelect
                      filterLabel
                      placeHolder={null}
                      defaultValue={-1}
                      options={[
                        ...Array(5)
                          .fill()
                          .map((_, index) => {
                            return {
                              label:
                                index !== 0
                                  ? `${index + 1} sentiments`
                                  : `None`,
                              value: index !== 0 ? index + 1 : -1,
                            };
                          }),
                      ]}
                      onChange={(e) => {
                        selectedNode.data.syncData(selectedNode.id, {
                          conditionNotifyAgent: e,
                        });
                      }}
                    />
                  </div>
                </ToolTipWrapper>
              </>
            ) : selectedNode?.type === 'Respond' ? (
              <>
                <div className="flow-node-data">
                  <span>Intent</span>
                  <ClassicSelect filterLabel placeHolder={null} />
                </div>
                <div className="flow-node-data">
                  <span>Response option</span>
                  <Input.TextArea
                    allowClear
                    value={respond}
                    autoSize={{ minRows: 5, maxRows: 5 }}
                    onChange={(e) => {
                      handleRepond(e.currentTarget.value);
                    }}
                  />
                </div>
              </>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
