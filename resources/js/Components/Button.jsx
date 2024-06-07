import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Button({ type = 'submit', htmlTag = 'button', color = 'gray', className = '', processing, icon, children = '', ...props }) {
    let bgColor, hoverBgColor, focusBorderColor, focusShadow

    if (color == 'gray') {
        bgColor = 'bg-gray-500'
        hoverBgColor = 'hover:bg-gray-600'
        focusBorderColor = 'focus:border-gray-600'
        focusShadow = 'focus:shadow-outline-gray'
    } else if (color == 'lightgray') {
        bgColor = 'bg-gray-300'
        hoverBgColor = 'hover:bg-gray-400'
        focusBorderColor = 'focus:border-gray-400'
        focusShadow = 'focus:shadow-outline-gray'
    } else if (color == 'info') {
        bgColor = 'bg-blue-500'
        hoverBgColor = 'hover:bg-blue-600'
        focusBorderColor = 'focus:border-blue-600'
        focusShadow = 'focus:shadow-outline-blue'
    } else if (color == 'success') {
        bgColor = 'bg-green-500'
        hoverBgColor = 'hover:bg-green-600'
        focusBorderColor = 'focus:border-green-600'
        focusShadow = 'focus:shadow-outline-green'
    } else if (color == 'danger') {
        bgColor = 'bg-red-500'
        hoverBgColor = 'hover:bg-red-600'
        focusBorderColor = 'focus:border-red-600'
        focusShadow = 'focus:shadow-outline-red'
    } else if (color == 'warning') {
        bgColor = 'bg-orange-500'
        hoverBgColor = 'hover:bg-orange-600'
        focusBorderColor = 'focus:border-orange-600'
        focusShadow = 'focus:shadow-outline-orange'
    }

    if (htmlTag == 'a') {
        return (
            <a
                className={`inline-flex items-center ${
                    children ? 'px-4 py-2 text-sm' : 'p-3 text-base'
                } ${bgColor} rounded-md font-bold text-white tracking-wider ${hoverBgColor} focus:outline-none ${focusBorderColor} ${focusShadow} disabled:opacity-25 transition ease-in-out duration-150 ${
                    processing ? 'opacity-25' : ''
                } ${className}`}
                {...props}
            >
                {icon && <FontAwesomeIcon icon={icon} className={children ? 'mr-2' : ''} />}
                {children}
            </a>
        )
    } else if (htmlTag == 'button') {
        return (
            <button
                type={type}
                disabled={processing}
                className={`inline-flex items-center ${
                    children ? 'px-4 py-2 text-sm' : 'p-3 text-base'
                } ${bgColor} rounded-md font-bold text-white tracking-wider ${hoverBgColor} focus:outline-none ${focusBorderColor} ${focusShadow} disabled:opacity-25 transition ease-in-out duration-150 ${
                    processing ? 'opacity-25' : ''
                } ${className}`}
                {...props}
            >
                {icon && <FontAwesomeIcon icon={icon} className={children ? 'mr-2' : ''} />}
                {children}
            </button>
        )
    } else {
        return null
    }
}
