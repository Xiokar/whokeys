import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons'
import Button from '@/Components/Button'
import File from '@/Components/Form/File'
import Input from '@/Components/Form/Input'
import Select from '@/Components/Form/Select'
import { useForm } from '@inertiajs/inertia-react'
import Cropper from 'cropperjs'
import { range } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import 'cropperjs/dist/cropper.css'
import Label from '@/Components/Form/Label'
import Box from '@/Components/Box'

export default function User({ _key: key = null, property }) {
    const cropper = useRef(null)
    const [newPicture, setNewPicture] = useState(null)
    const { data, setData, post, processing, errors } = useForm({
        name: key?.name || '',
        identifier: key?.identifier || -1,
        number_keys: key?.number_keys || 1,
        number_vigiks: key?.number_vigiks || 0,
        number_bips: key?.number_bips || 0,
        picture: null,
        crop: { x: 0, y: 0, width: 0, height: 0 },
    })

    const zeroToTen = range(0, 11)

    const inputProps = {
        data,
        setData,
        errors,
    }

    const handleSubmit = e => {
        e.preventDefault()
        if (key?.id) {
            post(route('keys.update', { key, _method: 'PUT' }))
        } else {
            post(route('keys.store', { property }))
        }
    }

    const handleImageChange = picture => {
        if (picture) {
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setData(data => ({ ...data, picture }))
                setNewPicture(reader.result)
            })
            reader.readAsDataURL(picture)
        }
    }

    useEffect(() => {
        if (!newPicture) return

        if (cropper.current) cropper.current.destroy()

        let x, y, width, height
        const el = document.getElementById('image')

        cropper.current = new Cropper(el, {
            aspectRatio: 1,
            viewMode: 1,
            movable: false,
            rotatable: false,
            scalable: false,
            zoomable: false,
            guides: false,
            cropend() {
                setData(data => ({ ...data, crop: { x, y, width, height } }))
            },
            crop(event) {
                x = Math.floor(event.detail.x)
                y = Math.floor(event.detail.y)
                width = Math.floor(event.detail.width)
                height = Math.floor(event.detail.height)
            },
            ready() {
                const { x, y, width, height } = this.cropper.getData(true)
                setData(data => ({ ...data, crop: { x, y, width, height } }))
            },
        })
    }, [newPicture])

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-8">
                <Button htmlTag="a" icon={faArrowCircleLeft} href={route('properties.show', { property })}>
                    Retour
                </Button>
                <Box
                    title="Information du trousseau"
                    description={key ? `Modifier les informations du trousseau` : `Définissez les informations du trousseau`}
                >
                    <div className="space-y-6">
                        <div>
                            <Input title="Nom" name="name" {...inputProps} />
                        </div>
                        {key && (
                            <div>
                                <Input title="Identifiant" name="identifier" {...inputProps} />
                            </div>
                        )}
                        <div>
                            <Select title="Nombre de clés" name="number_keys" {...inputProps}>
                                {zeroToTen.map(nb => (
                                    <option key={nb} value={nb}>
                                        {nb}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Select title="Nombre de vigiks" name="number_vigiks" {...inputProps}>
                                {zeroToTen.map(nb => (
                                    <option key={nb} value={nb}>
                                        {nb}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Select title="Nombre de bips" name="number_bips" {...inputProps}>
                                {zeroToTen.map(nb => (
                                    <option key={nb} value={nb}>
                                        {nb}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        {key?.picture_url && (
                            <div>
                                <Label>Image</Label>
                                <img src={key?.picture_url} />
                            </div>
                        )}
                    </div>
                </Box>
                <Box title="Image du trousseau" description={key ? `Modifier l'image du trousseau` : `Définisser l'image du trousseau`}>
                    <div className="space-y-2">
                        <File name="picture" onChange={handleImageChange} value={data.picture} errors={errors} />
                        <img id="image" src={newPicture} />
                    </div>
                </Box>
                <div className="text-center">
                    <Button processing={processing}>
                        Enregistrer
                    </Button>
                    </div>
            </div>
        </form>
    )
}
