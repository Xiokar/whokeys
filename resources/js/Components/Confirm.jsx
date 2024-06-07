import { useState } from 'react'
import Modal from '@/Components/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamation, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

export default function Confirm({ title, description, children, onYes = () => {}, onNo = () => {}, extraOptions }) {
    const [visible, setVisible] = useState(false)

    const handleYes = () => {
        setVisible(false)
        onYes()
    }

    const handleNo = () => {
        setVisible(false)
        onNo()
    }

    const handleClick = e => {
        if (e?.preventDefault) e.preventDefault()
        setVisible(true)
    }

    return (
        <>
            <children.type {...children.props} onClick={handleClick} />
            <Modal open={visible} setOpen={setVisible}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-500 sm:mx-0 sm:h-10 sm:w-10">
                            <FontAwesomeIcon icon={faExclamation} className="text-white text-xl" />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">{description}</p>
                            </div>
                            {typeof(extraOptions) !== 'undefined' ? extraOptions() : ''}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={handleYes}
                    >
                        Oui
                    </button>
                    <button
                        type="button"
                        onClick={handleNo}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                        Non
                    </button>
                </div>
            </Modal>
        </>
    )
}
