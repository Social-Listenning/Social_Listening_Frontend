import { useState, useRef } from 'react';
import { Input, Slider, Tag } from 'antd';
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
import LoadingWrapper from '../../../../../../components/shared/antd/LoadingWrapper';

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
  const handleRespond = (e) => {
    setRespond(e);
  };
  const updateDialogflow = (intentId, respond) => {
    selectedNode?.data?.syncData(selectedNode?.id, {
      dialogFlow: {
        ...selectedNode.data?.dialogFlow,
        [botSelected]: [
          ...(selectedNode.data?.dialogFlow?.[botSelected]?.filter(
            (item) => item?.intentId !== intentId
          ) ?? []),
          {
            intentId: intentId,
            hasFallback: intentList?.filter((item) => {
              let id = null;
              if (item) {
                const splitName = item?.name?.split('/');
                id = splitName[splitName?.length - 1];
              }
              return id === intentId;
            })[0]?.is_fallback,
            respond: respond,
          },
        ],
      },
    });
    setRespond(null);
  };
  useUpdateEffect(() => {
    const resp = selectedNode.data.dialogFlow?.[botSelected]?.filter(
      (data) => data?.intentId === intentSelected
    )[0]?.respond;

    setRespond(resp);
  }, [intentSelected]);
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
                    placeHolder="Please select bot to get intents"
                    loading={intentFetching}
                    options={
                      botSelected
                        ? intentList?.map((item) => {
                            let id = null;
                            if (item) {
                              const splitName =
                                item?.name?.split('/');
                              id = splitName[splitName?.length - 1];
                            }

                            return {
                              label: item?.display_name,
                              value: id,
                            };
                          })
                        : []
                    }
                    value={intentSelected}
                    onChange={(e) => {
                      setIntentSelected(e);
                    }}
                  />
                </div>
                <div className="flow-node-data">
                  <span>Respond option</span>
                  <ToolTipWrapper
                    tooltip="Press enter to save your response, press shift + enter to move to a new line"
                    placement="left"
                  >
                    <Input.TextArea
                      allowClear
                      placeholder="Press enter to save your response, press shift + enter to move to a new line"
                      value={respond}
                      autoSize={{ minRows: 5, maxRows: 5 }}
                      onChange={(e) => {
                        handleRespond(e.currentTarget.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (e.shiftKey) {
                            // move to a new line on Shift+Enter
                            setRespond((prev) => prev + '\n');
                          } else {
                            updateDialogflow(intentSelected, respond);
                          }
                        }
                      }}
                    />
                  </ToolTipWrapper>
                </div>
                {botSelected && (
                  <div className="flow-node-data">
                    <div>
                      Intent statistics (
                      <span style={{ color: 'blue' }}>blue</span>{' '}
                      means had respond,{' '}
                      <span style={{ color: 'red' }}>red</span> means
                      no respond)
                    </div>
                    <LoadingWrapper
                      loading={intentFetching}
                      size="large"
                    >
                      <div className="intent-list-container">
                        {intentList?.map((item, index) => {
                          let id = null;
                          if (item) {
                            const splitName = item?.name?.split('/');
                            id = splitName[splitName?.length - 1];
                          }

                          let resp = selectedNode?.data?.dialogFlow?.[
                            botSelected
                          ]?.filter(
                            (intent) => intent?.intentId === id
                          )[0]?.respond;

                          return (
                            <Tag
                              className="intent-tag"
                              key={index}
                              color={
                                id === intentSelected
                                  ? resp
                                    ? 'var(--primary-color)'
                                    : '#ff0000'
                                  : resp
                                  ? 'blue'
                                  : 'red'
                              }
                              closable
                              onClick={() => {
                                setIntentSelected(id);
                              }}
                              onClose={(e) => {
                                e.preventDefault();
                                updateDialogflow(id, '');
                              }}
                            >
                              {item?.display_name}
                            </Tag>
                          );
                        })}
                      </div>
                    </LoadingWrapper>
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
