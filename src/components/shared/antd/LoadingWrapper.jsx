import { Spin } from 'antd';

export default function LoadingWrapper(props) {
  const { loading, ...other } = props;

  return (
    <Spin spinning={loading} {...other}>
      {props.children}
    </Spin>
  );
}
