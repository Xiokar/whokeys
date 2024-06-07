import Authenticated from '@/Layouts/Authenticated'
import Form from '@/Components/Partial/Forms/User'

export default function Create() {
    return (
        <Authenticated
            title="Ajouter un utilisateur"
            breadcrumb={{ 'Liste des utilisateurs': route('clients.index'), 'Ajouter un utilisateur': null }}
        >
            <Form type="client" />
        </Authenticated>
    )
}
