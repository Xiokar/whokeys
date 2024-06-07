import Badge from '@/Components/Badge'
import Box from '@/Components/Box'
import Button from '@/Components/Button'
import Confirm from '@/Components/Confirm'
import SearchTable from '@/Components/Tables/SearchTable'
import Authenticated from '@/Layouts/Authenticated'
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Inertia } from '@inertiajs/inertia'
import { Link, usePage } from '@inertiajs/inertia-react'

export default function Index({ admins }) {
    const { auth } = usePage().props

    const handleDelete = admin => Inertia.delete(route('admins.destroy', { admin }))

    const columns = [
        {
            title: 'Date de création',
            sortName: 'users.created_at',
            render: user => (
                <div className="flex flex-col">
                    <div>{user.created_at.split(' ')[0]}</div>
                    <div className="text-gray-500">{user.created_at.split(' ')[1]}</div>
                </div>
            ),
        },
        {
            title: 'Nom & Prénom',
            sortName: 'users.last_name',
            render: admin => (
                <Link href={route('admins.show', { admin })} className="font-semibold hover:underline text-blue-500">
                    {admin.full_name}
                </Link>
            ),
        },
        {
            title: 'Email',
            sortName: 'users.email',
            render: admin => admin.email,
        },
        {
            title: 'Portable',
            sortName: 'users.mobile',
            render: admin => admin.mobile,
        },
        // {
        //     title: 'Sous-type',
        //     sortName: 'subtype',
        //     render: admin => admin.subtype,
        // },
        {
            hidden: auth.user.subtype != 'Super',
            title: 'Agences',
            sortName: 'agencies.name',
            render: client => client.agencies ? client.agencies.map(agency => (
                <Badge key="{agency.id}">
                    {agency.name}
                </Badge>
            )) : 'Aucune',
        },
        {
            title: '',
            render: admin => (
                <div className="space-x-2 text-right">
                    <Link href={route('admins.edit', { admin })}>
                        <Button color="warning" type="button" icon={faEdit} />
                    </Link>
                    <Confirm
                        title="Supprimer administrateur"
                        description="Confirmer la suppression de l'administrateur ?"
                        onYes={() => handleDelete(admin)}
                    >
                        <Button color="danger" type="button" icon={faTrash} />
                    </Confirm>
                </div>
            ),
        },
    ]

    return (
        <Authenticated title="Liste des administrateurs" breadcrumb={{ 'Liste des administrateurs': null }} fullWidth={true}>
            <Box noPadding>
                <SearchTable
                    columns={columns}
                    data={admins}
                    routeName="admins.index"
                    header={
                        auth.can.manageClients && (
                            <Link href={route('admins.create')}>
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
