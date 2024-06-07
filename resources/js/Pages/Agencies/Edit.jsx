import Authenticated from '@/Layouts/Authenticated'
import Form from './Form'

export default function Edit({ agency, keys }) {
    return (
        <Authenticated
            title="Modifier une agence"
            breadcrumb={{
                'Liste des agences': route('agencies.index'),
                [agency.name]: route('agencies.show', { agency }),
                'Modifier une agence': null,
            }}
        >
            <Form agency={agency} keys={keys} />
        </Authenticated>
    )
}
