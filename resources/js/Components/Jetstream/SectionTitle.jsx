export default function SectionTitle({ title, children }) {
    return (
        <div className="md:col-span-1">
            <div className="px-4 sm:px-0 text-center">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                <p className="mt-1 text-sm text-gray-600">{children}</p>
            </div>
        </div>
    )
}
