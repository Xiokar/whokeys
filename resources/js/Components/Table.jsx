import { faChevronCircleDown, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Table({ thead, children }) {
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead>{thead}</thead>
            <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
        </table>
    )
}

Table.Td = function Td({ children, className = '' }) {
    return <td className={`px-4 sm:px-6 sm:py-4 whitespace-nowrap ${className}`}>{children}</td>
}

Table.Th = function Th({ sortName, sortBy, sortOrder, onSort, className = '', children }) {
    return (
        <th scope="col" className={`px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
            {sortName ? (
                <button type="button" onClick={() => onSort(sortName, sortName === sortBy ? (sortOrder == 'asc' ? 'desc' : 'asc') : 'asc')}>
                    <div className="flex items-center gap-1">
                        <div>{children}</div>
                        <div>{sortBy == sortName && <FontAwesomeIcon icon={sortOrder == 'asc' ? faChevronCircleUp : faChevronCircleDown} />}</div>
                    </div>
                </button>
            ) : (
                children
            )}
        </th>
    )
}
