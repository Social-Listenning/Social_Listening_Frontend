import { useState, useRef } from 'react';
import {
  FilterOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from '@ant-design/icons';
import useUpdateEffect from '../../../../hooks/useUpdateEffect';
import { FilterType } from '../../../../constants/table/filter';
import ClassicDropdown from '../Dropdown/Classic';
import ClassicSelect from '../Select/Classic';
import FloatInput from '../FloatingInput/FloatInput';
import { Tooltip } from 'antd';

export default function TableHeader(props) {
  const {
    title = '',
    filter,
    sort = true,
    disableFilter = false,
    updateSorter,
    updateFilter,
    refreshFilterSorter,
  } = props;

  let listFilter = FilterType.Default;
  let [value, setValue] = useState(null);

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
        let index = old.findIndex((x) => x?.props === title);
        if (index >= 0) {
          old[index].sortDir = type;
          return [...old];
        } else {
          return [...old, { props: title, sortDir: type }];
        }
      });
    } else {
      updateSorter((old) => {
        let removeOldSorter = old.filter((x) => x?.props !== title);
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
      setSelectedKey(
        listFilter
          .findIndex((x) => x === filterOperator.current)
          ?.toString()
      );
      if (value) {
        formatFilter();
      }
    }
  }

  function formatFilter() {
    if (value) {
      updateFilter((old) => {
        let index = old.findIndex((x) => x?.props === title);
        if (index >= 0) {
          old[index].value = value;
          old[index].filterOperator = filterOperator.current;
          return [...old];
        } else {
          return [
            ...old,
            {
              props: title,
              value: value,
              filterOperator: filterOperator.current,
            },
          ];
        }
      });
    } else {
      updateFilter((old) => {
        if (old.filter((x) => x?.props === title)?.length > 0) {
          let removeOldFilter = old.filter((x) => x?.props !== title);
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

      setValue(null);
      updateSorter([]);
      updateFilter([]);
    }
  }, [refreshFilterSorter]);
  // #endregion

  return (
    <div className="table-header flex-center">
      {disableFilter ? (
        title
      ) : (
        <>
          <Tooltip title="Filters">
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
          </Tooltip>
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
        </>
      )}
      {/* <ClassicSelect placeHolder={title}/> */}
      {sort && (
        <Tooltip title="Sorts">
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
        </Tooltip>
      )}
    </div>
  );
}
