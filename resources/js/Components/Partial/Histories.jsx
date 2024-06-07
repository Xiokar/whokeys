import Box from '@/Components/Box'
import { Link, usePage } from '@inertiajs/inertia-react'
import { orderBy } from 'lodash'
import { useMemo } from 'react'
import Table from '@/Components/Table'
import Fancybox from '@/Components/Fancybox'

export default function Histories({ histories: historiesRaw, className = '', hideSignatures = false, hideKeyName = true }) {
    const { auth } = usePage().props

    const histories = useMemo(() => {
        let histories = orderBy(historiesRaw, 'id', 'desc')
        return histories
    }, [historiesRaw])

    return (
        <Box title="Historique" noPadding className={className}>
            <div className="overflow-y-scroll" style={{ height: 445 }}>
                <Table
                    thead={
                        <tr>
                            <Table.Th>Date</Table.Th>
                            {!hideKeyName && <Table.Th>Trousseau</Table.Th>}
                            <Table.Th>Possesseur</Table.Th>
                            <Table.Th>Type</Table.Th>
                            {!hideSignatures && <Table.Th>Signature</Table.Th>}
                        </tr>
                    }
                >
                    <>
                        {histories.map(history => (
                            <tr key={history.id} className="block py-4 sm:py-0 sm:table-row">
                                <Table.Td>
                                    <div className="flex justify-between sm:flex-col">
                                        <div className="inline-block sm:block">{history.date.split(' ')[0]}</div>
                                        <div className="inline-block sm:block">{history.date.split(' ')[1]}</div>
                                    </div>
                                </Table.Td>
                                {!hideKeyName && <Table.Td>{history.key.name}</Table.Td>}
                                <Table.Td className="py-2">
                                    {auth.can.manageClients ? (
                                        <Link
                                            href={route('clients.show', { client: history.user })}
                                            className="font-semibold hover:underline text-blue-500"
                                        >
                                            {history.user.full_name}
                                        </Link>
                                    ) : (
                                        history.user.full_name
                                    )}
                                </Table.Td>
                                <Table.Td>
                                    <span
                                        className={`p-2 rounded-xl font-semibold ${
                                            history.type == 'in'
                                                ? 'bg-green-200 text-green-600'
                                                : history.type == 'out'
                                                ? 'bg-red-200 text-red-600'
                                                : 'bg-blue-200 text-blue-600'
                                        }`}
                                    >
                                        {history.type == 'in' ? 'Rentré' : history.type == 'out' ? 'Sorti' : 'Sorti Déf.'}
                                    </span>
                                </Table.Td>
                                {!hideSignatures && (
                                    <>
                                        <Table.Td>
                                            {history.signature_url && (
                                                <Fancybox>
                                                    <button data-fancybox data-src={history.signature_url}>
                                                        <img src={history.signature_url} alt="" className="w-44 mx-auto" />
                                                    </button>
                                                </Fancybox>
                                            )}
                                        </Table.Td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </>
                </Table>
            </div>
        </Box>
    )
}
