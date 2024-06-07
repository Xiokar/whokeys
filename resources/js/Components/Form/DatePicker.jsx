import ReactDatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import fr from 'date-fns/locale/fr'
import { format, parse } from 'date-fns'
import { useMemo } from 'react'
import Input from '@/Components/Form/Input'
import Label from '@/Components/Form/Label'
import Error from '@/Components/Form/Error'

registerLocale('fr', fr)

export default function DatePicker({ name, title, placeholder, loading, data, setData, errors, withTime = false }) {
    const dateFormat = withTime ? "dd/MM/yyyy HH'h'mm" : 'dd/MM/yyyy'

    const selected = useMemo(() => {
        if (!data?.[name]) return ''
        return parse(data[name], dateFormat, new Date())
    }, [data?.[name]])

    const handleChange = date => {
        setData(data => ({ ...data, [name]: format(date, dateFormat) }))
    }

    return (
        <div>
            {title && <Label forInput={name}>{title}</Label>}
            <ReactDatePicker
                showTimeSelect={withTime}
                selected={selected}
                onChange={handleChange}
                locale="fr"
                dateFormat={dateFormat}
                disabled={loading}
                customInput={<Input name={name} />}
                placeholderText={placeholder}
            />
            {errors?.[name] && <Error>{errors?.[name]}</Error>}
        </div>
    )
}
