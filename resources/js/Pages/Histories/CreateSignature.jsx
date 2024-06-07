import Box from '@/Components/Box'
import Button from '@/Components/Button'
import Check from '@/Components/Form/Check'
import Label from '@/Components/Form/Label'
import Authenticated from '@/Layouts/Authenticated'
import { useForm, usePage } from '@inertiajs/inertia-react'
import { useEffect, useRef } from 'react'
import SignaturePad from 'signature_pad'
import React, { useState } from 'react';

export default function CreateSignature({ _key: key }) {
    const { auth } = usePage().props;
    const signaturePad = useRef();
    const [trousseauAction, setTrousseauAction] = useState('in');
    const { post, data, setData, processing, errors, transform } = useForm({
        number_keys: false,
        number_vigiks: false,
        number_bips: false,
        signature: '',
        text: '',
    })

    transform(data => ({
        ...data,
        signature: signaturePad.current.toDataURL(),
    }))

    const handleSubmit = e => {
        e.preventDefault()

        if (signaturePad.current.isEmpty()) {
            alert('Veuillez signer avant de confirmer la récupération.')
            return
        } else {
            for (const id of ['number_keys', 'number_vigiks', 'number_bips']) {
                if (!data[id]) {
                    alert('Veuillez confirmer que tous les éléments du trousseau sont présents.')
                    return
                }
            }
        }

        post(route('histories.store', { key }))
    }

    useEffect(() => {
        var canvas = document.getElementById('signature')
        signaturePad.current = new SignaturePad(canvas, { backgroundColor: 'rgb(255, 255, 255)' })

        function resizeCanvas() {
            var ratio = Math.max(window.devicePixelRatio || 1, 1)

            canvas.width = canvas.offsetWidth * ratio
            canvas.height = canvas.offsetHeight * ratio
            canvas.getContext('2d').scale(ratio, ratio)

            signaturePad.current.clear()
        }

        window.addEventListener('resize', resizeCanvas)
        resizeCanvas()

        return () => window.removeEventListener('resize', resizeCanvas)
    }, [])

    return (
        <Authenticated title={`Confirmer la récupération du trousseau du bien à ${key.property.city}`}>
            <form onSubmit={handleSubmit} className="space-y-8">
                <Box title="Confirmer le trousseau" description="Veuillez confirmer que tous les éléments du trousseau sont présents.">
                    <div className="space-y-1">
                        <Check
                            name="number_keys"
                            title={`${key.number_keys} ${key.number_keys > 1 ? 'clés ' : 'clé '}`}
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                        <Check
                            name="number_vigiks"
                            title={`${key.number_vigiks} ${key.number_vigiks > 1 ? 'vigiks ' : 'vigik '}`}
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                        <Check
                            name="number_bips"
                            title={`${key.number_bips} ${key.number_bips > 1 ? 'bips ' : 'bip '}`}
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label>Ajouter une remarque</Label>
                        <textarea name="text" id="text" cols="10" rows="10" value={data.text} onChange={(e) => setData('text', e.target.value)}></textarea>
                        <small>Vos remarques sont publiquement affichées au moment de la prise d'un trousseau</small>
                    </div>
                </Box>
                <Box
            title="Récupération d'un trousseau"
            noPadding
            footer={
                <div className="flex items-center justify-end px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <Button processing={processing}>Récupérer</Button>
                </div>
            }
        >
            {
                auth.user.type === 'Administrateur' && 
                <div className="p-4">
                    <Label name="trousseauAction">Action sur le trousseau :</Label>
                    <select
                        id="trousseauAction"
                        name="trousseauAction"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={trousseauAction}
                        onChange={(e) => setTrousseauAction(e.target.value)} // Met à jour l'état lors de la sélection
                    >
                        <option value="in">Je rentre la clé dans l'agence (IN)</option>
                        <option value="out">Je récupère la clé à mon nom (OUT)</option>
                    </select>
                </div>
            }
            <div className="p-4 space-y-2">
                <Label>Signature</Label>
                <canvas id="signature" className="bg-white w-full h-56 border rounded" />
            </div>
            
            <div className="px-4 py-3 bg-gray-50 sm:px-6">
                <p>Veuillez signer puis confirmer la récupération.</p>
            </div>
            
        </Box>
            </form>
        </Authenticated>
    )
}
