import { useState, useRef } from 'react';
import {
  FilterOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from '@ant-design/icons';
import { FilterType } from '../../../../../constants/table/filter';
import { Checker } from '../../../../../utils/dataChecker';
import useUpdateEffect from '../../../../hooks/useUpdateEffect';
import ClassicDropdown from '../../Dropdown/Classic';
import ClassicSelect from '../../Select/Classic';
import BooleanSelect from '../../Select/Boolean';
import FloatInput from '../../../element/FloatingInput/FloatInput';
import ToolTipWrapper from '../../ToolTipWrapper';
import DateTimePicker from '../../DateTimePicker/DateTimePicker';
import DateRangePicker from '../../DateTimePicker/DateRangePicker';

export default function TableHeader(props) {
  const {
    title = '',
    propsName = '',
    filter,
    sort = true,
    disableFilter = false,
    updateSorter,
    updateFilter,
    refreshFilterSorter,
    defaultFilter = null,
  } = props;

  let [value, setValue] = useState(defaultFilter);
  let [dateRangeFilter, setDateRangeFilter] = useState(false);
  let listFilter = FilterType.Default;
  let inputHeader = (
    <FloatInput
      id={title}
      className="table-input-title"
      label={title}
      value={value}
      onChange={(e) => {
        setValue(e.currentTarget.value);
      }}
      onBlur={formatFilter}
      onPressEnter={(e) => e.currentTarget.blur()}
    />
  );
  if (filter && filter.filterType) {
    // filter dropdown list
    listFilter = FilterType[filter.filterType];

    // input UI
    if (filter.filterType === 'Boolean') {
      inputHeader = (
        <BooleanSelect
          multiple
          id={title}
          placeHolder={title}
          value={value || undefined}
          handleSelect={handleSelect}
        />
      );
    } else if (filter.filterType === 'Dropdown') {
      inputHeader = (
        <ClassicSelect
          multiple
          id={title}
          placeHolder={title}
          value={value || undefined}
          options={filter.options}
          handleSelect={handleSelect}
        />
      );
    } else if (filter.filterType === 'DateTime') {
      inputHeader = !dateRangeFilter ? (
        <DateTimePicker id={title} onChange={handleSelect} />
      ) : (
        <DateRangePicker id={title} onChange={handleSelect} />
      );
    }
  }

  function handleSelect(e) {
    setValue(e);
  }

  useUpdateEffect(() => {
    if (filter && filter.filterType) {
      formatFilter();
    }
  }, [value]);

  // #region handle sorter
  const [active, setActive] = useState(null);

  function handleSorter() {
    if (active === null) {
      setActive('sort-ascending');
      formatSorter('asc');
    } else if (active === 'sort-ascending') {
      setActive('sort-descending');
      formatSorter('desc');
    } else if (active === 'sort-descending') {
      setActive(null);
      formatSorter(null);
    }
  }

  function formatSorter(type) {
    if (type) {
      updateSorter((old) => {
        let index = old.findIndex((x) => x?.props === propsName);
        if (index >= 0) {
          old[index].sortDir = type;
          return [...old];
        } else {
          return [...old, { props: propsName, sortDir: type }];
        }
      });
    } else {
      updateSorter((old) => {
        let removeOldSorter = old.filter(
          (x) => x?.props !== propsName
        );
        return removeOldSorter;
      });
    }
  }
  // #endregion

  // #region handle fitler
  const filterOperator = useRef(listFilter[0]);
  const [selectedKey, setSelectedKey] = useState('0');

  function handleFilter(e) {
    if (filterOperator.current !== listFilter[e.key]) {
      filterOperator.current = listFilter[e.key];

      if (filter && filter?.filterType === 'DateTime') {
        if (listFilter[e.key] === 'Between') {
          setDateRangeFilter(true);
        } else {
          setDateRangeFilter(false);
        }
      }

      setSelectedKey(
        listFilter
          .findIndex((x) => x === filterOperator.current)
          ?.toString()
      );
      formatFilter();
    }
  }

  function formatFilter() {
    if (!Checker.isNullOrEmpty(value)) {
      updateFilter((old) => {
        let index = old.findIndex((x) => x?.props === propsName);
        if (index >= 0) {
          old[index].value = value;
          old[index].filterOperator = filterOperator.current;
          return [...old];
        } else {
          return [
            ...old,
            {
              props: propsName,
              value: value,
              filterOperator: filterOperator.current,
              filterType: filter?.filterType ?? 'Default'
            },
          ];
        }
      });
    } else {
      updateFilter((old) => {
        if (old.filter((x) => x?.props === propsName)?.length > 0) {
          let removeOldFilter = old.filter(
            (x) => x?.props !== propsName
          );
          return removeOldFilter;
        } else return old;
      });
    }
  }
  // #endregion

  // #region handle refresh header
  useUpdateEffect(() => {
    if (refreshFilterSorter) {
      if (selectedKey !== '0') {
        setSelectedKey('0');
      }
      if (active !== null) {
        setActive(null);
      }

      if (value != null) {
        setValue(null);
      }
    }
  }, [refreshFilterSorter]);
  // #endregion

  return (
    <div className="table-header flex-center">
      {disableFilter ? (
        title
      ) : (
        <>
          <ToolTipWrapper tooltip="Click to open filters">
            <div className="flex-center">
              <ClassicDropdown
                list={listFilter}
                clickTrigger
                handleItemClick={handleFilter}
                selectedKeys={[selectedKey]}
              >
                <FilterOutlined className="table-filter-icon" />
              </ClassicDropdown>
            </div>
          </ToolTipWrapper>
          {inputHeader}
        </>
      )}
      {sort && (
        <ToolTipWrapper tooltip="Click to sort">
          <div
            className={
              'flex-center table-sorter pointer ' +
              (!active && 'no-action')
            }
            onClick={handleSorter}
          >
            {(active === 'sort-ascending' || !active) && (
              <CaretUpOutlined id="sort-ascending" />
            )}
            {(active === 'sort-descending' || !active) && (
              <CaretDownOutlined id="sort-descending" />
            )}
          </div>
        </ToolTipWrapper>
      )}
    </div>
  );
}
