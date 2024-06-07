import Box from '@/Components/Box'
import SimpleTable from '@/Components/Tables/SimpleTable'
import Authenticated from '@/Layouts/Authenticated'
import { Link, usePage } from '@inertiajs/inertia-react'

function Agencies() {
    const { agencies } = usePage().props

    const columns = [
        {
            title: 'Agence',
            render: agency => (
                <Link href={route('agencies.show', { agency })} className="font-semibold hover:underline text-blue-500">
                    {agency.name} ({agency.nb_keys})
                </Link>
            ),
        }
    ]

    return (
        <Box title="Statistiques des agences" noPadding>
            <SimpleTable columns={columns} data={agencies} header="Trousseaux sorties" />
        </Box>
    )
}

function Sites() {
    const { sites } = usePage().props

    const columns = [
        {
            title: 'Société',
            render: site => (
                <Link href={route('sites.show', { site })} className="font-semibold hover:underline text-blue-500">
                    {site.name} ({site.nb_keys})
                </Link>
            ),
        }
    ]

    return (
        <Box title="Statistiques des sociétés" noPadding>
            <SimpleTable columns={columns} data={sites} header="Trousseaux sorties" />
        </Box>
    )
}

export default function Statistiques({ keys, sites, agencies }) {
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
                            <dt className="text-sm font-medium text-gray-500">Nombre d'agences</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{agencies.length}</dd>
                        </div>
                        <div className="py-2 px-6 gap-2 grid grid-cols-2 sm:py-5 sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">Nombre de trousseaux</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{keys.length}</dd>
                        </div>
                    </dl>
                </Box>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 sm:gap-4">
                    <Sites />
                    <Agencies />
                </div>
            </div>
        </Authenticated>
    )
}
