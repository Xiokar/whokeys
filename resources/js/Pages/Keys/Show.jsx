import Box from '@/Components/Box'
import Button from '@/Components/Button'
import Confirm from '@/Components/Confirm'
import Description from '@/Components/Description'
import Check from '@/Components/Form/Check'
import DatePicker from '@/Components/Form/DatePicker'
import UserSelect from '@/Components/Form/UserSelect'
import Histories from '@/Components/Partial/Histories'
import Table from '@/Components/Table'
import Authenticated from '@/Layouts/Authenticated'
import { faArrowCircleLeft, faCheckCircle, faEdit, faPlus, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Inertia } from '@inertiajs/inertia'
import { Link, useForm, usePage } from '@inertiajs/inertia-react'
import { orderBy, take } from 'lodash'
import { useMemo } from 'react'

function Picture({ _key: key }) {
    return (
        <Box noPadding title="Photo">
            <img src={key.picture_url} alt="" className="w-full" />
        </Box>
    )
}

function Notes({ _key: key }) {
    const { auth } = usePage().props

    const notes = useMemo(() => {
        let notes = orderBy(key.notes, 'id', 'desc')
        return take(notes, 5)
    }, [key.notes])

    return (
        <Box
            title={
                <div className="flex justify-between items-center">
                    <div>Remarques</div>
                </div>
            }
            noPadding
        >
            <Table
                thead={
                    <tr>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Utilisateur</Table.Th>
                        <Table.Th>Remarque</Table.Th>
                    </tr>
                }
            >
                {notes.map(note => (
                    <tr key={note.id}>
                        <Table.Td>{note.date}</Table.Td>
                        <Table.Td>
                            {auth.can.manageClients && note.user.type === 'Client' ? (
                                <Link href={route('clients.show', { client: note.user })} className="font-semibold hover:underline text-blue-500">
                                    {note.user.full_name}
                                </Link>
                            ) : (
                                note.user.full_name
                            )}
                        </Table.Td>
                        <Table.Td>
                            <div className="whitespace-normal">{note.text}</div>
                        </Table.Td>
                    </tr>
                ))}
            </Table>
        </Box>
    )
}

function ManualStoreHistory({ _key: key }) {
    const { post, data, setData, processing, errors, reset } = useForm({
        user: '',
        definitive: false,
    })

    const handleSubmit = e => {
        e.preventDefault()
        post(route('histories.manual-store', { key }), {
            preserveScroll: true,
            onSuccess: () => {
                reset()
                scrollTo(0, 0)
            },
        })
    }

    return (
        <Box
            title="Acter une récupération de trousseau"
            description="Ce formulaire permet d'acter la récupération d'un trousseau par un utilisateur qui n'aurait pas la possibilité de le faire."
            noPadding
        >
            <form onSubmit={handleSubmit}>
                <UserSelect name="user" type="Client" data={data} setData={setData} errors={errors} />
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <div>
                        <Check name="definitive" title="Définitive" data={data} setData={setData} errors={errors} />
                    </div>
                    <div>
                        <Button color="success" icon={faCheckCircle} processing={processing}>
                            Valider
                        </Button>
                    </div>
                </div>
            </form>
        </Box>
    )
}

function TrousseauAction()
{
    return <select
        id="trousseauAction2"
        name="trousseauAction"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
    >
        <option value="in">Je rentre la clé dans l'agence (IN)</option>
        <option value="out">Je récupère la clé à mon nom (OUT)</option>
    </select>;
}

export default function Show({ _key: key }) {
    const { post, data, setData, errors, processing, reset } = useForm({
        date: '',
    })

    const addAlert = e => {
        e.preventDefault()

        post(route('alerts.store', { key }), { onSuccess: () => reset() })
    }

    return (
        <Authenticated
            title={key.name}
            breadcrumb={{
                'Liste des biens': route('properties.index'),
                [`Bien à ${key.property.city}`]: route('properties.show', { property: key.property.id }),
                [key.name]: null,
            }}
        >
            <div className="flex mb-12">
                <div className="flex-grow">
                    <Box
                        title={
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Description du trousseau de clés</h3>
                                <div className="flex justify-end gap-3">
                                    {key.latest_history && key.latest_history.is_out && (
                                        <Confirm
                                            title="Récupération du trousseau"
                                            description="Confirmer la récupération du trousseau ?"
                                            extraOptions={TrousseauAction}
                                            onYes={() => Inertia.post(route('histories.store', { key }), {trousseauAction: document.getElementById('trousseauAction2').value})}
                                        >
                                            <Button type="button">Récupérer</Button>
                                        </Confirm>
                                    )}
                                    <Link href={route('keys.edit', { key })}>
                                        <Button type="button" color="warning" icon={faEdit}>
                                            Modifier
                                        </Button>
                                    </Link>
                                    <Button
                                        color="lightgray"
                                        type="button"
                                        onClick={() => history.back()}
                                        icon={faArrowCircleLeft}
                                        className="hidden md:inline-block"
                                    >
                                        Retour
                                    </Button>
                                </div>
                            </div>
                        }
                        noPadding
                    >
                        <Description>
                            <Description.Row title="Nom" background>
                                {key.name}
                            </Description.Row>
                            <Description.Row title="Nombre de clés">{key.number_keys}</Description.Row>
                            <Description.Row title="Nombre de vigiks" background>
                                {key.number_vigiks}
                            </Description.Row>
                            <Description.Row title="Nombre de bips">{key.number_bips}</Description.Row>
                            <Description.Row title={<div className="flex flex-col justify-center h-full">Alerte</div>} background>
                                {key.latest_history && key.latest_history.is_out ? (
                                    key.latest_history.alert ? (
                                        <div className="flex items-center gap-2">
                                            {key.latest_history.alert.date}
                                            <Confirm
                                                title="Suppression de l'alerte"
                                                description="Confirmer la suppression de l'alerte ?"
                                                onYes={() => Inertia.delete(route('alerts.destroy', { alert: key.latest_history.alert }))}
                                            >
                                                <button type="button">
                                                    <FontAwesomeIcon icon={faTimesCircle} className="text-lg text-red-600" />
                                                </button>
                                            </Confirm>
                                        </div>
                                    ) : (
                                        <form onSubmit={addAlert}>
                                            <div className="flex items-center gap-2">
                                                <div>
                                                    <DatePicker
                                                        withTime
                                                        name="date"
                                                        placeholder="Date de l'alerte"
                                                        data={data}
                                                        setData={setData}
                                                        errors={errors}
                                                    />
                                                </div>
                                                <Button icon={faPlus} processing={processing}>
                                                    Ajouter
                                                </Button>
                                            </div>
                                        </form>
                                    )
                                ) : (
                                    'Aucune'
                                )}
                            </Description.Row>
                        </Description>
                    </Box>
                </div>
                <div className="ml-12 hidden md:block">
                    <Box noPadding>
                        <a href={route('keys.qrcode', { key })}>
                            <img src={key.qrcode_url} alt="QRCode" />
                        </a>
                    </Box>
                </div>
            </div>
            <Histories histories={key.histories} className="mb-12" />
            <div className="grid grid-cols-2 gap-12 md:gap-12">
                <div className="col-span-2 md:col-span-1">
                    <Picture _key={key} />
                </div>
                <div className="col-span-2 md:col-span-1">
                    <Notes _key={key} />
                </div>
            </div>
            <div className="my-12">
                <ManualStoreHistory _key={key} />
            </div>
        </Authenticated>
    )
}
