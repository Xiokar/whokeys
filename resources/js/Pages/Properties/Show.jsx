import Box from '@/Components/Box'
import Button from '@/Components/Button'
import Confirm from '@/Components/Confirm'
import Histories from '@/Components/Partial/Histories'
import Property from '@/Components/Partial/Property'
import Authenticated from '@/Layouts/Authenticated'
import { faEdit, faMagnifyingGlass, faPlus, faQrcode, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Inertia } from '@inertiajs/inertia'
import { Link } from '@inertiajs/inertia-react'
import { sortBy } from 'lodash'

export default function Show({ property }) {
    const keys = sortBy(property.keys, 'id')
    return (
        <Authenticated
            title={`Bien au ${property.address}, ${property.city}`}
            breadcrumb={{ 'Liste des biens': route('properties.index'), [`Bien au ${property.full_address}`]: null }}
        >
            <div className="space-y-8">
                <Property property={property} hasEdit hasBack />
                <Histories histories={property.latestHistories} hideSignatures hideKeyName={false} />
                <div className="grid md:grid-cols-3 gap-12 md:gap-4">
                    {keys.map(key => (
                        <div key={key.id}>
                            <Box noPadding>
                                <div className="flex justify-between items-center px-4 py-5 gap-4">
                                    <div>Trousseau {key.name}</div>
                                    <div className="space-x-2 flex-shrink-0">
                                        <Link href={route('keys.edit', { key })}>
                                            <Button color="warning" type="button" icon={faEdit} />
                                        </Link>
                                        <Confirm
                                            title="Supprimer trousseau"
                                            description="Confirmer la suppression du trousseau ?"
                                            onYes={() => Inertia.delete(route('keys.destroy', { key }))}
                                        >
                                            <Button color="danger" type="button" icon={faTrash} />
                                        </Confirm>
                                    </div>
                                </div>
                                <img src={key.picture_url} alt="" className="w-full" />
                                <div>
                                    <div className={`py-5 grid grid-cols-2 gap-4 px-6 bg-gray-50`}>
                                        <dt className="text-sm font-medium text-gray-500">Nombre de clés</dt>
                                        <dd className="text-sm text-gray-900">{key.number_keys}</dd>
                                    </div>
                                    <div className={`py-5 grid grid-cols-2 gap-4 px-6 bg-white`}>
                                        <dt className="text-sm font-medium text-gray-500">Nombre de vigiks</dt>
                                        <dd className="text-sm text-gray-900">{key.number_vigiks}</dd>
                                    </div>
                                    <div className={`py-5 grid grid-cols-2 gap-4 px-6 bg-gray-50`}>
                                        <dt className="text-sm font-medium text-gray-500">Nombre de bips</dt>
                                        <dd className="text-sm text-gray-900">{key.number_bips}</dd>
                                    </div>
                                    <div className={`py-5 grid grid-cols-2 gap-4 px-6 bg-white`}>
                                        <dt className="text-sm font-medium text-gray-500">Possesseur actuel</dt>
                                        <dd className="text-sm text-gray-900">
                                            {!key.latest_history || key.latest_history.type == 'in' ? 'Aucun' : key.latest_history.user.full_name}
                                        </dd>
                                    </div>
                                </div>
                                <div className="flex justify-between p-4 bg-gray-50">
                                    <Link href={route('keys.show', { key })}>
                                        <Button icon={faMagnifyingGlass} type="button" color="success">
                                            Plus d'info
                                        </Button>
                                    </Link>
                                    <a href={route('keys.qrcode', { key })} target="_blank" rel="noreferrer">
                                        <Button icon={faQrcode} type="button" color="info">
                                            QR Code
                                        </Button>
                                    </a>
                                </div>
                            </Box>
                        </div>
                    ))}
                    <div>
                        <Box noPadding>
                            <Link href={route('keys.create', { property })}>
                                <div className="flex justify-between items-center px-4 py-5 gap-4">
                                    <div>Ajouter un trousseau</div>
                                    <div className="space-x-2 flex-shrink-0">
                                        <Button color="success" type="button" icon={faPlus} />
                                    </div>
                                </div>
                            </Link>
                        </Box>
                    </div>
                </div>
            </div>
        </Authenticated>
    )
}
