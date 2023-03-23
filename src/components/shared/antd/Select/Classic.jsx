import { Select } from 'antd';
import LoadingWrapper from '../LoadingWrapper';

export default function ClassicSelect(props) {
  const {
    options = [],
    handleSelect,
    loading = false,
    filterLabel = false,
    multiple = false,
    placeHolder = `Select ...`,
    disabled = false,
    noneOption = false,
    ...other
  } = props;

  let data = [...options];
  const none = [{ label: 'None', value: '' }];
  if (noneOption) {
    data = none.concat(data);
  }

  return (
    <LoadingWrapper loading={loading}>
      <Select
        showArrow
        allowClear
        disabled={disabled}
        style={{ width: '100%' }}
        placeholder={placeHolder}
        onChange={handleSelect}
        options={data}
        {...(multiple && {
          mode: 'multiple',
          maxTagCount: 'responsive',
        })}
        {...(filterLabel && {
          filterOption: (input, option) =>
            (option?.label?.toLowerCase() ?? '').includes(
              input?.toLowerCase()
            ),
        })}
        {...other}
      />
    </LoadingWrapper>
  );
}
