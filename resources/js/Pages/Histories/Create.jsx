import Box from '@/Components/Box'
import Button from '@/Components/Button'
import Description from '@/Components/Description'
import Histories from '@/Components/Partial/Histories'
import Property from '@/Components/Partial/Property'
import Authenticated from '@/Layouts/Authenticated'
import { usePage } from '@inertiajs/inertia-react'

export default function Create({ _key: key, canReclaim, type }) {
    const { auth } = usePage().props

    return (
        <Authenticated title={`Récupérer le trousseau du bien à ${key.property.city}`}>
            {canReclaim && (
                <div className="text-center mb-8">
                    <Button htmlTag="a" href={route('histories.create-signature', { key })}>
                        {type == 'out' ? 'Récupérer' : 'Récupérer le trousseau'}
                    </Button>
                </div>
            )}
            <div className="space-y-8 mobile-padding">
                <Property property={key.property} hideConfidentials={auth.user.type !== 'Client' ? true : false} />
                <Box title="Description du trousseau" noPadding>
                    <div className="mobile-padding">
                    <Description >
                        <Description.Row title="Nom" background>
                            {key.name}
                        </Description.Row>
                        <Description.Row title="Nombre de clés">{key.number_keys}</Description.Row>
                        <Description.Row title="Nombre de vigiks" background>
                            {key.number_vigiks}
                        </Description.Row>
                        <Description.Row title="Nombre de bips">{key.number_bips}</Description.Row>
                        <Description.Row title="Possesseur actuel" background>
                            {!key.latest_history || key.latest_history.type == 'in' ? 'Aucun' : key.latest_history.user.full_name}
                        </Description.Row>
                    </Description>
                    </div>
                </Box>
                {auth.can.manageProperties && <Histories histories={key.histories} hideSignatures />}
            </div>
        </Authenticated>
    )
}
