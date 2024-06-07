import Box from '@/Components/Box'
import Button from '@/Components/Button'
import Description from '@/Components/Description'
import Authenticated from '@/Layouts/Authenticated'
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { Link, usePage } from '@inertiajs/inertia-react'

export default function Show({ admin }) {
    const { auth } = usePage().props

    return (
        <Authenticated title={admin.full_name} breadcrumb={{ 'Liste des administrateurs': route('admins.index'), [admin.full_name]: null }}>
            <Box
                title={
                    <div className="flex justify-between items-center">
                        <div>Information personnelle de l'administrateur</div>
                        <div>
                            <div className="space-x-2">
                                <Link href={route('admins.edit', { admin })}>
                                    <Button color="warning" type="button" icon={faEdit}>
                                        Modifier
                                    </Button>
                                </Link>
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
                        {admin.full_name}
                    </Description.Row>
                    <Description.Row title="Email">{admin.email}</Description.Row>
                    <Description.Row title="Téléphone portable" background>
                        {admin.mobile}
                    </Description.Row>
                    <Description.Row title="Sous-type">{admin.subtype}</Description.Row>
                    <Description.Row title="Clés en possession" background>
                        {admin.owned_keys.length > 0 ? (
                            <ul>
                                {admin.owned_keys.map(key => (
                                    <li key={key.id}>
                                        {key.name} ({key.property.full_address})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            'Aucune'
                        )}
                    </Description.Row>
                    {auth.user.subtype == 'Super' && <Description.Row title="Société">{admin.site.name}</Description.Row>}
                </Description>
            </Box>
        </Authenticated>
    )
}
