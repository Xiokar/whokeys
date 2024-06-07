import Box from '@/Components/Box'
import Button from '@/Components/Button'
import Confirm from '@/Components/Confirm'
import SearchTable from '@/Components/Tables/SearchTable'
import Authenticated from '@/Layouts/Authenticated'
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Inertia } from '@inertiajs/inertia'
import { Link, usePage } from '@inertiajs/inertia-react'

function isFilterTypeEqualToAgency(filter, filterData)
{
    return filter[0] === 'agency' && filterData?.filterType === 'agency';
}

export default function Index({ properties }) {
    const { auth, agencies } = usePage().props

    const handleDelete = property => Inertia.delete(route('properties.destroy', { property }))

    const columns = [
        {
            title: 'Date de création',
            sortName: 'properties.created_at',
            render: property => (
                <div className="flex flex-col">
                    <div>{property.created_at.split(' ')[0]}</div>
                    <div className="text-gray-500">{property.created_at.split(' ')[1]}</div>
                </div>
            ),
        },
        {
            title: 'Adresse',
            sortName: 'properties.address',
            wrap: true,
            render: property => (
                <Link href={route('properties.show', { property })} className="font-semibold hover:underline text-blue-500">
                    {property.address}
                </Link>
            ),
        },
        {
            title: 'Étage / Porte',
            sortName: 'address2',
            render: property => property.address2,
        },
        {
            title: 'Ville',
            sortName: 'properties.city',
            render: property => property.city,
        },
        {
            title: 'Code postal',
            sortName: 'properties.postcode',
            render: property => property.postcode,
        },
        {
            title: 'Agence',
            sortName: 'agencies.name',
            render: property => property.agency?.name || 'Aucune',
        },
        // {
        //     title: 'Propriétaire',
        //     sortName: 'users.last_name',
        //     render: property =>
        //         property.user && (
        //             <Link href={route('clients.show', { client: property.user })} className="font-semibold hover:underline text-blue-500">
        //                 {property.user.full_name}
        //             </Link>
        //         ),
        // },
        {
            hidden: auth.user.subtype != 'Super',
            title: 'Société',
            sortName: 'sites.name',
            render: property => property.agency?.site?.name || 'Aucune',
        },
        {
            hidden: !auth.can.manageProperties,
            title: '',
            render: property => (
                <div className="space-x-2 text-right">
                    <Link href={route('properties.edit', { property })}>
                        <Button color="warning" type="button" icon={faEdit} />
                    </Link>
                    <Confirm title="Supprimer bien" description="Confirmer la suppression du bien ?" onYes={() => handleDelete(property)}>
                        <Button color="danger" type="button" icon={faTrash} />
                    </Confirm>
                </div>
            ),
        },
    ]

    return (
        <Authenticated breadcrumb={{ 'Liste des biens': null }} title="Liste des biens" fullWidth={true}>
            <Box noPadding >
                <SearchTable
                    columns={columns}
                    data={properties}
                    routeName="properties.index"
                    filters={[
                        [
                            'filterType',
                            'select',
                            { data: { 'par Agence': 'agency', 'par numéro de Trousseau': 'keys' } },
                        ],
                        [
                            'agency',
                            'select',
                            { data: { Toutes: '', ...agencies.reduce((carry, agency) => ({ ...carry, [agency.name]: agency.name }), {}) } },
                            isFilterTypeEqualToAgency
                        ],
                    ]}
                    header={
                        auth.can.manageProperties && (
                            <Link href={route('properties.create')}>
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
