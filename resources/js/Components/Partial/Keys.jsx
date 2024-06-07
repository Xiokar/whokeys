import Box from '@/Components/Box'
import Button from '@/Components/Button'
import Confirm from '@/Components/Confirm'
import { faEdit, faMagnifyingGlass, faPlus, faQrcode, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Inertia } from '@inertiajs/inertia'
import { Link } from '@inertiajs/inertia-react'

export default function Keys({ keys, property = null, displayProperty = false }) {
    return (
        <div className="grid md:grid-cols-3 gap-12 md:gap-4 mt-8">
            {keys.map(key => (
                <div key={key.id}>
                    <Box noPadding>
                        <div className="flex justify-between items-center px-4 py-5 gap-4">
                            <div>
                                Trousseau n°{key.identifier} ({key.name})<br />
                                <small class="text-gray-400">{key.property.agency.site.name} / {key.property.agency.name} / {key.identifier}</small>
                                {
                                    displayProperty ?
                                    <div>
                                        <Link href={route('properties.show', key.property)} className="font-semibold hover:underline text-blue-500">
                                            <small>
                                                {key.property.address} - {key.property.postcode} {key.property.city}
                                            </small>
                                        </Link>
                                    </div> : 
                                    ''
                                }
                            </div>
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
            {property ? <div>
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
            </div> : ''}
        </div>
    )
}