import { useEffect } from 'react'
import Button from '@/Components/Button'
import Guest from '@/Layouts/Guest'
import Input from '@/Components/Form/Input'
import ValidationErrors from '@/Components/ValidationErrors'
import { Head, Link, useForm } from '@inertiajs/inertia-react'
import Check from '@/Components/Form/Check'

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    })

    useEffect(() => {
        return () => {
            reset('password')
        }
    }, [])

    const submit = e => {
        e.preventDefault()

        post(route('login'))
    }

    return (
        <Guest>
            <Head title="Connexion" />
            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
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
                        autoComplete="current-password"
                        onChange={value => setData(data => ({ ...data, password: value }))}
                    />
                </div>
                <div className="mt-4">
                    <Check
                        title="Se souvenir de moi"
                        name="remember"
                        value={data.remember}
                        onChange={value => setData(data => ({ ...data, remember: value }))}
                    />
                </div>
                <div className="flex items-center justify-end mt-4">
                    {canResetPassword && (
                        <Link href={route('password.request')} className="underline text-sm text-gray-600 hover:text-gray-900">
                            Mot de passe oublié?
                        </Link>
                    )}
                    <Button className="ml-4" processing={processing} color="success">
                        Connexion
                    </Button>
                </div>
            </form>
        </Guest>
    )
}
