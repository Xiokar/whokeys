import Authenticated from '@/Layouts/Authenticated'
import Form from './Form'

export default function Create({ property }) {
    return (
        <Authenticated
            title="Ajouter un trousseau"
            breadcrumb={{ [`Bien au ${property.full_address}`]: route('properties.show', { property }), 'Ajouter un trousseau': null }}
        >
            <Form property={property} />
        </Authenticated>
    )
}
