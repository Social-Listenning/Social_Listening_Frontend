import React from 'react';
import { Handle } from 'reactflow';

export default function InputNode(props) {

  return (
    <div className="node">
      <Handle
        id="b"
        type="target"
        position="left"
        isConnectable={true}
      />
    </div>
  );
}
