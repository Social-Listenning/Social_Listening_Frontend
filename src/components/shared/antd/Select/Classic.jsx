import { Select } from 'antd';
import LoadingWrapper from '../LoadingWrapper';

export default function ClassicSelect(props) {
  const {
    options,
    handleSelect,
    loading = false,
    filterLabel = false,
    multiple = false,
    placeHolder = `Select ...`,
    disabled = false,
    ...other
  } = props;

  return (
    <LoadingWrapper loading={loading}>
      <Select
        showSearch
        disabled={disabled}
        style={{ width: '100%' }}
        placeholder={placeHolder}
        onChange={handleSelect}
        options={options}
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
