import Box from '@/Components/Box'
import Button from '@/Components/Button'
import Input from '@/Components/Form/Input'
import Select from '@/Components/Form/Select'
import Textarea from '@/Components/Form/Textarea'
import UserSelect from '@/Components/Form/UserSelect'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Link, useForm, usePage } from '@inertiajs/inertia-react'
import { renderToString } from 'react-dom/server'

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
        agency: property?.agency_id || ''
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

    const changeSite = e => {
        e.preventDefault();
        const siteField = document.getElementById('readonly-site');
        siteField.value = e.target.options[e.target.selectedIndex].getAttribute('site');
    }

    const getOwner = (user, isInitialOwner) => {
        let owner = "Aucun, à définir";
        if (user) {
            owner = user.full_name;
            if (auth.can.manageClients) {
                owner = <Link href={route('clients.show', { client: user })} className="text-indigo-600 hover:text-indigo-900">
                            {user.full_name}
                        </Link>;
                
                if (!isInitialOwner) {
                    owner = renderToString(owner);
                }
            }
        }
        return owner;
    };

    const autoSwitchOwner = (user) => {
        const definedOwner = document.getElementById('defined-owner');
        definedOwner.innerHTML = getOwner(user, false);
    };

    const owner = <>
        Propriétaire : <span id="defined-owner">{getOwner(property?.user, true)}</span>
    </>;

    return (
        <>
        <div className="space-y-8">
            <Box noPadding title={owner} description="Sélectionnez le propriétaire du bien.">
                <UserSelect name="client" subtype="Propriétaire" {...inputProps} autoSwitchOwner={autoSwitchOwner} />
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
                        <div className="col-span-6 sm:col-span-4">
                            
                            {
                                agencies.length > 1 ?
                                    <Select title="Agence" name="agency" {...inputProps} onChangeCallback={changeSite} required>
                                        <option value="" disabled selected>Aucune</option>
                                        {agencies.map((agency) => (
                                            <option key={agency.id} value={agency.id} site={agency.site.name}>
                                                {agency.name} (société : {agency.site.name})
                                            </option>
                                        ))}
                                    </Select>
                                    :
                                    <Input type="hidden" name="agency" value="{agency.id}" {...inputProps} />
                            }
                            
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
