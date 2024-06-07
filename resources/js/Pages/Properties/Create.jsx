import Authenticated from '@/Layouts/Authenticated'
import Form from './Form'

export default function Create() {
    return (
        <Authenticated title="Ajouter un bien" breadcrumb={{ 'Liste des biens': route('properties.index'), 'Ajouter un bien': null }}>
            <Form />
        </Authenticated>
    )
}
