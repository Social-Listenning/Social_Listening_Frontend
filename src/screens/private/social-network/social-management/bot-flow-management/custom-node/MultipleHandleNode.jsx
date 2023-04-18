import React from 'react';
import { Handle } from 'reactflow';

export default function MultipleHandleNode(props) {
console.log(props)
  return (
    <div className="node">
      {props.data?.component}
      <Handle
        id="c"
        type="target"
        position="left"
        isConnectable={true}
      />
      <Handle
        id="c"
        type="source"
        position="right"
        isConnectable={true}
      />
    </div>
  );
}
