const numberType = [
  'Is Greater Than Or Equal To',
  'Is Greater Than',
  'Is Less Than Or Equal To',
  'Is Less Than',
  'Is Equal To',
  'Is Not Equal To',
];

const textType = ['Start With', 'End With'];

const dateTimeType = [
  'Is Before Or Equal To',
  'Is Before',
  'Is After Or Equal To',
  'Is After',
];

const defaultWithoutEmpty = ['Contains', 'Does Not Contains'];

const defaultType = [...defaultWithoutEmpty, 'Is Empty', 'Is Not Empty'];

export const FilterType = {
  Number: numberType,
  Text: textType,
  DateTime: dateTimeType,
  Default: defaultType,
  Dropdown: defaultWithoutEmpty,
  Boolean: defaultWithoutEmpty,
};
