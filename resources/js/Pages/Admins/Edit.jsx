import Authenticated from '@/Layouts/Authenticated'
import Form from '@/Components/Partial/Forms/User'

export default function Edit({ admin }) {
    return (
        <Authenticated
            title="Modifier un administrateur"
            breadcrumb={{
                'Liste des administrateurs': route('admins.index'),
                [admin.full_name]: route('admins.show', { admin }),
                'Modifier un administrateur': null,
            }}
        >
            <Form user={admin} type="admin" />
        </Authenticated>
    )
}
