import axios from 'axios'
import { useState } from 'react'

export default function useQuery({ method = 'get', data: InitialValues, url, onSuccess = () => {} }) {
    const [processing, setProcessing] = useState(false)
    const [errors, setErrors] = useState([])
    const [data, setData] = useState(InitialValues)

    const reset = () => setData(InitialValues)

    const query = async (path = '') => {
        setProcessing(true)

        setErrors([])

        const params = {}
        if (method == 'get') {
            params.params = data
        } else {
            params.data = data
        }

        try {
            const { data } = await axios({ method, url: `${url}${path}`, ...params })
            onSuccess(data)
            return data
        } catch (error) {
            if (error.response.status == 422) {
                setErrors(error.response.data.errors)
            } else {
                throw error
            }
        } finally {
            setProcessing(false)
        }
    }

    return { data, setData, processing, errors, query, reset }
}
