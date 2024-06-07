import Box from '@/Components/Box'
import Button from '@/Components/Button'
import Confirm from '@/Components/Confirm'
import SearchTable from '@/Components/Tables/SearchTable'
import Authenticated from '@/Layouts/Authenticated'
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Inertia } from '@inertiajs/inertia'
import { Link } from '@inertiajs/inertia-react'

export default function Index({ sites }) {
    const handleDelete = site => Inertia.delete(route('sites.destroy', { site }))

    const columns = [
        {
            title: 'Société',
            sortName: 'name',
            render: site => site.name,
        },
        {
            title: 'Nom & Prénom',
            sortName: 'last_name',
            render: site => site.full_name,
        },
        {
            title: 'Email',
            sortName: 'email',
            render: site => site.email,
        },
        {
            title: 'Téléphone',
            sortName: 'mobile',
            render: site => site.mobile,
        },
        {
            title: 'Siret',
            sortName: 'siret',
            render: site => site.siret,
        },
        {
            title: 'Limite d\'agence',
            sortName: 'agencie_limit',
            render: site => (site.agencie_limit === null ? 'Illimité' : site.agencie_limit),
        },
        {
            title: '',
            render: site => (
                <div className="space-x-2 text-right">
                    <Link href={route('sites.edit', { site })}>
                        <Button color="warning" type="button" icon={faEdit} />
                    </Link>
                    <Confirm title="Supprimer utilisateur" description="Confirmer la suppression du site ?" onYes={() => handleDelete(site)}>
                        <Button color="danger" type="button" icon={faTrash} />
                    </Confirm>
                </div>
            ),
        },
    ]

    return (
        <Authenticated title="Liste des sites" breadcrumb={{ 'Liste des sites': null }} fullWidth={true}>
            <Box noPadding>
                <SearchTable
                    columns={columns}
                    data={sites}
                    routeName="sites.index"
                    header={
                        <Link href={route(`sites.create`)}>
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
