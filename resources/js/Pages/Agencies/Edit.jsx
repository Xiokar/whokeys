import Authenticated from '@/Layouts/Authenticated'
import Form from './Form'

export default function Edit({ agency }) {
    return (
        <Authenticated
            title="Modifier une agence"
            breadcrumb={{
                'Liste des agencies': route('agencies.index'),
                [agency.name]: route('agencies.show', { agency }),
                'Modifier une agence': null,
            }}
        >
            <Form agency={agency} />
        </Authenticated>
    )
}
