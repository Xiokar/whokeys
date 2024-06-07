import { faChevronCircleDown, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Inertia } from '@inertiajs/inertia'
import { usePage } from '@inertiajs/inertia-react'
import { debounce, isEqual } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import Input from '@/Components/Form/Input'
import Pagination from '@/Components/Pagination'
import Select from '@/Components/Form/Select'

function Filter({ filter, ...props }) {
    const [name, type, config] = filter

    if (type == 'select') {
        return (
            <Select name={name} {...props}>
                {Object.entries(config.data).map(([name, value]) => (
                    <option key={name} value={value}>
                        {name}
                    </option>
                ))}
            </Select>
        )
    }
}

export default function SearchTable({ columns, data, routeName, header = null, filters = [], isAbsolute = false }) {
    const { sortBy, sortOrder, filterData: initialFilterData = {} } = usePage().props

    const [filterData, setFilterData] = useState(initialFilterData)

    const handleSearch = useCallback(
        debounce(async (filterData, sortBy, sortOrder) => {
            Inertia.get(route(routeName), { filterData, page: 1, sortBy, sortOrder }, { preserveState: true })
        }, 400),
        [],
    )

    const handlePageChange = page => Inertia.get(route(routeName, { filterData, page, sortBy, sortOrder }))

    useEffect(() => {
        if (!isEqual(filterData, initialFilterData)) handleSearch(filterData, sortBy, sortOrder)
    }, [filterData])

    const handleSort = (sortName, sortOrder) =>
        Inertia.get(route(routeName), { filterData, page: 1, sortBy: sortName, sortOrder }, { preserveState: true })

    columns = columns.filter(column => !column.hidden)
    const containerClasses = "flex justify-between items-center " + (isAbsolute ? 'py-3 px-5 absolute top-0 right-0' : 'p-5');

    return (
        <>
            <div className={containerClasses}>
                <div>
                    <div className="flex items-center gap-2">
                        <Input
                            value={filterData.search || ''}
                            onChange={value => setFilterData(filterData => ({ ...filterData, search: value }))}
                            placeholder="Recherche"
                        />
                        {filters.map(filter => {

                            if (typeof(filter[3]) !== 'undefined' && !filter[3](filter, filterData)) {
                                return null;
                            }

                            return <Filter
                                key={filter[0]}
                                filter={filter}
                                value={filterData?.[filter[0]] || ''}
                                onChange={value => setFilterData(filterData => ({ ...filterData, [filter[0]]: value }))}
                            />
                        })}
                    </div>
                </div>
                <div>{header}</div>
            </div>
            <div className="overflow-x-auto overflow-y-hidden">
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
                                            className="uppercase"
                                            onClick={() =>
                                                handleSort(
                                                    column.sortName,
                                                    column.sortName === sortBy ? (sortOrder == 'asc' ? 'desc' : 'asc') : 'asc',
                                                )
                                            }
                                        >
                                            <div className="flex items-center gap-1">
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
                        {data.data.map((data, index) => (
                            <tr key={data?.id || index} className={'active' in data && !data.active ? 'bg-gray-500' : ''}>
                                {columns.map(column => (
                                    <td
                                        key={column.title}
                                        className={`text-gray-800 px-6 py-4 ${!column.wrap ? 'whitespace-nowrap' : ''} ${column.tdClassName || ''}`}
                                    >
                                        {column.render(data)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination paginator={data} onPageChange={handlePageChange} />
        </>
    )
}
