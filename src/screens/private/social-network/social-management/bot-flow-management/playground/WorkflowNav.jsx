import { Button } from 'antd';
import React from 'react';
import SaveButton from '../../../../../../components/shared/element/Button/SaveButton';
import ExitButton from '../../../../../../components/shared/element/Button/ExitButton';

export default function WorkflowNav(props) {
  const { flowDetail, exit } = props;

  return (
    <div className="flow-nav flex-center">
      <div className="flow-name">Name: {flowDetail?.name}</div>
      <div className="flow-utils flex-center">
        <SaveButton />
        <ExitButton onClick={exit} />
      </div>
    </div>
  );
}
