import Error from '@/Components/Form/Error'

export default function Check({ title, className = '', name, value, inputValue = true, onChange, data, setData, errors }) {
    const handleChange = e => {
        if (setData) {
            setData(data => ({ ...data, [name]: e.target.checked }))
        } else {
            onChange(e.target.checked)
        }
    }

    let isChecked = value;
    if (typeof data !== 'undefined') {
        const sanitizedName = name.replace('[', '').replace(']', '');
        isChecked = Array.isArray(data[sanitizedName]) ? data[sanitizedName].includes(inputValue) : data[name];
    }

    return (
        <div>
            <label className="flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    name={name}
                    checked={isChecked}
                    value={inputValue}
                    className={`rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${className}`}
                    onChange={handleChange}
                />
                <span className="ml-2 text-sm text-gray-600">{title}</span>
            </label>
            {errors?.[name] && <Error>{errors?.[name]}</Error>}
        </div>
    )
}
