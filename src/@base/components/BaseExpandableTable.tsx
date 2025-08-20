import { Table, type TableProps } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

interface IProps extends TableProps {
  isLastColumnAlwaysShow?: boolean;
}

const BaseExpandableTable: React.FC<IProps> = ({
  columns = [],
  dataSource = [],
  isLastColumnAlwaysShow = false,
  ...rest
}) => {
  const router = useRouter();
  const tableContainerRef = useRef(null);
  const columnWidthRefs = useRef([]);
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [hiddenColumns, setHiddenColumns] = useState([]);

  const nestedObjFn = (obj, keys) => {
    return keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
  };

  const calculateVisibleColumnsFn = () => {
    let currentWidth = 0;
    const tableWidth = tableContainerRef.current?.offsetWidth || 250;
    const visible = [];
    const hidden = [];
    const lastColumn = columns[columns.length - 1];

    columns.forEach((column, idx) => {
      currentWidth += columnWidthRefs.current[idx] || 50;

      if (currentWidth <= tableWidth - 200) visible.push(column);
      else hidden.push(column);
    });

    if (!visible.includes(lastColumn) && isLastColumnAlwaysShow) {
      visible.push(lastColumn);
      hidden.pop();
    }

    setVisibleColumns(visible);
    setHiddenColumns(hidden);
  };

  useEffect(() => {
    if (!rest.loading) {
      columnWidthRefs.current = [];

      const headerCells = tableContainerRef.current?.querySelectorAll('th');

      if (headerCells && headerCells.length) {
        headerCells.forEach((th, idx) => {
          const width = th.getBoundingClientRect().width;
          columnWidthRefs.current[idx] = width;
        });

        calculateVisibleColumnsFn();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest.loading, columns, router.asPath]);

  useEffect(() => {
    const tableContainer = tableContainerRef.current;
    const resizeObserver = new ResizeObserver(() => calculateVisibleColumnsFn());

    if (tableContainer) resizeObserver.observe(tableContainer);

    return () => {
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, router.asPath]);

  return (
    <div ref={tableContainerRef}>
      <Table
        {...rest}
        columns={visibleColumns}
        dataSource={dataSource}
        expandable={{
          rowExpandable: () => !!hiddenColumns.length,
          expandedRowRender: (record) => {
            return (
              // <Descriptions
              //   size="small"
              //   layout="vertical"
              //   column={{ xs: 1, md: 1, lg: 2, xl: 4, xxl: 5 }}
              //   bordered
              //   labelStyle={{ fontWeight: 600 }}
              // >
              //   {hiddenColumns.map((column) => {
              //     const dataIdx = Array.isArray(column.dataIndex) ? column.dataIndex : [column.dataIndex];
              //     const value = nestedObjFn(record, dataIdx);

              //     return (
              //       <Descriptions.Item key={column.key} label={column.title}>
              //         {column.render ? column.render(value, record) : value}
              //       </Descriptions.Item>
              //     );
              //   })}
              // </Descriptions>
              <div className="flex flex-wrap gap-8">
                {hiddenColumns.map((column) => {
                  const dataIdx = Array.isArray(column.dataIndex) ? column.dataIndex : [column.dataIndex];
                  const value = nestedObjFn(record, dataIdx);

                  return (
                    <div key={column.key}>
                      <strong className="mb-1 block">{column.title}</strong>
                      {column.render ? column.render(value, record) : value}
                    </div>
                  );
                })}
              </div>
            );
          },
        }}
      />
    </div>
  );
};

export default BaseExpandableTable;
