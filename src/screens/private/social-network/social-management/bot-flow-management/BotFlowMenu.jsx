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
import useToggle from '../../../../../components/hooks/useToggle';
import useEffectOnce from '../../../../../components/hooks/useEffectOnce';
import useUpdateEffect from '../../../../../components/hooks/useUpdateEffect';
import ClassicSelect from '../../../../../components/shared/antd/Select/Classic';
import SaveButton from '../../../../../components/shared/element/Button/SaveButton';
import Title from '../../../../../components/shared/element/Title';
import ToolTipWrapper from '../../../../../components/shared/antd/ToolTipWrapper';

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
    syncVariable,
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

  // #region add new variable
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

  // #region receive message
  const addNewId = crypto.randomUUID();
  const [varReceiveOutput, setVarReceiveOutput] = useState(
    selectedNode?.data?.output?.variable
  );
  const handleSelectReceiveOutput = (e) => {
    if (e === addNewId) {
      setVarReceiveOutput(null);
      setOpenAddNew(true);
    } else {
      setVarReceiveOutput(e);
      updateUsedVariable(e);
      selectedNode.data.syncData(selectedNode.id, {
        output: { variable: e },
      });
      syncVariable();
    }
  };
  // #endregion

  // #region sentiment analysis
  const [sentiment, setSentiment] = useState([0.3, 0.7]);
  const [varSentimentOutput, setVarSentimentOutput] = useState(
    selectedNode?.data?.output?.variable
  );
  useEffectOnce(() => {
    selectedNode?.data?.syncData(selectedNode?.id, {
      sentiment: {
        negative: `0 - ${sentiment[0]}`,
        neutral: `${sentiment[0]} - ${sentiment[1]}`,
        positive: `${sentiment[1]} - 1`,
      },
    });
  });
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
  const handleSelectSentimentOutput = (e) => {
    if (e === addNewId) {
      setVarSentimentOutput(null);
      setOpenAddNew(true);
    } else {
      setVarSentimentOutput(e);
      updateUsedVariable(e);
      selectedNode.data.syncData(selectedNode.id, {
        output: { variable: e },
      });
      syncVariable();
    }
  };
  // #endregion

  return (
    <div className="flow-menu">
      {!selectedNode ? (
        <ul className="flow-item-wrapper flex-center">
          {nodeTypes?.map((item, index) => (
            <li
              key={index}
              className="flow-item"
              onDragStart={(event) => onDragStart(event, item.value)}
              draggable
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <div className="flow-title flex-center">
            <LeftOutlined onClick={goBackMenu} />
            <b>{type}</b>
          </div>
          <div className="flow-body">
            {selectedNode.type === 'Receive' ? (
              <div className="flow-node-data">
                <span>Set received message to variable</span>
                <ClassicSelect
                  filterLabel
                  value={varReceiveOutput}
                  placeHolder={null}
                  options={[
                    {
                      label: (
                        <span className="new-var-option flex-center">
                          <PlusOutlined /> Add new variable
                        </span>
                      ),
                      value: addNewId,
                    },
                    ...variableList
                      .filter((item) => !item?.used)
                      .map((item) => {
                        return {
                          label: item?.label,
                          value: item?.label,
                        };
                      }),
                  ]}
                  handleSelect={handleSelectReceiveOutput}
                />
              </div>
            ) : selectedNode.type === 'SentimentAnalysis' ? (
              <>
                <div className="flow-node-data">
                  <span>Select the sentiment range</span>
                  <Slider
                    range
                    className="full-width"
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
                <div className="flow-node-data">
                  <span>Set the sentiment to variable</span>
                  <ClassicSelect
                    filterLabel
                    placeHolder={null}
                    value={varSentimentOutput}
                    onChange={handleSelectSentimentOutput}
                    options={[
                      {
                        label: (
                          <span className="new-var-option flex-center">
                            <PlusOutlined /> Add new variable
                          </span>
                        ),
                        value: addNewId,
                      },
                      ...variableList
                        .filter((item) => !item?.used)
                        .map((item) => {
                          return {
                            label: item?.label,
                            value: item?.label,
                          };
                        }),
                    ]}
                  />
                </div>
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
                    autoSize={{ minRows: 5, maxRows: 5 }}
                    onChange={(e) => {
                      selectedNode?.data?.syncData(selectedNode?.id, {
                        response: e.currentTarget.value,
                      });
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
