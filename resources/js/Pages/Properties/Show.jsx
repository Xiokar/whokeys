import Histories from '@/Components/Partial/Histories'
import Property from '@/Components/Partial/Property'
import Keys from '@/Components/Partial/Keys'
import Authenticated from '@/Layouts/Authenticated'
import { sortBy } from 'lodash'

export default function Show({ property }) {
    const keys = sortBy(property.keys, 'id')
    return (
        <Authenticated
            title={`Bien au ${property.address}, ${property.city}`}
            breadcrumb={{ 'Liste des biens': route('properties.index'), [`Bien au ${property.full_address}`]: null }}
        >
            <div className="space-y-8">
                <Property property={property} hasEdit hasBack />
                <Histories histories={property.latestHistories} hideSignatures hideKeyName={false} />
                <Keys keys={keys} property={property} />
            </div>
        </Authenticated>
    )
}
