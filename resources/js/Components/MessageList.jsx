import { usePage } from '@inertiajs/inertia-react'
import Alert from '@/Components/Alert'

export default function MessageList() {
    const { messages } = usePage().props

    return (
        messages.length > 0 && (
            <div className="space-y-8 mb-8">
                {messages.map((message, index) => (
                    <Alert key={index} type={message.type}>
                        <div dangerouslySetInnerHTML={{ __html: message.message }} />
                    </Alert>
                ))}
            </div>
        )
    )
}
