import { useEffect, useState } from 'react'
import ApplicationLogo from '@/Components/ApplicationLogo'
import Dropdown from '@/Components/Dropdown'
import NavLink from '@/Components/NavLink'
import ResponsiveNavLink from '@/Components/ResponsiveNavLink'
import { Head, Link, usePage } from '@inertiajs/inertia-react'
import Select from '@/Components/Form/Select'
import { Inertia } from '@inertiajs/inertia'
import MessageList from '@/Components/MessageList'

export default function Authenticated({ title, children, breadcrumb = [], fullWidth = false }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false)

    const props = usePage().props
    const { auth, options, config } = props
    const [site, setSite] = useState(config.site)

    useEffect(() => site != config.site && Inertia.post(route('set-site'), { site }), [site])

    let parentRoute = 'dashboard'
    if (route().current('properties.*')) parentRoute = 'properties'
    if (route().current('agencies.*')) parentRoute = 'agencies'
    if (route().current('clients.*')) parentRoute = 'clients'
    if (route().current('sites.*')) parentRoute = 'sites'
    if (route().current('admins.*')) parentRoute = 'admins'

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={title} />
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto" />
                                </Link>
                            </div>
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                            </div>
                            {auth.can.manageProperties && (
                                <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                    <NavLink href={route('properties.index')} active={route().current('properties.*')}>
                                        Biens
                                    </NavLink>
                                </div>
                            )}
                            {auth.can.manageClients && (
                                <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                    <NavLink href={route('clients.index')} active={route().current('clients.*')}>
                                        Utilisateurs
                                    </NavLink>
                                </div>
                            )}
                            {auth.can.manageAgencies && (
                                <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                    <NavLink href={route('agencies.index')} active={route().current('agencies.*')}>
                                        Agences
                                    </NavLink>
                                </div>
                            )}
                            {auth.can.manageAdmins && (
                                <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                    <NavLink href={route('admins.index')} active={route().current('admins.*')}>
                                        Administrateurs
                                    </NavLink>
                                </div>
                            )}
                            {auth.user.type == 'Administrateur' && auth.user.subtype !== 'Super' && (
                                <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                    <NavLink href={route('keys.index')} active={route().current('keys.*')}>
                                        Trousseaux
                                    </NavLink>
                                </div>
                            )}
                            {auth.can.manageSites && (
                                <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                    <NavLink href={route('sites.index')} active={route().current('sites.*')}>
                                        Sociétés
                                    </NavLink>
                                </div>
                            )}
                        </div>
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            {auth.user.subtype == 'Super' && (
                                <Select onChange={setSite} value={site}>
                                    <option value="">Tous</option>
                                    {options.sites.map(site => (
                                        <option key={site.id} value={site.id}>
                                            {site.name}
                                        </option>
                                    ))}
                                </Select>
                            )}
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {auth.user.full_name} / {auth.user.subtype == 'Gestionnaire' ? auth.user.type : auth.user.subtype}
                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <div className="block px-4 py-2 text-xs text-gray-400">Gérer le compte</div>
                                        <Dropdown.Link href={route('profile.edit')} method="get">
                                            Profil
                                        </Dropdown.Link>
                                        {auth.can.manageClients && (
                                            <Dropdown.Link href={route('clients.index')}>
                                                Utilisateurs
                                            </Dropdown.Link>
                                        )}
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Déconnexion
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(previousState => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Tableau de bord
                        </ResponsiveNavLink>
                    </div>
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{auth.user.full_name}</div>
                            <div className="font-medium text-sm text-gray-500">{auth.user.email}</div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')} active={route().current('admins.edit')}>
                                Profil
                            </ResponsiveNavLink>
                            {auth.can.manageClients && (
                                <ResponsiveNavLink href={route('clients.index')} active={route().current('clients.*')}>
                                    Utilisateurs
                                </ResponsiveNavLink>
                            )}
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Déconnexion
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <div>
                            <img src={`/images/headers-pictos/${parentRoute}.jpg`} alt={title} className="w-16" />
                        </div>
                        <div>
                            <ul className="flex text-gray-400 text-xs lg:text-sm">
                                {Object.entries(breadcrumb).map(([title, url], index) => (
                                    <li key={title} className="inline-flex items-center">
                                        {index > 0 && (
                                            <svg className="h-5 w-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                        {url ? <Link href={url}>{title}</Link> : <span className="text-gray-600">{title}</span>}
                                    </li>
                                ))}
                            </ul>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight mt-1">{title}</h2>
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <div className={"py-8 " + (fullWidth ? "" : "max-w-7xl ") + "mx-auto sm:px-6 lg:px-10"}>
                    <MessageList />
                    {children}
                </div>
            </main>
        </div>
    )
}
