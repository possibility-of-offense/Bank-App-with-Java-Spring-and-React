import useFetch from '../../hooks/useFetch';
import Loader from '../ui/Loader';
import './Transfer.css';
import { useState } from 'react';

export default function Transfer({ el }) {
    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

    const handleShowAdditionalInfo = async (e) => {
        e.stopPropagation();
        setShowAdditionalInfo((prev) => !prev);

        await fetcher();
    };

    const { fetcher, status, data } = useFetch({
        url: process.env.REACT_APP_SHOW_TRANSFER + '/' + el.id,
        method: 'GET',
    });

    return (
        <li onClick={handleShowAdditionalInfo}>
            <div>
                <strong>From:</strong>
                <p>{el.account.name}</p>
            </div>
            <div>
                <strong>To:</strong>
                <p>{el.beneficiaryAccount.name}</p>
            </div>
            {showAdditionalInfo && (
                <div className="additional-transfer-info">
                    {status === 'loading' && <Loader />}

                    {status === 'finish' && data && (
                        <>
                            <p>
                                The amount transfer:{' '}
                                <strong>{data.amount}</strong>
                            </p>
                            <p>
                                The type of transfer:{' '}
                                <strong>{data.type}</strong>
                            </p>
                        </>
                    )}
                </div>
            )}
        </li>
    );
}
