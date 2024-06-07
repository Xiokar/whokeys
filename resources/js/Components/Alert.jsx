import { faCheckCircle, faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Alert({ type, className = '', children }) {
    let bgColor = 'bg-green-200'
    let icon = <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 mr-3" />
    let color = 'text-green-800'

    if (type == 'info') {
        bgColor = 'bg-blue-200'
        icon = <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600 mr-3" />
        color = 'text-blue-800'
    } else if (type == 'warning') {
        bgColor = 'bg-orange-200'
        icon = <FontAwesomeIcon icon={faExclamationCircle} className="text-yellow-600 mr-3" />
        color = 'text-yellow-800'
    } else if (type == 'danger') {
        bgColor = 'bg-red-200'
        icon = <FontAwesomeIcon icon={faExclamationCircle} className="text-red-600 mr-3" />
        color = 'text-red-800'
    }

    return (
        <div className={`${bgColor} px-6 py-4 rounded-md text-lg flex items-center mx-auto w-3/4 xl:w-2/4 ${className}`}>
            {icon}
            <span className={color}>{children}</span>
        </div>
    )
}
