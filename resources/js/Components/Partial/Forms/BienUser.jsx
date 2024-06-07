import Input from '@/Components/Form/Input'
import FormSection from '@/Components/Jetstream/FormSection'
import { useForm } from '@inertiajs/inertia-react'
import React, { useState } from 'react';
import axios from 'axios';

export default function User({ user, type, setParentData: setMainFormData }) {
    const [showOwnerLinkSelector, setShowOwnerLinkSelector] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState({});
    const [userExistsMessage, setUserExistsMessage] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        mobile: user?.mobile || ''
    });

    const inputProps = {
        data,
        setData,
        errors,
    }

    const linkOwner = () => {
        if (selectedOwner && typeof(selectedOwner.first_name) !== 'undefined') {
            setMainFormData(mainFormData => ({
                    ...mainFormData,
                    first_name: selectedOwner.first_name,
                    last_name: selectedOwner.last_name,
                    mobile: data.mobile,
                    site: selectedOwner.site_id,
                    client: selectedOwner.id
                })
            );
            setData({
                ...data,
                first_name: selectedOwner.first_name,
                last_name: selectedOwner.last_name,
            });
        }
        setShowOwnerLinkSelector(false);
    };

    const checkUserExists = (checkType) => {
        axios.post(route(type + 's.exists'), {
            mobile: data.mobile,
            type: checkType
        }).then(response => {
            const { exists, msg, found_user } = response.data;
            setShowOwnerLinkSelector(exists);
            setUserExistsMessage(msg);
            if (exists) {
                setSelectedOwner(found_user);
            } else {
                setMainFormData(mainFormData => ({
                        ...mainFormData,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        mobile: data.mobile,
                        client: ''
                    })
                );
            }
        }).catch(error => {
            console.error('Erreur lors de la vérification de l\'existence de l\'utilisateur:', error);
        });
    };

    const fillMainForm = (e) => {
        const input = e.target;
        setMainFormData(mainFormData => ({
                ...mainFormData,
                [input.getAttribute('name')]: input.value,
            })
        );
    };

    const checkMobileUserExists = () => {
        checkUserExists('mobile');
    };

    return (
        <>
            {showOwnerLinkSelector && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Propriétaire existant</h2>
                        <p>{userExistsMessage} Souhaitez-vous associer ce propriétaire ?</p>
                        <button onClick={() => setShowOwnerLinkSelector(false)}>Annuler</button>
                        <button onClick={linkOwner}>Associer</button>
                    </div>
                </div>
            )}
        <FormSection
            form={
                <>
                    <div className="text-left space-y-6">
                        <div className="col-span-6 sm:col-span-4">
                            <Input onKeyUp={fillMainForm} onBlur={checkMobileUserExists} title="Téléphone portable" type="tel" name="mobile" autoComplete="tel-national" {...inputProps} />
                        </div>
                        <div className="col-span-6 sm:col-span-4">
                            <Input onKeyUp={fillMainForm} title="Prénom" name="first_name" autoComplete="given-name" {...inputProps} />
                        </div>
                        <div className="col-span-6 sm:col-span-4">
                            <Input onKeyUp={fillMainForm} title="Nom" name="last_name" autoComplete="family-name" {...inputProps} />
                        </div>
                    </div>
                </>
            }
        />
        </>
    )
}
