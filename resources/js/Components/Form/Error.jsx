export default function Error({ className = '', children }) {
    return <p className={`text-sm text-red-600 ${className}`}>{children}</p>
}
