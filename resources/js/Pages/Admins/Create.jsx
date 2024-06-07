import Authenticated from '@/Layouts/Authenticated'
import Form from '@/Components/Partial/Forms/User'

export default function Create() {
    return (
        <Authenticated
            title="Ajouter un administrateur"
            breadcrumb={{ 'Liste des administrateurs': route('clients.index'), 'Ajouter un administrateur': null }}
        >
            <Form type="admin" />
        </Authenticated>
    )
}
