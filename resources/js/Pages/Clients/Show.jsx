import Box from '@/Components/Box'
import Button from '@/Components/Button'
import Description from '@/Components/Description'
import Authenticated from '@/Layouts/Authenticated'
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { Link, usePage } from '@inertiajs/inertia-react'

export default function Show({ client }) {
    const { auth } = usePage().props

    return (
        <Authenticated title={client.full_name} breadcrumb={{ 'Liste des utilisateurs': route('clients.index'), [client.full_name]: null }}>
            <Box
                title={
                    <div className="flex justify-between items-center">
                        <div>Information personnelle de l'utilisateur</div>
                        <div>
                            <div className="space-x-2">
                                {auth.can.manageClients && (
                                    <Link href={route('clients.edit', { client })}>
                                        <Button color="warning" type="button" icon={faEdit}>
                                            Modifier
                                        </Button>
                                    </Link>
                                )}
                                <Button
                                    type="button"
                                    onClick={() => history.back()}
                                    color="lightgray"
                                    icon={faArrowAltCircleLeft}
                                    className="hidden md:inline-block"
                                >
                                    Retour
                                </Button>
                            </div>
                        </div>
                    </div>
                }
                noPadding
            >
                <Description>
                    <Description.Row title="Prénom & Nom" background>
                        {client.full_name}
                    </Description.Row>
                    <Description.Row title="Email">{client.email}</Description.Row>
                    <Description.Row title="Téléphone portable" background>
                        {client.mobile}
                    </Description.Row>
                    <Description.Row title="Sous-type">{client.subtype}</Description.Row>
                    <Description.Row title="Clés en possession" background>
                        {client.owned_keys.length > 0 ? (
                            <ul className="list-disc">
                                {client.owned_keys.map(ownedKey => (
                                    <li key={ownedKey.id}>
                                        <Link href={route('keys.show', { key: ownedKey.id })} className="text-blue-500">
                                            {ownedKey.name} ({ownedKey.property.full_address})
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            'Aucune'
                        )}
                    </Description.Row>
                </Description>
            </Box>
        </Authenticated>
    )
}
