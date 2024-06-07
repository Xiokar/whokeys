import Box from '@/Components/Box'
import Button from '@/Components/Button'
import Confirm from '@/Components/Confirm'
import Input from '@/Components/Form/Input'
import SearchTable from '@/Components/Tables/SearchTable'
import Authenticated from '@/Layouts/Authenticated'
import { faExclamationTriangle, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Inertia } from '@inertiajs/inertia'
import { Link, useForm, usePage } from '@inertiajs/inertia-react'
import { compareAsc, parse } from 'date-fns'
import { orderBy, take } from 'lodash'

function FindKey() {
    const { data, setData, post, errors, processing, reset } = useForm({ id: '' })

    const submit = e => {
        e.preventDefault()
        post(route('keys.find'), { onSuccess: () => reset() })
    }

    return (
        <div className="space-y-8 mobile-padding">
            <Box noPadding>
                <div className="p-6">
                    <div className="font-semibold text-lg">Trouver un trousseau</div>
                    <div className="text-gray-500">Renseignez son N° pour accéder à sa page</div>
                </div>
                <form onSubmit={submit} className="p-6 space-y-2">
                    <Input placeholder="N° du trousseau" name="id" data={data} setData={setData} errors={errors} required />
                    <div className="text-right">
                        <Button processing={processing} icon={faSearch}>
                            Rechercher
                        </Button>
                    </div>
                </form>
            </Box>

        </div>
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

function Histories() {
    const { auth, histories } = usePage().props

    if (!histories) return null

    const columns = [
        {
            title: 'Date',
            sortName: 'histories.id',
            render: history => (
                <div className="flex flex-col">
                    <div>{history.date.split(' ')[0]}</div>
                    <div className="text-gray-500">{history.date.split(' ')[1]}</div>
                </div>
            ),
        },
        {
            title: 'Adresse du bien',
            sortName: 'properties.address',
            render: history => (
                <Link href={route('properties.show', { property: history.key.property })} className="font-semibold hover:underline text-blue-500">
                    {history.key.property.full_address}
                </Link>
            ),
        },
        {
            title: 'Nom du trousseau',
            sortName: 'keys.name',
            render: history => (
                <Link href={route('keys.show', { key: history.key })} className="font-semibold hover:underline text-blue-500">
                    {history.key.name}
                </Link>
            ),
        },
        {
            title: 'Possesseur actuel',
            sortName: 'users.last_name',
            render: history =>
                auth.can.manageClients && history.user.type == 'Client' || history.user.site_id != auth.site_id ? (
                    <Link href={route('clients.show', { client: history.user })} className="font-semibold hover:underline text-blue-500">
                        {history.user.full_name}
                    </Link>
                ) : (

                    history.user.full_name
                ),
        },
        {
            render: history =>
                history.alert &&
                compareAsc(parse(history.alert.date, "dd/MM/yyyy HH'h'mm", new Date()), new Date()) && (
                    <div title={history.alert.date}>
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-2xl" />
                    </div>
                ),
        },
        {
            render: history =>
                auth.can.manageProperties && (
                    <div className="text-right">
                        <Confirm
                            title="Récupération du trousseau"
                            description="Confirmer la récupération du trousseau ?"
                            extraOptions={TrousseauAction}
                            onYes={() => Inertia.post(route('histories.store', { key: history.key }), {trousseauAction: document.getElementById('trousseauAction2').value})}
                        >
                            <Button type="button">Récupérer</Button>
                        </Confirm>
                    </div>
                ),
        },
    ]

    return (
        <div className="space-y-8 mobile-padding">
            <Box noPadding>
                <SearchTable columns={columns} data={histories} routeName="dashboard" header="Trousseaux sortis" />
            </Box>
        </div>
    )
}

function CreateNote({ _key: key }) {
    const { data, setData, post, errors, processing, reset } = useForm({
        note: '',
    })

    const handleSubmit = (e, key) => {
        e.preventDefault()

        post(route('notes.store', { key }), { onSuccess: () => reset() })
    }

    return (
        <form onSubmit={e => handleSubmit(e, key)}>
            <div className="flex items-center">
                <div className="flex-grow">
                    <Input name="note" data={data} setData={setData} errors={errors} placeholder="Remarque" />
                </div>
                <div className="text-right ml-3">
                    <Button processing={processing} icon={faPlus}>
                        Ajouter
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default function Dashboard() {
    const { auth } = usePage().props

    return (
        <Authenticated breadcrumb={{ 'Tableau de bord': null }} title="Tableau de bord">
            <div className="space-y-8">
                {auth.can.manageProperties && (
                    <>
                        <div className="flex justify-center">
                            <div className="w-full sm:w-1/2">
                                <FindKey />
                            </div>
                        </div>
                        <Histories />
                    </>
                )}
                {auth.user.owned_keys.length > 0 && (
                    <div>
                        <div className="text-center font-semibold text-gray-700 leading-tight text-4xl my-6">Trousseaux en possession</div>
                        {auth.user.owned_keys.map((key, index) => (
                            <Box key={key.id} noPadding title={key.name} className={index ? 'mt-6' : ''}>
                                <div className="p-4">
                                    <CreateNote _key={key} />
                                    <div className="remarque">
                                    <p className="remarque-address">{key.property.full_address} <br/> <strong>{key.property.description}</strong></p>
                                    </div>
                                    {key.notes.length > 0 && (
                                        <ul className="mt-3 text-right">
                                            {take(orderBy(key.notes, 'id', 'desc'), 3).map(note => (
                                                <li key={note.id} className="my-3">
                                                    {note.text} / <strong>{note.date}</strong>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </Box>
                        ))}
                    </div>
                )}
            </div>
        </Authenticated>
    )
}
