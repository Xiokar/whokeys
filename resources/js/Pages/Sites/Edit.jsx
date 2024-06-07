import Authenticated from '@/Layouts/Authenticated'
import Form from './Form'

export default function Edit({ site }) {
    return (
        <Authenticated
            title="Modifier un site"
            breadcrumb={{
                'Liste des sites': route('sites.index'),
                [site.name]: route('sites.show', { site }),
                'Modifier un site': null,
            }}
        >
            <Form site={site} />
        </Authenticated>
    )
}
