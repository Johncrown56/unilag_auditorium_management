import React from "react";

type Props = {
  columns: Array<any>;
};

const DatatableHead = (props: Props) => {
  const { columns } = props;
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        {columns.map((item: any, i: number) => (
          <th key={i} scope="col" className="px-4 py-3">
            {item.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default DatatableHead;
