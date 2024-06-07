import { range } from 'lodash'

function prepare(paginator) {
    return {
        ...paginator,
        hasMorePages() {
            return this.current_page < this.last_page
        },
        hasPages() {
            return this.current_page != 1 || this.hasMorePages()
        },
        onFirstPage() {
            return this.current_page <= 1
        },
    }
}

function PageButton({ page, paginator, onPageChange }) {
    return page === paginator.current_page ? (
        <span aria-current="page">
            <span className="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-white bg-blue-500 border border-gray-300 cursor-default leading-5">
                {page}
            </span>
        </span>
    ) : (
        <button
            type="button"
            className="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 hover:text-gray-500 focus:z-10 focus:outline-none focus:ring ring-gray-300 focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
            onClick={() => onPageChange(page)}
        >
            {page}
        </button>
    )
}

export default function Pagination({ paginator, onPageChange }) {
    paginator = prepare(paginator)

    if (!paginator.hasPages()) return null

    return (
        <nav role="navigation" aria-label="Pagination Navigation" className="flex justify-end gap-1 p-5">
            {paginator.onFirstPage() ? (
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 cursor-default leading-5 rounded-md">
                    Précédent
                </span>
            ) : (
                <button
                    type="button"
                    rel="prev"
                    onClick={() => onPageChange(paginator.current_page - 1)}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 rounded-md hover:text-gray-500 focus:outline-none focus:ring ring-gray-300 focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
                >
                    Précédent
                </button>
            )}
            {paginator.last_page > 15 ? (
                <>
                    {paginator.current_page - 7 > 1 && (
                        <span className="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 cursor-default leading-5">
                            ...
                        </span>
                    )}
                    {range(
                        paginator.current_page - 7 < 1 ? 1 : paginator.current_page - 7,
                        (paginator.current_page + 7 > paginator.last_page ? paginator.last_page : paginator.current_page + 7) + 1,
                    ).map(page => (
                        <PageButton key={page} page={page} paginator={paginator} onPageChange={onPageChange} />
                    ))}
                    {paginator.current_page + 7 < paginator.last_page && (
                        <span className="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 cursor-default leading-5">
                            ...
                        </span>
                    )}
                </>
            ) : (
                range(1, paginator.last_page + 1).map(page => <PageButton key={page} page={page} paginator={paginator} onPageChange={onPageChange} />)
            )}
            {paginator.hasMorePages() ? (
                <button
                    type="button"
                    rel="next"
                    onClick={() => onPageChange(paginator.current_page + 1)}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 rounded-md hover:text-gray-500 focus:outline-none focus:ring ring-gray-300 focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
                >
                    Suivant
                </button>
            ) : (
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 cursor-default leading-5 rounded-md">
                    Suivant
                </span>
            )}
        </nav>
    )
}
