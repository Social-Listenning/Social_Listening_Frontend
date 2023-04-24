import { useState } from 'react';
import FlowPlayground from './playground/FlowPlayground';
import TableBotFlow from './table/TableBotFlow';
import LoadingWrapper from '../../../../../components/shared/antd/LoadingWrapper';
import './flow.scss';

export default function BotFlowManagePage() {
  const [flowDetail, setFlowDetail] = useState(null);
  return (
    <>
      {!flowDetail ? (
        <TableBotFlow setFlowDetail={setFlowDetail} />
      ) : (
        <LoadingWrapper loading={false} className="flow-spinner">
          <FlowPlayground
            flowDetail={flowDetail}
            setFlowDetail={setFlowDetail}
          />
        </LoadingWrapper>
      )}
    </>
  );
}
