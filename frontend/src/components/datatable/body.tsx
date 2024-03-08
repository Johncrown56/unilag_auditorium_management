import moment from "moment";
import { BiEdit } from "react-icons/bi";
import { HiEye, HiTrash } from "react-icons/hi2";

type Props = {
  showData: Array<any>
  columns: { name: string; label: string, display?: string }[];
  title: string,
  idColumnName: string,
  openDropdown: any,
  handleAction?: (value: string) => void;
  viewButton?: (value: any) => void;
  editButton?: (value: any) => void;
  cancelButton?: (value: any) => void;
  setOpenDropdown?: (value: any) => void;
}

const DatatableBody = (props: Props) => {
  const { showData, columns, title, idColumnName, openDropdown, handleAction, viewButton, editButton, cancelButton, setOpenDropdown } = props;
  return (
    <tbody>
      {showData.length > 0 &&
        showData.map((item, rowIndex) => (
          <tr key={rowIndex}>
            <>
              {Array.isArray(columns) && columns.map((column, colIndex) => (              
                  <TableItem key={colIndex} rowIndex={rowIndex} title={title} colIndex={colIndex} column={column} item={item} handleAction={handleAction} idColumnName={idColumnName}
                    openDropdown={openDropdown} viewButton={viewButton} editButton={editButton} cancelButton={cancelButton} setOpenDropdown={setOpenDropdown} />
                
              ))}
            </>
          </tr>
        ))}
    </tbody>
  )
}

export default DatatableBody;

const TableItem = (props: any) => {
  const { title, rowIndex, colIndex, column, item, handleAction, idColumnName, openDropdown, viewButton, editButton, cancelButton, setOpenDropdown } = props;

  const table = [
    {
      name: "view-button",
      label: "View",
      icon: <HiEye className="mr-2 h-5 w-5" color="#a80a0a" />,
      button: () => viewButton && viewButton(item)
    },
    {
      name: "edit-button",
      label: "Edit",
      icon: <BiEdit className="mr-2 h-5 w-5" color="#a80a0a" />,
      button: () => editButton && editButton(item)
    },
    {
      name: "cancel-button",
      label: title === "Booking" ? "Cancel" : "Delete",
      icon: <HiTrash className="mr-2 h-5 w-5" color="#a80a0a" />,
      button: () => cancelButton && cancelButton(item)
    }
  ]

  return (
    <>
      {column.mode === "count" ? (
        <td className="px-4 py-3">
          {`${rowIndex + 1}.`}
        </td>
        ) : colIndex === 0 ? (
        <th
          scope="row"
          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {column.name.includes('.') ? item[column.name.split('.')[0]][column.name.split('.')[1]] : item[column.name]}
        </th>
      ) :  column.mode === "boolean" ? (
        <td className="px-4 py-3">
          <p
            className={`${Boolean(item[column.name]) == true
              ? "bg-success-600 text-success-500"
              : "bg-danger-600 text-danger-600"
              } inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium`}
          >
            {Boolean(item[column.name]) == true ? "True" : "False"}
          </p>
        </td>
      ) : column.mode === "badge" ? (
        <td className="px-4 py-3">
          <div className="flex items-center">
            <div
              className={`${item[column.name] === "Approved"
                ? "bg-green-600"
                : item[column.name] === "Pending"
                  ? "bg-red-600"
                  : "bg-yellow-600"
                } border rounded-full w-3 h-3 mr-2 `}
            ></div>
            {item[column.name]}
          </div>
        </td>
      ) 
        : column.name === "actions" ? (
          <td className="px-4 py-3 items-center justify-end">
            <button
              onClick={() => handleAction && handleAction(item[idColumnName])}
              className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
              type="button"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>

            <div
              id={"id-" + colIndex}
              className={`${openDropdown === item[idColumnName]
                ? "block"
                : "hidden"
                } absolute z-10 w-44 m-0 right-0 bg-white transform opacity-100 scale-100 origin-top-right rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}
            >
              <ul
                className="py-1 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby={"id-" + colIndex}
              >
                {table.map((t, i) => (
                  <li key={i}>
                    <button
                      className="text-gray-900 group flex w-full items-center px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      id={`${t.name}-${colIndex}`}
                      onClick={() => {t.button(); setOpenDropdown(null)}}
                    >
                      {t.icon}
                      {`${t.label} ${title}`}
                    </button>
                  </li>
                ))}
              </ul> 
            </div>
          </td>
        ) : (
            <td key={colIndex} className="px-4 py-3">
              {/* Handle formatting for specific columns */}
              {column.mode === 'date' ? moment(item[column.name]).format("DD MMM, YYYY. HH:mmA")
                : column.name.includes('.') // Check for nested properties
                  ? item[column.name.split('.')[0]][column.name.split('.')[1]]
                  : item[column.name]}
            </td>
          )}
    </>
  )
}