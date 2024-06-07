import { useEffect } from 'react'
import Button from '@/Components/Button'
import Guest from '@/Layouts/Guest'
import Input from '@/Components/Form/Input'
import ValidationErrors from '@/Components/ValidationErrors'
import { Head, useForm } from '@inertiajs/inertia-react'

export default function ResetPassword({ user }) {
    const { data, setData, post, processing, errors, reset } = useForm({
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
        if (!data.termsAccepted) {
            // Affichez un message d'erreur ou empêchez l'envoi si les conditions générales ne sont pas acceptées
            return;
        }
        post(route('set-password.store', { user, token: user.token }))
    }

    return (
        <Guest>
            <Head title="Définir mot de passe" />
            <ValidationErrors errors={errors} />
            <form onSubmit={submit}>
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
                <div className="col-span-6 sm:col-span-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="termsAccepted"
                                checked={data.termsAccepted}
                                onChange={() => setData('termsAccepted', !data.termsAccepted)}
                                className="mr-2"
                            />
                            <span>J'accepte les <a href="https://www.whokeys.fr/mentions-l%C3%A9gales-cgu">conditions générales d'utilisation</a></span>
                        </label>
                    </div>
                <div className="flex items-center justify-end mt-4">
                    <Button className="ml-4" processing={processing} disabled={!data.termsAccepted}>
                        Définir mot de passe
                    </Button>
                </div>
            </form>
        </Guest>
    )
}
