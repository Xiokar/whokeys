import Button from '@/Components/Button'
import Input from '@/Components/Form/Input'
import FormSection from '@/Components/Jetstream/FormSection'
import { useForm } from '@inertiajs/inertia-react'

export default function User({ site = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: site?.name || '',
        last_name: site?.last_name || '',
        first_name: site?.first_name || '',
        email: site?.email || '',
        mobile: site?.mobile || '',
        siret: site?.siret || '',
        key_limit: site?.key_limit || '',
        agencie_limit: site?.agencie_limit || '',
    })

    const inputProps = {
        data,
        setData,
        errors,
    }

    const handleSubmit = () => {
        if (site?.id) {
            put(route('sites.update', { site }))
        } else {
            post(route('sites.store'))
        }
    }

    return (
        <FormSection
            title="Information du site"
            description={site ? `Modifier les informations du site` : `Définissez les informations du site`}
            submit={handleSubmit}
            form={
                <>
                    <div className="col-span-6 sm:col-span-4">
                        <Input title="Société" name="name" {...inputProps} />
                    </div>
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
                    <div className="col-span-6 sm:col-span-4">
                        <Input title="SIRET" type="text" name="siret" autoComplete="siret" {...inputProps} />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                        <Input
                            title="Limite de trousseaux (laisser vide pour illimité)"
                            type="text"
                            name="key_limit"
                            autoComplete="key_limit"
                            {...inputProps}
                        />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                        <Input
                            title="Limite d'agence (laisser vide pour illimité)"
                            type="text"
                            name="agencie_limit"
                            autoComplete="agencie_limit"
                            {...inputProps}
                        />
                    </div>
                </>
            }
            actions={
                <Button className="ml-4" processing={processing}>
                    Enregistrer
                </Button>
            }
        />
    )
}
