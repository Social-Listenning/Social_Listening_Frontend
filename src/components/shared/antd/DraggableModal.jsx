import { Modal } from 'antd';
import { useRef } from 'react';
import Draggable from 'react-draggable';

export default function DraggableModal(props) {
  const { open, toggleOpen } = props;
  const draggleRef = useRef(null);

  return (
    <Modal
      title={
        <div
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false);
            }
          }}
          onMouseOut={() => {
            setDisabled(true);
          }}
          // fix eslintjsx-a11y/mouse-events-have-key-events
          // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
          onFocus={() => {}}
          onBlur={() => {}}
          // end
        >
          Draggable Modal
        </div>
      }
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      modalRender={(modal) => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
    >
      <p>
        Just don&apos;t learn physics at school and your life will be
        full of magic and miracles.
      </p>
      <br />
      <p>
        Day before yesterday I saw a rabbit, and yesterday a deer, and
        today, you.
      </p>
    </Modal>
  );
}
