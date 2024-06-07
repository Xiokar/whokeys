import Authenticated from '@/Layouts/Authenticated'
import Form from './Form'

export default function Edit({ property }) {
    return (
        <Authenticated
            title="Modifier un bien"
            breadcrumb={{
                'Liste des biens': route('properties.index'),
                [`Bien au ${property.full_address}`]: route('properties.show', { property }),
                'Modifier un bien': null,
            }}
        >
            <Form property={property} />
        </Authenticated>
    )
}
