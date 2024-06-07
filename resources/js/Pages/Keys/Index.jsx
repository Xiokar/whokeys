import Keys from '@/Components/Partial/Keys'
import Authenticated from '@/Layouts/Authenticated'

export default function Index({ keys }) {
    return (
        <Authenticated title="Liste des trousseaux" breadcrumb={{ 'Liste des trousseaux': null }} fullWidth={true}>
            <Keys keys={keys} displayProperty={true} />
        </Authenticated>
    )
}
