import SectionTitle from './Jetstream/SectionTitle'

export default function Box({ title, subtitle, description, footer, className = '', children, noPadding }) {
    return (
        <>
            <div className={`bg-white shadow overflow-hidden sm:rounded-lg mb-6 ${className}`}>
                {title && (
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
                        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
                        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
                    </div>
                )}
                <div className={`${title ? 'border-t' : ''} border-gray-200 ${noPadding ? '' : 'px-4 py-5 sm:px-6'}`}>{children}</div>
                {footer}
                
            </div>
        </>
    )
}

export function Box1({ noPadding, title, subtitle, description, footer, className = '', children }) {
    return (
        <>
            {title && description ? (
                <div className={`md:grid md:grid-cols-3 md:gap-6 ${className}`}>
                    <SectionTitle title={title}>{description}</SectionTitle>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <div className="shadow overflow-hidden sm:rounded-md">
                            <div className={`${noPadding ? '' : ' px-4 py-5 sm:p-6'} bg-white`}>
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6">{children}</div>
                                </div>
                            </div>
                            {footer}
                            
                        </div>
                    </div>
                </div>
            ) : (
                <div className={`bg-white overflow-hidden shadow sm:rounded-lg ${className}`}>
                    <div className={`bg-white border-b border-gray-200 ${noPadding ? '' : 'p-6 sm:px-20'}`}>
                        {title ? (
                            <>
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
                                    {subtitle && <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>}
                                </div>
                                <div className="border-t border-gray-200">{children}</div>
                            </>
                        ) : (
                            children
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
