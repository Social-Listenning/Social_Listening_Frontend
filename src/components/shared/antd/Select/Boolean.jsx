import { Select } from 'antd';

export default function BooleanSelect(props) {
  const {
    options,
    handleSelect,
    multiple = false,
    placeHolder = `Select ...`,
    disabled = false,
    ...other
  } = props;

  return (
    <Select
      disabled={disabled}
      style={{ width: '100%' }}
      placeholder={placeHolder}
      onChange={handleSelect}
      options={[
        { label: 'True', value: true },
        { label: 'False', value: false },
      ]}
      {...(multiple && {
        mode: 'multiple',
        maxTagCount: 'responsive',
      })}
      {...other}
    />
  );
}
