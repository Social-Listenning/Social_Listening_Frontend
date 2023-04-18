import React from 'react';
import { DeleteTwoTone } from '@ant-design/icons';
import { Handle } from 'reactflow';

export default function OutputNode(props) {
  console.log(props);
  return (
    <div className="node">
      <Handle
        id="a"
        type="source"
        position="right"
        isConnectable={true}
      />
    </div>
  );
}
