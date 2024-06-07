import Button from '@/Components/Button'
import Guest from '@/Layouts/Guest'
import Input from '@/Components/Form/Input'
import ValidationErrors from '@/Components/ValidationErrors'
import { Head, useForm } from '@inertiajs/inertia-react'

export default function ForgotPassword({ status, email }) {
    const { data, setData, post, processing, errors } = useForm({
        email,
    })

    const submit = e => {
        e.preventDefault()

        post(route('password.email'))
    }

    return (
        <Guest>
            <Head title="Mot de passe oublié" />
            <div className="mb-4 text-sm text-gray-500 leading-normal">
                Mot de passe oublié ? Pas de soucis. Veuillez nous indiquer votre adresse email et nous vous enverrons un lien de réinitialisation du
                mot de passe.
            </div>
            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
            <ValidationErrors errors={errors} />
            <form onSubmit={submit}>
                <Input type="email" name="email" value={data.email} onChange={value => setData(data => ({ ...data, email: value }))} />
                <div className="flex items-center justify-end mt-4">
                    <Button className="ml-4" processing={processing}>
                        Lien de réinitialisation du mot de passe
                    </Button>
                </div>
            </form>
        </Guest>
    )
}
