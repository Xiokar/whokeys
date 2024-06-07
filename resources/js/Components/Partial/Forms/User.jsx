import Button from '@/Components/Button'
import Input from '@/Components/Form/Input'
import Select from '@/Components/Form/Select'
import FormSection from '@/Components/Jetstream/FormSection'
import { Inertia } from '@inertiajs/inertia'
import { useForm, usePage } from '@inertiajs/inertia-react'
import React, { useState } from 'react';
import axios from 'axios';

export default function User({ user, type }) {
    const { auth, sites, options, agencies } = usePage().props;
    const [showAgencySelector, setShowAgencySelector] = useState(false);
    const [selectedAgency, setSelectedAgency] = useState('');
    const [userExistsMessage, setUserExistsMessage] = useState('');
    const [userId, setUserId] = useState('0');

    const subtypes = usePage().props.options.types[type == 'admin' ? 'Administrateur' : 'Client']
    const types = Object.keys(usePage().props.options.types)

    const { data, setData, post, put, processing, errors } = useForm({
        email: user?.email || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        mobile: user?.mobile || '',
        type: user?.type || (type == 'admin' ? 'Administrateur' : 'Client'),
        subtype: user?.subtype || (type == 'admin' ? 'Gestionnaire' : ''),
        site: user?.site_id || '',
    })

    const inputProps = {
        data,
        setData,
        errors,
    }

    const joinAgency = () => {
        console.log(selectedAgency);
        if (selectedAgency && userId) {
            Inertia.post('/join-agency', {
                agency_id: selectedAgency,
                user_id: userId
            }, {
                onSuccess: () => {
                    setShowAgencySelector(false);
                },
                onError: error => {
                    console.error('Erreur lors de la tentative de rejoindre une agence:', error);
                }
            });
        }
    };
    
    const checkUserExists = (checkType) => {
        axios.post(route(type + 's.exists'), {
            email: data.email,
            mobile: data.mobile,
            type: checkType
        }).then(response => {
            const { exists, msg, id } = response.data;
            setShowAgencySelector(exists);
            setUserExistsMessage(msg);
            if (exists) {
                setUserId(id);
            }
        }).catch(error => {
            console.error('Erreur lors de la vérification de l\'existence de l\'utilisateur:', error);
        });
    };
    
    
    const checkMobileUserExists = () => {
        checkUserExists('mobile');
    };
    
    const checkEmailUserExists = () => {
        checkUserExists('email');
    };

    const handleSubmit = () => {
        if (user?.id) {
            put(route(type + 's.update', { [type]: user }))
        } else {
            post(route(type + 's.store'))
        }
    }

    return (
        <>
            {showAgencySelector && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Utilisateur déjà existant</h2>
                        <p>{userExistsMessage} Voulez-vous le relier à une agence?</p>
                        <select onChange={(e) => setSelectedAgency(e.target.value)}>
                            <option value="">Sélectionner une agence</option>
                            {agencies.map(agency => (
                                <option key={agency.id} value={agency.id}>{agency.name}</option>
                            ))}
                        </select>
                        <button onClick={() => setShowAgencySelector(false)}>Annuler</button>
                        <button onClick={joinAgency}>Rejoindre</button>
                    </div>
                </div>
            )}

            <FormSection
                title="Information du profil"
                description={`${user
                    ? `Modifier les informations personnelles de l'${type == 'admin' ? 'administrateur' : 'utilisateur'}`
                    : `Définissez les informations personnelles du nouvel ${type == 'admin' ? 'administrateur' : 'utilisateur'}`
                    } ainsi que son type`}
                submit={handleSubmit}
                form={
                    <>
                        <div className="col-span-6 sm:col-span-4">
                            <Input onBlur={checkEmailUserExists} title="Adresse email" type="email" name="email" autoComplete="username" {...inputProps} />
                        </div>
                        <div className="col-span-6 sm:col-span-4">
                            <Input onBlur={checkMobileUserExists} title="Téléphone portable" type="tel" name="mobile" autoComplete="tel-national" {...inputProps} />
                        </div>
                        <div className="col-span-6 sm:col-span-4">
                            <Input title="Prénom" name="first_name" autoComplete="given-name" {...inputProps} />
                        </div>
                        <div className="col-span-6 sm:col-span-4">
                            <Input title="Nom" name="last_name" autoComplete="family-name" {...inputProps} />
                        </div>

                        {auth.user.subtype == 'Super' && user && (
                            <div className="col-span-6 sm:col-span-4">
                                <Select title="Compte" name="type" {...inputProps}>
                                    <option value="">Compte</option>
                                    {types.map(type => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        )}
                        {type != 'admin' && (
                            <div className="col-span-6 sm:col-span-4">
                                <Select title="Type" name="subtype" {...inputProps}>
                                    <option value="">Type</option>
                                    {subtypes.map(subtype => (
                                        <option key={subtype} value={subtype}>
                                            {subtype}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        )}
                        {auth.user.subtype == 'Super' && (
                            <div className="col-span-6 sm:col-span-4">
                                <Select title="Société" name="site" {...inputProps}>
                                    <option value="">Société</option>
                                    {sites.map(site => (
                                        <option key={site.id} value={site.id}>
                                            {site.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        )}
                        {type === 'admin' && (
                            <div className="col-span-6 sm:col-span-4">
                             <Select onChange={(e) => setSelectedAgency(e.target.value)}>
                            <option value="">Sélectionner une agence</option>
                            {agencies.map(agency => (
                                <option key={agency.id} value={agency.id}>{agency.name}</option>
                            ))}
                        </Select>
                           
                        </div>
                        )}

                    </>
                }
                actions={
                    <Button className="ml-4" processing={processing}>
                        Enregistrer
                    </Button>
                }
            />
        </>
    )
}
