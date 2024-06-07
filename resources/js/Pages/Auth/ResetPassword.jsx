import { useEffect } from 'react'
import Button from '@/Components/Button'
import Guest from '@/Layouts/Guest'
import Input from '@/Components/Form/Input'
import ValidationErrors from '@/Components/ValidationErrors'
import { Head, useForm } from '@inertiajs/inertia-react'

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    })

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation')
        }
    }, [])

    const submit = e => {
        e.preventDefault()

        post(route('password.update'))
    }

    return (
        <Guest>
            <Head title="Réinitialisation du mot de passe" />
            <ValidationErrors errors={errors} />
            <form onSubmit={submit}>
                <div>
                    <Input
                        title="Adresse email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        onChange={value => setData(data => ({ ...data, email: value }))}
                    />
                </div>
                <div className="mt-4">
                    <Input
                        title="Mot de passe"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="new-password"
                        onChange={value => setData(data => ({ ...data, password: value }))}
                    />
                </div>

                <div className="mt-4">
                    <Input
                        title="Confirmez votre mot de passe"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        autoComplete="new-password"
                        onChange={value => setData(data => ({ ...data, password_confirmation: value }))}
                    />
                </div>
                <div className="flex items-center justify-end mt-4">
                    <Button className="ml-4" processing={processing}>
                        Réinitialisation du mot de passe
                    </Button>
                </div>
            </form>
        </Guest>
    )
}
