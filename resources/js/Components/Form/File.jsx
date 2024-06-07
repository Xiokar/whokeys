import Label from '@/Components/Form/Label'
import Error from '@/Components/Form/Error'
import { useMemo, useRef } from 'react'
import Button from '@/Components/Button'

export default function File({ title, name, value, data, onChange, setData, errors, className = '', text = 'Parcourir', ...props }) {
    const ref = useRef()

    const currentValue = useMemo(() => {
        return typeof data !== 'undefined' ? data[name] : value
    }, [value, data?.[name]])

    const handleChange = e => {
        if (setData) {
            setData(data => ({ ...data, [name]: e.target.files[0] }))
        } else {
            onChange(e.target.files[0])
        }
    }

    const handleBrowse = () => {
        ref.current.click()
    }

    return (
        <div className={className}>
            {title && <Label forInput={name}>{title}</Label>}
            <input ref={ref} type="file" name={name} value="" className="hidden" onChange={handleChange} {...props} />
            <div className="flex items-center gap-2">
                <div>
                    <Button type="button" onClick={handleBrowse}>
                        {text}
                    </Button>
                </div>
                <div>{currentValue?.name || 'Aucun fichier sélectionner.'}</div>
            </div>
            {errors?.[name] && <Error>{errors?.[name]}</Error>}
        </div>
    )
}
