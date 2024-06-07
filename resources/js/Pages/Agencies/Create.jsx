import Authenticated from '@/Layouts/Authenticated'
import Form from './Form'

export default function Create() {
    return (
        <Authenticated title="Ajouter une agence" breadcrumb={{ 'Liste des agences': route('agencies.index'), 'Ajouter une agence': null }}>
            <Form />
        </Authenticated>
    )
}
