import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from '@phosphor-icons/react';
import useApiKey from '../hooks/useApiKey';
import { h2 } from 'motion/react-client';
import nullProvider from '../assets/nullProvider.png';


export default function Providers(props) {
    const [apiKey, setApiKey] = useApiKey();
    const [providers, setProviders] = useState(null);  // Initialize as null for better type safety
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [modalPosition, setModalPosition] = useState({top: 0, left: 0});
    const [selectedLocation, setSelectedLocation] = useState('US');
    const providersRef = useRef(null);

    // console.log(props);

    useEffect(() => {
        if (!props?.id) return;  // Early return if no ID

        const isMovie = !!props.title;
        const endpoint = isMovie ? `movie/${props.id}/watch/providers` : `tv/${props.id}/watch/providers`;

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
        };

        fetch(`https://api.themoviedb.org/3/${endpoint}`, options)
            .then(res => res.json())
            .then(setProviders)
            .catch(err => console.error(err));
    }, [props.title, props.name, props.id, apiKey]);  // Include apiKey if it can change

    // console.log(providers?.results?.US);

    // Helper to get the prioritized provider list, displays under poster on media page
    const getProviderElements = () => {
        const usProviders = providers?.results?.US;
        if (!usProviders) return null;

        if (usProviders.flatrate?.length > 0) {
            return usProviders.flatrate.slice(0, 4).map((provider) => (
                <div className="provider" key={`other-${provider.provider_id}`} id={`other-${provider.provider_id}`}>
                    { provider.logo_path == undefined ? ( // Handle missing logo case
                        <img src={nullProvider} alt={"No provider logo available for " + provider?.provider_name} />
                    ) : (
                        <img src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} alt={provider.provider_name} />
                    )}
                </div>
            ));
        } else if (usProviders.ads?.length > 0) {
            return usProviders.ads.slice(0, 4).map((provider) => (
                <div className="provider" key={`other-${provider.provider_id}`} id={`other-${provider.provider_id}`}>
                    { provider.logo_path == undefined ? (
                        <img src={nullProvider} alt={"No provider logo available for " + provider?.provider_name} />
                    ) : (
                        <img src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} alt={provider.provider_name} />
                    )}                
                </div>
            ));
        } else if (usProviders.rent?.length > 0) {
            return usProviders.rent.slice(0, 4).map((provider) => (
                <div className="provider" key={`other-${provider.provider_id}`} id={`other-${provider.provider_id}`}>
                    { provider.logo_path == undefined ? (
                        <img src={nullProvider} alt={"No provider logo available for " + provider?.provider_name} />
                    ) : (
                        <img src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} alt={provider.provider_name} />
                    )}
                </div>
            ));
        } else if (usProviders.buy?.length > 0) {
            return usProviders.buy.slice(0, 4).map((provider) => (
                <div className="provider" key={`other-${provider.provider_id}`} id={`other-${provider.provider_id}`}>
                    { provider.logo_path == undefined ? (
                        <img src={nullProvider} alt={"No provider logo available for " + provider?.provider_name} />
                    ) : (
                        <img src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} alt={provider.provider_name} />
                    )}
                </div>
            ));
        } else if (usProviders.free?.length > 0) {
            return usProviders.free.slice(0, 4).map((provider) => (
                <div className="provider" key={`other-${provider.provider_id}`} id={`other-${provider.provider_id}`}>
                    { provider.logo_path == undefined ? (
                        <img src={nullProvider} alt={"No provider logo available for " + provider?.provider_name} />
                    ) : (
                        <img src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} alt={provider.provider_name} />
                    )}
                </div>
            ));
        }
        return null;
    };

    const renderModal = () => {
        if (!isModalOpen) return null;

        return createPortal(
            <div className={`provider-modal-backdrop ${isClosing ? 'closing' : 'opening'}`} onClick={() => {
                setIsClosing(true);
                setTimeout(() => {
                    setIsModalOpen(false);
                    setIsClosing(false);
                }, 300);
            }}>
                <div className={`provider-modal-content ${isClosing ? 'closing' : 'opening'}`} onClick={(e) => e.stopPropagation()}>
                    <h2>
                        Providers
                        <button className="provider-modal-close" onClick={() => {
                            setIsClosing(true);
                            setTimeout(() => {
                                setIsModalOpen(false);
                                setIsClosing(false);
                            }, 300); // Match the duration of the CSS animation
                        }}>
                            <X size={32} />
                        </button>
                    </h2>
                    <select className="provider-location-select" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                        {providers?.results && Object.keys(providers.results).map((location) => (
                            <option key={location} value={location}>
                                {new Intl.DisplayNames(['en'], {type: 'region'}).of(location)} ({location})
                            </option>
                        ))}
                    </select>
                    {providers?.results?.[selectedLocation]?.free && (
                        <>
                            <h3>Free</h3>
                            <div className="provider-list">
                                {providers.results[selectedLocation].free.map((provider) => (
                                    <div className="provider" key={`free-${provider.provider_id}`} id={`free-${provider.provider_id}`}>
                                        <img src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} title={provider.provider_name}/>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {providers?.results?.[selectedLocation]?.ads && (
                        <>
                            <h3>Ads</h3>
                            <div className="provider-list">
                                {providers.results[selectedLocation].ads.map((provider) => (
                                    <div className="provider" key={`ads-${provider.provider_id}`} id={`ads-${provider.provider_id}`}>
                                        <img src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} title={provider.provider_name} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {providers?.results?.[selectedLocation]?.flatrate && (
                        <>
                            <h3>Stream</h3>
                            <div className="provider-list">
                                {providers.results[selectedLocation].flatrate.map((provider) => (
                                    <div className="provider" key={`stream-${provider.provider_id}`} id={`stream-${provider.provider_id}`}>
                                        <img src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} title={provider.provider_name} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {providers?.results?.[selectedLocation]?.rent && (
                        <>
                            <h3>Rent</h3>
                            <div className="provider-list">
                                {providers.results[selectedLocation].rent.map((provider) => (
                                    <div className="provider" key={`rent-${provider.provider_id}`} id={`rent-${provider.provider_id}`}>
                                        <img src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} title={provider.provider_name} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {providers?.results?.[selectedLocation]?.buy && (
                        <>
                            <h3>Buy</h3>
                            <div className="provider-list">
                                {providers.results[selectedLocation].buy.map((provider) => (
                                    <div className="provider" key={`buy-${provider.provider_id}`} id={`buy-${provider.provider_id}`}>
                                        <img src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} title={provider.provider_name} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>,
            document.body
        );
    };

    return (
        <>
            {providers?.results?.US && (
                <div className="providers" ref={providersRef} onClick={() => {
                    if (providersRef.current) {
                        const rect = providersRef.current.getBoundingClientRect();
                        setModalPosition({top: rect.top, left: rect.left});
                    }
                    setIsModalOpen(true);
                }}>
                    {getProviderElements()}
                    <p>View all Providers</p>
                </div>
            )}
            {renderModal()}
        </>
    );
}