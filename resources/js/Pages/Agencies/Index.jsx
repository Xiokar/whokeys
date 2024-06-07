import Box from '@/Components/Box'
import Button from '@/Components/Button'
import Confirm from '@/Components/Confirm'
import SearchTable from '@/Components/Tables/SearchTable'
import Authenticated from '@/Layouts/Authenticated'
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Inertia } from '@inertiajs/inertia'
import { Link, usePage } from '@inertiajs/inertia-react'

export default function Index({ agencies }) {
    const { auth } = usePage().props

    const handleDelete = agency => Inertia.delete(route('agencies.destroy', { agency }))

    const columns = [
        {
            title: 'Date de création',
            sortName: 'agencies.created_at',
            render: agency => (
                <div className="flex flex-col">
                    <div>{agency.created_at.split(' ')[0]}</div>
                    <div className="text-gray-500">{agency.created_at.split(' ')[1]}</div>
                </div>
            ),
        },
        {
            title: 'Nom',
            sortName: 'agencies.name',
            render: agency => agency.name,
        },
        {
            title: 'Adresse',
            sortName: 'address',
            wrap: true,
            render: agency => agency.address,
        },
        {
            title: 'Ville',
            sortName: 'city',
            render: agency => agency.city,
        },
        {
            title: 'Code postal',
            sortName: 'postcode',
            render: agency => agency.postcode,
        },
        {
            title: 'Email',
            sortName: 'email',
            render: agency => agency.email,
        },
        {
            title: 'Téléphone',
            sortName: 'mobile',
            render: agency => agency.mobile,
        },
        {
            title: 'Limite de trousseaux',
            sortName: 'key_limit',
            render: agency => (agency.key_limit === null ? 'Illimité' : agency.key_limit),
        },
        {
            hidden: auth.user.subtype != 'Super',
            title: 'Société',
            sortName: 'sites.name',
            render: admin => admin.site?.name,
        },
        {
            title: '',
            render: agency => (
                <div className="space-x-2 text-right">
                    <Link href={route('agencies.edit', { agency })}>
                        <Button color="warning" type="button" icon={faEdit} />
                    </Link>
                    <Confirm title="Supprimer utilisateur" description="Confirmer la suppression de l'agence ?" onYes={() => handleDelete(agency)}>
                        <Button color="danger" type="button" icon={faTrash} />
                    </Confirm>
                </div>
            ),
        },
    ]

    return (
        <Authenticated title="Liste des agences" breadcrumb={{ 'Liste des agences': null }} fullWidth={true}>
            <Box noPadding>
                <SearchTable
                    columns={columns}
                    data={agencies}
                    routeName="agencies.index"
                    header={
                        <Link href={route(`agencies.create`)}>
                            <Button color="success" type="button" icon={faPlus}>
                                Ajouter
                            </Button>
                        </Link>
                    }
                />
            </Box>
        </Authenticated>
    )
}
