export default function Label({ name, className = '', children }) {
    return (
        <label htmlFor={name} className={`block font-medium text-sm text-gray-700 ${className}`}>
            {children}
        </label>
    )
}
