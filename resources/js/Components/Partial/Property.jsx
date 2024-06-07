import { faArrowCircleLeft, faEdit } from '@fortawesome/free-solid-svg-icons'
import { Link, usePage } from '@inertiajs/inertia-react'
import Box from '@/Components/Box'
import Description from '@/Components/Description'
import Button from '@/Components/Button'

function isEmptyObject(object) { for(var i in object) { return true; } return false; }

export default function Property({ property, hasEdit, hasBack, hideConfidentials = false }) {
    const { auth } = usePage().props

    let infos;

    if (property.latestHistories && !isEmptyObject(property.latestHistories)) {
        const histories = Object.values(property.latestHistories);
        const history = histories.pop();
        hasEdit = hasEdit && history.type == 'in';
    }

    if (hideConfidentials) {
        infos = <Description>
            <div className="mobile-padding">
                <Description.Row title="Agence">
                    <div className="capitalize">{property.agencies?.[0]?.name || 'Aucune'}</div>
                </Description.Row>
            </div>
        </Description>;
    } else {
        let owner = 'Aucun';

        if (property.user) {
            owner = property.user.full_name;

            if (auth.can.manageClients) {
                owner = <Link href={route('clients.show', { client: property.user })} className="text-indigo-600 hover:text-indigo-900">
                            {property.user.full_name}
                        </Link>;
            }
        }

        infos = <Description>
            <div className="mobile-padding">
                {auth.user.subtype == 'Super' && <Description.Row title="Société">{property.site.name}</Description.Row>}
                <Description.Row title="Agence">
                    <div className="capitalize">{property.agencies?.[0]?.name || 'Aucune'}</div>
                </Description.Row>
                <Description.Row title="Propriétaire">{owner}</Description.Row>
                <Description.Row title="Adresse">{property.address}</Description.Row>
                {property.address2 && <Description.Row title="Étage / Porte">{property.address2}</Description.Row>}
                <Description.Row title="Ville">{property.city}</Description.Row>
                <Description.Row title="Code postal">{property.postcode}</Description.Row>
                {property.description && <Description.Row title="Description">{property.description}</Description.Row>}
                {auth.can.manageClients && (property.last_name || property.first_name || property.mobile) && (
                    <>
                        <Description.Row title="Nom du propriétaire">{property.last_name}</Description.Row>
                        <Description.Row title="Prénom du propriétaire">{property.first_name}</Description.Row>
                        <Description.Row title="Téléphone du propriétaire">{property.mobile}</Description.Row>
                    </>
                )}
            </div>
        </Description>;
    }

    return (
        <Box
            title={
                <div className="flex justify-between items-center">
                    <div>Informations du bien</div>
                    <div className="space-x-2 flex items-center">
                        {auth.can.manageProperties && hasEdit && (
                            <Link href={route('properties.edit', { property })}>
                                <Button type="button" color="warning" icon={faEdit}>
                                    Modifier
                                </Button>
                            </Link>
                        )}

                        {hasBack && (
                            <Button
                                type="button"
                                onClick={() => history.back()}
                                color="lightgray"
                                icon={faArrowCircleLeft}
                                className="hidden md:inline-block"
                            >
                                Retour
                            </Button>
                        )}
                    </div>
                </div>
            }
            noPadding
        >{infos}</Box>
    )
}
