import { useEffect, useState } from 'react'
import Button from '@/Components/Button'
import Table from '@/Components/Table'
import Input from '@/Components/Form/Input'
import useQuery from '@/hooks/query'
import { find, take } from 'lodash'
import Error from '@/Components/Form/Error'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle, faArrowCircleDown } from '@fortawesome/free-solid-svg-icons'
import { useForm } from '@inertiajs/inertia-react'
import Form from '@/Components/Partial/Forms/BienUser'

export default function UserSelect({ name, type = 'client', subtype = '', setData: setParentData, errors, user = null, autoSwitchOwner = null }) {
    const [users, setUsers] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [searchInitiated, setSearchInitiated] = useState(false);
    const [userId, setUserId] = useState('');
   
    const { data, setData, post, processing } = useForm({
        last_name: '',
        first_name: '',
        mobile: '',
    });

    const inputProps = {
        data,
        setData,
        errors,
        setParentData
    }

    const handleSuccess = async users => {
        let newUsers = take(users, 5);
        setUsers(newUsers);
        setSearchPerformed(newUsers.length === 0); // Indiquer qu'une recherche a été effectuée
    };

    const userSearch = useQuery({
        data: {
            search: '',
            type,
            subtype,
        },
        url: route('users.index'),
        onSuccess: handleSuccess,
    })

    // Gestionnaires d'événements
    function handleSelect(user) {
        const newValue = user?.id || '';
        setUserId(newValue);
        setParentData(parentData => ({ ...parentData, [name]: newValue === parentData[name] ? '' : newValue }));
        if (autoSwitchOwner) {
            autoSwitchOwner(user);
        }
    }

    function handleSearch(e) {
        e.preventDefault();
        setSearchInitiated(true);
        userSearch.query();
    }

    function handleSubmit(e) {
        e.preventDefault();

        const updatedData = {
            ...data,
            email: `${data.mobile.replace(/\D/g, '')}@no-mail.com`,
            password: "NoPassword", // Considérez d'utiliser une méthode plus sécurisée pour générer des mots de passe
            subtype: 'Propriétaire', 
        };

        setData(updatedData);

        if (user?.id) {
            put(route(`${type}s.update`, { [type]: user }), updatedData);
        } else {
            post(route(`${type}s.store`), updatedData);
        }
    }


    // Effets secondaires
    useEffect(() => {
        userSearch.query();
    }, []);

    useEffect(() => {
        (async () => {
            if (data[name] && !find(users, user => user.id === data[name])) {
                try {
                    const { data: newUser } = await axios.get(`/users/${data[name]}`);
                    const newUsers = take([newUser, ...users], 5);
                    setUsers(newUsers);
                } catch (error) {
                    handleSelect('');
                }
            }
        })();
    }, [data[name], users]);

    return (
        <div>
            <div className="flex justify-between my-4 mx-4">
                <div>
                    <Input
                        type="text"
                        name="search"
                        data={userSearch.data}
                        setData={userSearch.setData}
                        errors={userSearch.errors}
                        placeholder="Mots-clefs..."
                    />
                </div>
                <div>
                    <Button processing={userSearch.processing} onClick={handleSearch}>
                        Rechercher
                    </Button>
                </div>
            </div>
            {searchInitiated && searchPerformed && users.length === 0 && (
                            
                            <div className="text-center py-4">
                                <FontAwesomeIcon className="text-2xl text-red-500" icon={faTimesCircle} />
                                <p>Aucun utilisateur trouvé.<br />Vous pouvez en saisir un nouveau ci-dessous.</p>
                                <FontAwesomeIcon className="mt-2 text-2xl" icon={faArrowCircleDown} />
                                <Form name={name} type="client" {...inputProps} />
                            </div>   
                  )}
                     {!searchPerformed && (
                <Table
                    thead={
                        <tr>
                            <Table.Th>Nom & Prénom</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Type</Table.Th>
                            <Table.Th>Sélectionné</Table.Th>
                        </tr>
                    }
                >
                    {users.map(user => (
                        <tr key={user.id} className={`cursor-pointer`} onClick={() => handleSelect(user)}>
                            <Table.Td>{user.full_name}</Table.Td>
                            <Table.Td>{user.email}</Table.Td>
                            <Table.Td>{user.subtype}</Table.Td>
                            <Table.Td className="text-center">
                                {user.id == userId && <FontAwesomeIcon className={`text-2xl text-green-500`} icon={faCheckCircle} />}
                            </Table.Td>
                        </tr>
                    ))}
                </Table>
            )}
            {errors?.[name] && (
                <div className="m-4">
                    <Error>{errors?.[name]}</Error>
                </div>
            )}
        </div>
    );
    
}
