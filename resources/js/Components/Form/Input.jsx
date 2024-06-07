import Label from '@/Components/Form/Label'
import Error from '@/Components/Form/Error'

export default function Input({ title, type = 'text', className = '', value, onChange, name, data, setData, errors, ...props }) {
    const handleChange = e => {
        if (setData) {
            setData(data => ({ ...data, [name]: e.target.value }))
        } else {
            onChange(e.target.value)
        }
    }

    return (
        <div>
            {title && <Label forInput={name}>{title}</Label>}
            <input
                type={type}
                name={name}
                value={typeof data !== 'undefined' ? data[name] : value}
                className={`border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm ${
                    title ? 'mt-1' : ''
                } block w-full ${className}`}
                onChange={handleChange}
                {...props}
            />
            {errors?.[name] && <Error>{errors?.[name]}</Error>}
        </div>
    )
}
