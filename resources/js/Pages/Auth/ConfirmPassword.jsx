import { useEffect } from 'react'
import Button from '@/Components/Button'
import Guest from '@/Layouts/Guest'
import Input from '@/Components/Form/Input'
import ValidationErrors from '@/Components/ValidationErrors'
import { Head, useForm } from '@inertiajs/inertia-react'

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    })

    useEffect(() => {
        return () => {
            reset('password')
        }
    }, [])

    const submit = e => {
        e.preventDefault()

        post(route('password.confirm'))
    }

    return (
        <Guest>
            <Head title="Confirmez votre mot de passe" />
            <div className="mb-4 text-sm text-gray-600">
                Cette partie du site est sécurisée. Veuillez confirmer votre mot de passe avant de continuer.
            </div>
            <ValidationErrors errors={errors} />
            <form onSubmit={submit}>
                <div className="mt-4">
                    <Input title="Mot de passe" type="password" name="password" data={data} setData={setData} />
                </div>
                <div className="flex items-center justify-end mt-4">
                    <Button className="ml-4" processing={processing}>
                        Confirmer
                    </Button>
                </div>
            </form>
        </Guest>
    )
}
