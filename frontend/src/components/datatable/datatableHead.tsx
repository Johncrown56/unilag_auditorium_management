import React from "react";

type Props = {
  properties: Array<any>;
};

const DatatableHead = (props: Props) => {
  const { properties } = props;
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        {properties.map((item: any, i: number) => (
          <th key={i} scope="col" className="px-4 py-3">
            {item}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default DatatableHead;
