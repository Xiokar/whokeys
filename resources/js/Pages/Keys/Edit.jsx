import Authenticated from '@/Layouts/Authenticated'
import Form from './Form'

export default function Create({ property, _key: key }) {
    return (
        <Authenticated
            title="Modifier un trousseau"
            breadcrumb={{
                'Liste des biens': route('properties.index'),
                [`Bien au ${property.full_address}`]: route('properties.show', { property }),
                [key.name]: route('keys.show', { key }),
                'Modifier un trousseau': null,
            }}
        >
            <Form _key={key} property={property} />
        </Authenticated>
    )
}
