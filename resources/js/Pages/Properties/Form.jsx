import Box from '@/Components/Box'
import Button from '@/Components/Button'
import Input from '@/Components/Form/Input'
import Select from '@/Components/Form/Select'
import Textarea from '@/Components/Form/Textarea'
import UserSelect from '@/Components/Form/UserSelect'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useForm, usePage } from '@inertiajs/inertia-react'

export default function Form({ property = null }) {
    const { auth, sites, agencies } = usePage().props

    const { data, setData, put, post, processing, errors } = useForm({
        address: property?.address || '',
        address2: property?.address2 || '',
        city: property?.city || '',
        postcode: property?.postcode || '',
        description: property?.description || '',
        last_name: property?.last_name || '',
        first_name: property?.first_name || '',
        mobile: property?.mobile || '',
        client: property?.user?.id || '',
        site: property?.site_id || '',
        agency: property?.agencies?.[0]?.id || '',
    })

    const inputProps = {
        data,
        setData,
        errors,
    }

    const handleSubmit = e => {
        e.preventDefault()
        if (property?.id) {
            put(route('properties.update', { property }))
        } else {
            post(route('properties.store'))
        }
    }

    return (
        <>
        <div className="space-y-8">
            <Box noPadding title="Propriétaire" description="Sélectionnez le propriétaire du bien.">
                <UserSelect name="client" subtype="Propriétaire" {...inputProps} />
            </Box>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="space-y-8">
                <Box
                    title="Localisation du bien"
                    description={
                        property
                            ? 'Modifier les informations concernant la localisation du bien.'
                            : 'Définissez les informations concernant la localisation du bien.'
                    }
                >
                    <div className="space-y-6">
                        <Input title="Adresse" name="address" placeholder="Adresse du bien" {...inputProps} />
                        <Input title="Étage / Porte" name="address2" placeholder="Étage / Porte (facultatif)" {...inputProps} />
                        <Input title="Ville" name="city" placeholder="Ville du bien" {...inputProps} />
                        <Input title="Code postal" name="postcode" placeholder="Code postal du bien" {...inputProps} />
                        <Textarea title="Description" name="description" placeholder="Description du bien" {...inputProps} />
                        {auth.user.subtype == 'Super' && (
                            <div className="col-span-6 sm:col-span-4">
                                <Select title="Société" name="site" {...inputProps} >
                                    <option value="">Société</option>
                                    {sites.map(site => (
                                        <option key={site.id} value={site.id}>
                                            {site.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        )}
                        <div className="col-span-6 sm:col-span-4">
                            
                            <Select title="Agence" name="agency" {...inputProps} required>
                                <option value="" disabled selected>Aucune</option>
                                {agencies.map((agency) => (
                                    <option key={agency.id} value={agency.id}>
                                        {agency.name}
                                    </option>
                                ))}
                                
                            </Select>
                            
                        </div>
                    </div>
                </Box>

                <div className="text-center">
                    <Button processing={processing} icon={faPlus} color="success" className="m-2">
                        Enregistrer
                    </Button>
                </div>
            </div>
        </form>
        </>
    )
}
