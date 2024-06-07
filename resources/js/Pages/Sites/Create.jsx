import Authenticated from '@/Layouts/Authenticated'
import Form from './Form'

export default function Create() {
    return (
        <Authenticated title="Ajouter un site" breadcrumb={{ 'Liste des sites': route('sites.index'), 'Ajouter un site': null }}>
            <Form />
        </Authenticated>
    )
}
