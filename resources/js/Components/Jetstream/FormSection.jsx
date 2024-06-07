import SectionTitle from '@/Components/Jetstream/SectionTitle'

export default function FormSection({ title, description, submit, actions, form }) {
    const handleSubmit = e => {
        e.preventDefault()
        submit()
    }

    return (
        <div>
            <SectionTitle title={title}>{description}</SectionTitle>
            <div className="mt-5 md:col-span-2">
                <form onSubmit={handleSubmit}>
                    <div className="shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 bg-white sm:p-6">
                            <div className="grid gap-6 md:min-w-96">{form}</div>
                        </div>
                        {actions && <div className="text-center px-4 py-3 bg-gray-50 sm:px-6">{actions}</div>}
                    </div>
                </form>
            </div>
        </div>
    )
}
