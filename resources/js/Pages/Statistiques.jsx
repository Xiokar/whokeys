import Box from '@/Components/Box'
import SimpleTable from '@/Components/Tables/SimpleTable'
import Authenticated from '@/Layouts/Authenticated'
import { Link, usePage } from '@inertiajs/inertia-react'

function Sites() {
    const { sites } = usePage().props

    const columns = [
        {
            title: 'Société',
            render: site => (
                <Link href={route('sites.show', { site })} className="font-semibold hover:underline text-blue-500">
                    {site.name}
                </Link>
            ),
        },
        {
            title: 'Nombre de trousseaux',
            render: site => (site.nb_keys === null ? 'Illimité' : site.nb_keys),
        },
        {
            title: 'Limite de trousseaux',
            render: site => (site.key_limit === null ? 'Illimité' : site.key_limit),
        },
    ]

    return (
        <Box title="Statistiques des sociétés" noPadding>
            <SimpleTable columns={columns} data={sites} header="Trousseaux sorties" />
        </Box>
    )
}

export default function Statistiques({ keys, sites }) {
    return (
        <Authenticated breadcrumb={{ 'Tableau de bord': null }} title="Tableau de bord">
            <div className="space-y-8">
                <Box title="Statistiques générales" noPadding>
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-2 px-6 gap-2 grid grid-cols-2 sm:py-5 sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">Nombre de sociétés</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{sites.length}</dd>
                        </div>
                        <div className="py-2 px-6 gap-2 grid grid-cols-2 sm:py-5 sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">Nombre de trousseaux</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{keys.length}</dd>
                        </div>
                    </dl>
                </Box>
                <Sites />
            </div>
        </Authenticated>
    )
}
