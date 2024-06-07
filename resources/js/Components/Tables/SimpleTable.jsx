import { faChevronCircleDown, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function SimpleTable({ columns, data, sortBy, sortOrder, onSort = () => {} }) {
    columns = columns.filter(column => !column.hidden)
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead>
                <tr>
                    {columns.map(column => (
                        <th
                            key={column.title}
                            scope="col"
                            className={`px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                                column.thClassName || ''
                            }`}
                        >
                            {column.sortName ? (
                                <button
                                    type="button"
                                    onClick={() =>
                                        onSort(column.sortName, column.sortName === sortBy ? (sortOrder == 'asc' ? 'desc' : 'asc') : 'asc')
                                    }
                                >
                                    <div className="flex items-center gap-1 uppercase">
                                        <div>{column.title}</div>
                                        <div>
                                            {sortBy == column.sortName && (
                                                <FontAwesomeIcon icon={sortOrder == 'asc' ? faChevronCircleUp : faChevronCircleDown} />
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ) : (
                                column.title
                            )}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {data.map((data, index) => (
                    <tr key={data?.id || index} className={'active' in data && !data.active ? 'bg-gray-500' : ''}>
                        {columns.map(column => (
                            <td key={column.title} className={`px-6 py-2 sm:py-4 whitespace-nowrap ${column.tdClassName || ''}`}>
                                {column.render(data)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
