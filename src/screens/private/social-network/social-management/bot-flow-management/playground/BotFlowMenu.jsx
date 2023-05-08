import { useState, useRef } from 'react';
import { Input, Slider } from 'antd';
import {
  NotificationOutlined,
  ExperimentOutlined,
  MessageOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import {
  useGetDialogflowIntents,
  useGetListDialogflowBot,
} from '../../../socialNetworkService';
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
  const { pageId, selectedNode, goBackMenu } = props;
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
      if (selectedNode?.data?.dialogFlow) {
        const botId = botList?.filter((bot) => {
          let id = null;
          if (bot) {
            const splitName = bot?.name?.split('/');
            id = splitName[splitName?.length - 1];
          }
          return selectedNode[id]
        });
        // setBotSelected(selectedNode?.data?.botId);
        // setIntentSelected(selectedNode?.data?.intentId);
        // setRespond(selectedNode?.data?.respond);
      }
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
  const fetchBotDialogflow = useRef(true);
  const [botSelected, setBotSelected] = useState(null);
  const [intentSelected, setIntentSelected] = useState(null);
  const { data: botList, isFetching: botFetching } =
    useGetListDialogflowBot(
      fetchBotDialogflow.current && !botSelected
    );

  const { data: intentList, isFetching: intentFetching } =
    useGetDialogflowIntents(
      botSelected,
      fetchBotDialogflow.current && botSelected?.length > 0
    );
  fetchBotDialogflow.current = false;

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
                  <span>Bot</span>
                  <ClassicSelect
                    filterLabel
                    placeHolder={null}
                    loading={botFetching}
                    options={botList
                      ?.filter((bot) =>
                        bot?.display_name?.includes(`-${pageId}`)
                      )
                      ?.map((item) => {
                        let formatName = item?.display_name;
                        if (formatName?.includes(`-${pageId}`)) {
                          formatName = formatName.substring(
                            0,
                            formatName.length - 37
                          );
                        }

                        let id = null;
                        if (item) {
                          const splitName = item?.name?.split('/');
                          id = splitName[splitName?.length - 1];
                        }

                        return {
                          label: formatName,
                          value: id,
                        };
                      })}
                    value={botSelected}
                    onChange={(e) => {
                      fetchBotDialogflow.current = true;
                      setBotSelected(e);
                    }}
                  />
                </div>
                <div className="flow-node-data">
                  <span>Intent</span>
                  <ClassicSelect
                    filterLabel
                    placeHolder={null}
                    loading={intentFetching}
                    options={intentList?.map((item) => {
                      let id = null;
                      if (item) {
                        const splitName = item?.name?.split('/');
                        id = splitName[splitName?.length - 1];
                      }

                      return {
                        label: item?.display_name,
                        value: id,
                      };
                    })}
                    value={intentSelected}
                    onChange={(e) => {
                      setIntentSelected(e);
                    }}
                  />
                </div>
                <div className="flow-node-data">
                  <span>Respond option</span>
                  <ToolTipWrapper
                    tooltip="Press enter to save your response, press shift enter to move to a new line"
                    placement="left"
                  >
                    <Input.TextArea
                      allowClear
                      value={respond}
                      autoSize={{ minRows: 5, maxRows: 5 }}
                      onChange={(e) => {
                        handleRepond(e.currentTarget.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (e.shiftKey) {
                            // move to a new line on Shift+Enter
                            setRespond((prev) => prev + '\n');
                          } else {
                            selectedNode?.data?.syncData(
                              selectedNode?.id,
                              {
                                dialogFlow: {
                                  ...selectedNode.data?.dialogFlow,
                                  [botSelected]: [
                                    ...(selectedNode.data
                                      ?.dialogFlow?.[botSelected] ??
                                      []),
                                    {
                                      intentId: intentSelected,
                                      repond: respond,
                                    },
                                  ],
                                },
                              }
                            );
                            setRespond(null);
                          }
                        }
                      }}
                    />
                  </ToolTipWrapper>
                </div>
                {botSelected && selectedNode?.data?.dialogFlow && (
                  <div className="flow-node-data">
                    {selectedNode.data.dialogFlow?.[botSelected]?.map(
                      (item) => {
                        const intentName = intentList?.filter(
                          (intent) =>
                            intent.name?.includes(item.intentId)
                        )[0]?.display_name;

                        return (
                          <div>
                            {intentName}: {item.repond}
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
