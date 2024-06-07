import Button from '@/Components/Button'
import Input from '@/Components/Form/Input'
import Select from '@/Components/Form/Select'
import FormSection from '@/Components/Jetstream/FormSection'
import { useForm, usePage } from '@inertiajs/inertia-react'

export default function User({ agency = null }) {
    const { auth, sites } = usePage().props

    const { data, setData, post, put, processing, errors } = useForm({
        name: agency?.name || '',
        address: agency?.address || '',
        city: agency?.city || '',
        postcode: agency?.postcode || '',
        site: agency?.site_id || '',
    })

    const inputProps = {
        data,
        setData,
        errors,
    }

    const handleSubmit = () => {
        if (agency?.id) {
            put(route('agencies.update', { agency }))
        } else {
            post(route('agencies.store'))
        }
    }

    return (
        <FormSection
            title="Information de l'agence"
            description={agency ? `Modifier les informations de l'agence` : `Définissez les informations de l'agence`}
            submit={handleSubmit}
            form={
                <>
                    <div className="col-span-6 sm:col-span-4">
                        <Input title="Nom" name="name" {...inputProps} />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                        <Input title="Adresse" name="address" placeholder="Adresse de l'agence" {...inputProps} />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                        <Input title="Ville" name="city" placeholder="Ville de l'agence" {...inputProps} />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                        <Input title="Code postal" name="postcode" placeholder="Code postal de l'agence" {...inputProps} />
                    </div>
                    {auth.user.subtype == 'Super' && (
                        <div className="col-span-6 sm:col-span-4">
                            <Select title="Société" name="site" {...inputProps}>
                                <option value="">Société</option>
                                {sites.map(site => (
                                    <option key={site.id} value={site.id}>
                                        {site.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    )}
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
