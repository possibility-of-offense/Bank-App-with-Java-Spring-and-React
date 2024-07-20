import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import './AllTransfers.css';
import Loader from '../ui/Loader';
import Transfer from './Transfer';
import Modal from '../ui/Modal';

export default function AllTransfers({ accountId, accountName, onCloseModal }) {
    const [retrieveMoreDocuments, setRetrieveMoreDocuments] = useState({
        status: 'initial',
        data: [],
        error: null,
        paged: 1,
    });

    const { fetcher, data, status, error } = useFetch({
        url: process.env.REACT_APP_SHOW_ALL_TRANSFERS + '/' + accountId,
        method: 'GET',
        onSuccess: (data) =>
            setRetrieveMoreDocuments((prev) => ({ ...prev, data })),
    });

    useEffect(() => {
        fetcher();
    }, [accountId]);

    const handleClickOnOverlay = (e) => {
        onCloseModal();
    };

    let transfers;

    // Transfers
    if (status === 'finish' && !error) {
        if (retrieveMoreDocuments.data.content?.length > 0) {
            transfers = (
                <>
                    <h2>Transfers for {accountName}</h2>
                    <small>
                        Click on on the rows to show more info about the
                        transfer
                    </small>
                    <ul>
                        {retrieveMoreDocuments.data.content?.map((el) => (
                            <Transfer key={el.id} el={el} />
                        ))}
                    </ul>
                </>
            );
        } else {
            transfers = <h2>No transfers for {accountName}</h2>;
        }
    }

    // Handle retrieve more documents | keep the pagination
    const handleRetrieveMoreDocuments = async () => {
        setRetrieveMoreDocuments((prev) => ({ ...prev, status: 'loading' }));

        try {
            const response = await fetch(
                process.env.REACT_APP_SHOW_ALL_TRANSFERS +
                    '/' +
                    accountId +
                    '?size=' +
                    data.content.length +
                    '&page=' +
                    retrieveMoreDocuments.paged
            );
            if (response.ok) {
                const data = await response.json();

                if (data.content.length > 0) {
                    setRetrieveMoreDocuments((prev) => ({
                        ...prev,
                        status: 'finish',
                        data: {
                            ...prev.data,
                            ...data,
                            content: prev.data.content.concat(data.content),
                        },
                        paged: prev.paged + 1,
                    }));
                }
            }
        } catch (error) {
            setRetrieveMoreDocuments((prev) => ({
                ...prev,
                status: 'finish',
                error: error.message,
            }));
        }
    };

    // Load more button
    let loadMore;
    if (
        retrieveMoreDocuments.data.pageable?.pageNumber + 1 <
        retrieveMoreDocuments.data.totalPages
    ) {
        loadMore = (
            <button
                className="load-more"
                type="button"
                onClick={handleRetrieveMoreDocuments}
            >
                Load more
            </button>
        );
    }

    return (
        <Modal onCloseModal={handleClickOnOverlay}>
            <div className="transfers-list overflow-auto">
                {/* Loading */}
                {status === 'loading' && (
                    <div className="transfers-list__loader-wrapper">
                        <Loader />
                    </div>
                )}

                <div>{transfers}</div>

                {loadMore}
            </div>
        </Modal>
    );
}
