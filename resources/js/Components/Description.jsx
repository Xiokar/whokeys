export default function Description({ children }) {
    return <dl className="sm:divide-y sm:divide-gray-200">{children}</dl>
}

Description.Row = function Row({ title, children, className = '' }) {
    return (
        <div className={`py-2 px-4 gap-2 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ${className}`}>
            <dt className="text-sm font-medium text-gray-500 text-sm-center text-md-left">{title}</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 text-sm-center text-md-left">{children}</dd>
        </div>
    )
}
