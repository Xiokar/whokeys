import Badge from '@/Components/Badge'
import Box from '@/Components/Box'
import Button from '@/Components/Button'
import Confirm from '@/Components/Confirm'
import SearchTable from '@/Components/Tables/SearchTable'
import Authenticated from '@/Layouts/Authenticated'
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Inertia } from '@inertiajs/inertia'
import { Link, usePage } from '@inertiajs/inertia-react'

export default function Index({ clients }) {
    const { auth } = usePage().props

    const handleDelete = client => Inertia.delete(route('clients.destroy', { client }))

    const columns = [
        {
            title: 'Date de création',
            sortName: 'users.created_at',
            render: client => (
                <div className="flex flex-col">
                    <div>{client.created_at.split(' ')[0]}</div>
                    <div className="text-gray-500">{client.created_at.split(' ')[1]}</div>
                </div>
            ),
        },
        {
            title: 'Nom & Prénom',
            sortName: 'users.last_name',
            render: client => (
                <Link href={route('clients.show', { client })} className="font-semibold hover:underline text-blue-500">
                    {client.full_name}
                </Link>
            ),
        },
        {
            title: 'Email',
            sortName: 'users.email',
            render: client => client.email,
        },
        {
            title: 'Portable',
            sortName: 'users.mobile',
            render: client => client.mobile,
        },
        {
            title: 'Sous-type',
            sortName: 'subtype',
            render: client => client.subtype,
        },
        {
            hidden: auth.user.type != 'Administrateur',
            title: 'Agences',
            sortName: 'agencies.name',
            render: client => client.agencies ? client.agencies.map(agency => (
                <Badge key="{agency.id}">
                    {agency.name}
                </Badge>
            )) : 'Aucune',
        },
        {
            hidden: !auth.can.manageClients,
            title: '',
            render: client => (
                <div className="space-x-2 text-right">
                    <Link href={route('clients.edit', { client })}>
                        <Button color="warning" type="button" icon={faEdit} />
                    </Link>
                    <Confirm
                        title="Supprimer utilisateur"
                        description="Confirmer la suppression de l'utilisateur ?"
                        onYes={() => handleDelete(client)}
                    >
                        <Button color="danger" type="button" icon={faTrash} />
                    </Confirm>
                </div>
            ),
        },
    ]

    return (
        <Authenticated title="Liste des utilisateurs" breadcrumb={{ 'Liste des utilisateurs': null }} fullWidth={true}>
            <Box noPadding>
                <SearchTable
                    columns={columns}
                    data={clients}
                    routeName="clients.index"
                    header={
                        auth.can.manageClients && (
                            <Link href={route('clients.create')}>
                                <Button color="success" type="button" icon={faPlus}>
                                    Ajouter
                                </Button>
                            </Link>
                        )
                    }
                />
            </Box>
        </Authenticated>
    )
}
