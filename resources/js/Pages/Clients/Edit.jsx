import Authenticated from '@/Layouts/Authenticated'
import Form from '@/Components/Partial/Forms/User'

export default function Edit({ client }) {
    return (
        <Authenticated
            title="Modifier un utilisateur"
            breadcrumb={{
                'Liste des utilisateurs': route('clients.index'),
                [client.full_name]: route('clients.show', { client }),
                'Modifier un utilisateur': null,
            }}
        >
            <Form user={client} type="client" />
        </Authenticated>
    )
}
