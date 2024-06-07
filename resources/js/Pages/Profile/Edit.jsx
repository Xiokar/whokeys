import Button from '@/Components/Button'
import Input from '@/Components/Form/Input'
import FormSection from '@/Components/Jetstream/FormSection'
import Authenticated from '@/Layouts/Authenticated'
import { useForm, usePage } from '@inertiajs/inertia-react'
import { useState } from 'react'

function UpdateProfileInformation() {
    const [status, setStatus] = useState('')
    const { auth } = usePage().props
    const { data, setData, put, processing, errors } = useForm({
        email: auth.user.email,
        first_name: auth.user.first_name,
        last_name: auth.user.last_name,
        mobile: auth.user.mobile,
    })

    const inputProps = {
        data,
        setData,
        errors,
    }

    const handleSubmit = () => {
        put(route('profile.update-information'), {
            onSuccess: () => setStatus('Sauvegardé'),
            onBefore: () => setStatus(''),
            preserveScroll: true,
        })
    }

    return (
        <FormSection
            title="Information du profil"
            description="Modifier le profil associé à votre compte ainsi que votre adresse email."
            submit={handleSubmit}
            form={
                <>
                    <div className="col-span-6 sm:col-span-4">
                        <Input title="Prénom" name="first_name" autoComplete="given-name" {...inputProps} />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                        <Input title="Nom" name="last_name" autoComplete="family-name" {...inputProps} />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                        <Input title="Adresse email" type="email" name="email" autoComplete="username" {...inputProps} />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                        <Input title="Téléphone portable" type="tel" name="mobile" autoComplete="tel-national" {...inputProps} />
                    </div>
                </>
            }
            actions={
                <div className="justify-center">
                    <Button className="min-w-48 sm:min-w-min justify-center" processing={processing}>
                        Modifier
                    </Button>
                    {status && <div className="mt-2 font-medium text-sm text-green-600">{status}</div>}
                </div>
            }
        />
    )
}

function UpdatePassword() {
    const [status, setStatus] = useState('')
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    })

    const inputProps = {
        data,
        setData,
        errors,
    }

    const handleSubmit = () => {
        put(route('profile.update-password'), {
            onSuccess: () => {
                setStatus('Sauvegardé')
                reset()
            },
            onBefore: () => setStatus(''),
            preserveScroll: true,
        })
    }

    return (
        <FormSection
            title="Mettre à jour le mot de passe"
            description="Assurez-vous d'utiliser un mot de passe long et aléatoire pour sécuriser votre compte"
            submit={handleSubmit}
            form={
                <>
                    <div className="col-span-6 sm:col-span-4">
                        <Input title="Mot de passe actuel" type="password" name="current_password" autoComplete="current-password" {...inputProps} />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                        <Input title="Nouveau mot de passe" type="password" name="password" autoComplete="new-password" {...inputProps} />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                        <Input
                            title="Confirmez votre mot de passe"
                            type="password"
                            name="password_confirmation"
                            autoComplete="new-password"
                            {...inputProps}
                        />
                    </div>
                </>
            }
            actions={
                <div className="flex justify-center">
                    {status && <div className="font-medium text-sm text-green-600">{status}</div>}
                    <Button className="min-w-48 sm:min-w-min justify-center" processing={processing}>
                        Modifier
                    </Button>
                </div>
            }
        />
    )
}

export default function Edit() {
    return (
        <Authenticated title="Profil" breadcrumb={{ 'Mon profil': null }}>
            <div className="space-y-8">
                <UpdateProfileInformation />
                <UpdatePassword />
            </div>
            <div className="hidden sm:block">
                <div className="py-8">
                    <div className="border-t border-gray-200" />
                </div>
            </div>
        </Authenticated>
    )
}
