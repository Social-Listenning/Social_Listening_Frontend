import { useState } from 'react';
import { Form, Input, Modal, Slider } from 'antd';
import {
  NotificationOutlined,
  ExperimentOutlined,
  PlayCircleOutlined,
  MessageOutlined,
  LeftOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import useToggle from '../../../../../../components/hooks/useToggle';
import useEffectOnce from '../../../../../../components/hooks/useEffectOnce';
import useUpdateEffect from '../../../../../../components/hooks/useUpdateEffect';
import ClassicSelect from '../../../../../../components/shared/antd/Select/Classic';
import SaveButton from '../../../../../../components/shared/element/Button/SaveButton';
import Title from '../../../../../../components/shared/element/Title';
import ToolTipWrapper from '../../../../../../components/shared/antd/ToolTipWrapper';

const nodeTypes = [
  {
    icon: <PlayCircleOutlined />,
    label: 'Receive Message',
    value: 'Receive',
  },
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
  const {
    selectedNode,
    goBackMenu,
    variableList = [],
    updateVariableList,
  } = props;
  const type = nodeTypes?.filter(
    (item) => item.value === selectedNode?.type
  )[0]?.label;

  const updateUsedVariable = (label) => {
    updateVariableList((vars) => {
      vars.map((item) => {
        // change last variable (if had) to unused
        if (item.label === selectedNode?.data?.output?.variable) {
          item.used = false;
        }
        // change current variable to used
        if (item?.label === label) {
          item.used = true;
        }
        return item;
      });
      return vars;
    });
  };

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

  // #region add new variable
  const addNewId = crypto.randomUUID();
  const [openAddNew, setOpenAddNew] = useToggle(false);
  const [addNewVariableForm] = Form.useForm();
  useUpdateEffect(() => {
    if (openAddNew) {
      document.getElementById('add-new-attribute')?.focus();
    }
  }, [openAddNew]);
  const closeAddNewModal = () => {
    addNewVariableForm.resetFields();
    setOpenAddNew(false);
  };
  // #endregion

  // #region sentiment analysis
  const [sentiment, setSentiment] = useState([0.3, 0.7]);
  useUpdateEffect(() => {
    selectedNode?.data?.syncData(selectedNode?.id, {
      sentiment: {
        negative: `0 - ${sentiment[0]}`,
        neutral: `${sentiment[0]} - ${sentiment[1]}`,
        positive: `${sentiment[1]} - 1`,
      },
    });
  }, [selectedNode]);
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
      {!selectedNode ? (
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
            {selectedNode.type === 'Receive' ? (
              <></>
            ) : selectedNode.type === 'SentimentAnalysis' ? (
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
                    <span>Negative: 0 - {sentiment[0]}</span>
                    <span>
                      Neutral: {sentiment[0]} - {sentiment[1]}
                    </span>
                    <span>Positive: {sentiment[1]} - 1</span>
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
                      defaultValue={1}
                      options={[
                        ...Array(5)
                          .fill()
                          .map((_, index) => {
                            return {
                              label:
                                index !== 0
                                  ? `${index + 1} sentiments`
                                  : `None`,
                              value: index + 1,
                            };
                          }),
                      ]}
                      onChange={(e) => {
                        if (e > 1) {
                          selectedNode.data.syncData(
                            selectedNode.id,
                            {
                              conditionNotifyAgent: e,
                            }
                          );
                        }
                      }}
                    />
                  </div>
                </ToolTipWrapper>
              </>
            ) : selectedNode.type === 'NotifyAgent' ? (
              <></>
            ) : selectedNode.type === 'Respond' ? (
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

          {openAddNew && (
            <Modal
              open={openAddNew}
              onCancel={closeAddNewModal}
              footer={
                <SaveButton
                  onClick={() => {
                    addNewVariableForm.submit();
                  }}
                />
              }
              centered
              destroyOnClose
            >
              <Title>Add new variable</Title>
              <Form
                name="new-variable-form"
                className="new-variable-form"
                layout="vertical"
                autoComplete="off"
                size="large"
                form={addNewVariableForm}
                onFinish={(model) => {
                  updateVariableList((old) =>
                    old.concat({
                      label: model?.variable,
                      used: false,
                    })
                  );
                  closeAddNewModal();
                }}
              >
                <ToolTipWrapper
                  tooltip="Only unique variable allowed"
                  placement="bottom"
                >
                  <Form.Item
                    name="variable"
                    rules={[
                      {
                        required: true,
                        validator: (_, value) => {
                          if (!value) {
                            return Promise.reject(
                              'Variable is required'
                            );
                          } else {
                            if (
                              variableList.filter(
                                (item) => item?.label === value
                              )?.length
                            ) {
                              return Promise.reject(
                                'Variable must be unique'
                              );
                            } else return Promise.resolve();
                          }
                        },
                      },
                    ]}
                  >
                    <Input id="add-new-attribute" />
                  </Form.Item>
                </ToolTipWrapper>
              </Form>
            </Modal>
          )}
        </>
      )}
    </div>
  );
}
