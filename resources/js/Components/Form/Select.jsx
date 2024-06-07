import Label from '@/Components/Form/Label'
import Error from '@/Components/Form/Error'

export default function Select({ title, className = '', value, onChange, onChangeCallback, name, data, setData, errors, children, ...props }) {
    const handleChange = e => {
        if (setData) {
            setData(data => ({ ...data, [name]: e.target.value }))
        } else {
            onChange(e.target.value)
        }
        if (typeof(onChangeCallback) !== 'undefined') {
            onChangeCallback(e)
        }
    }

    return (
        <div>
            {title && <Label forInput={name}>{title}</Label>}
            <select
                name={name}
                value={typeof data !== 'undefined' ? data[name] : value}
                className={`border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm ${
                    title ? 'mt-1' : ''
                } block w-full ${className}`}
                onChange={handleChange}
                {...props}
            >
                {children}
            </select>
            {errors?.[name] && <Error>{errors?.[name]}</Error>}
        </div>
    )
}
