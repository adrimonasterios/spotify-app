type Header = {
  field: string;
  label: string;
};

type Props = {
  items: { [key: string]: any }[];
  headers: Header[];
};

const SimpleTable = ({ items, headers }: Props) => {
  return (
    <div className="mt-8 flow-root w-80 whitespace-nowrap">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((header, index: number) => (
                    <th
                      key={`header-${index}`}
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {items.map((item, idx) => (
                  <tr key={`item-${idx}`} className="max-h-16">
                    {headers.map((header, index) => (
                      <td
                        key={`item-header-${index}`}
                        className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 max-h-full max-w-[164px] text-ellipsis overflow-hidden"
                      >
                        {item[header.field as keyof { [key: string]: any }]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTable;
