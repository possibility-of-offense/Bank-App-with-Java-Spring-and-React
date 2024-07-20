import CreatedAccount from './CreatedAccount';
import './CreatedAccounts.css';
import Loader from '../ui/Loader';
import Pagination from '../ui/Pagination';
import useQuery from '../../hooks/useQuery';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import EditStatus from './EditStatus';
import AllTransfers from '../transfers/AllTransfers';
import ShowAccount from './ShowAccount';

export default function CreatedAccounts({
    accounts,
    status,
    error,
    countDocuments,
}) {
    // To open modal
    const [openModal, setOpenModal] = useState({
        modal: false,
        account: null,
    });

    // Show specific modal
    const handleOpenEditForm = (type, account, e) => {
        if (e) {
            e.preventDefault();
        }
        setOpenModal({ modal: type, account });
    };

    const {
        data,
        status: ajaxStatus,
        error: ajaxError,
        onSetAjax,
        query,
        onSetQuery,
    } = useQuery({
        data: accounts,
        countDocuments,
    });

    // Handle navigation
    const handleNavigate = async (direction) => {
        onSetAjax((prev) => ({
            ...prev,
            status: 'loading',
            error: null,
            data: [],
        }));
        try {
            onSetQuery((prev) => ({
                ...prev,
                page: direction === 'next' ? +prev.page + 1 : +prev.page - 1,
            }));

            const response = await fetch(
                process.env.REACT_APP_SHOW_ACCOUNTS +
                    '?size=' +
                    query.size +
                    '&page=' +
                    (direction === 'next' ? query.page + 1 : query.page - 1)
            );

            if (response.ok) {
                const data = await response.json();
                onSetAjax((prev) => ({ ...prev, data, status: 'finish' }));
            } else {
                throw new Error('Fetch failed!');
            }
        } catch (error) {
            onSetAjax((prev) => ({
                ...prev,
                error: error.message,
                status: 'finish',
            }));
        }
    };

    // If there are no accounts yet
    if (accounts.length === 0 && status === 'finish') {
        return <h3>No accounts yet!</h3>;
    }

    // If there is an error
    if (error || ajaxError) {
        return <h3 className="error">{error || ajaxError}</h3>;
    }

    let statusLoading = status === 'loading' || ajaxStatus === 'loading';
    let statusFinish = status === 'finish' || ajaxStatus === 'finish';

    return (
        <>
            {statusLoading && <Loader />}
            {statusFinish && (
                <>
                    {/* If it is edit form */}
                    {openModal.modal === 'edit-form' &&
                        createPortal(
                            <EditStatus
                                accountId={openModal.account.id}
                                accountName={openModal.account.name}
                                accountStatus={openModal.account.status}
                                onCloseModal={() => setOpenModal('')}
                            />,
                            document.body
                        )}

                    {/* Show all transfers */}
                    {openModal.modal === 'show-transfers' &&
                        createPortal(
                            <AllTransfers
                                accountId={openModal.account.id}
                                accountName={openModal.account.name}
                                onCloseModal={() => setOpenModal('')}
                            />,
                            document.body
                        )}

                    {/* Show account info */}
                    {openModal.modal === 'show-account' && (
                        <ShowAccount
                            accountId={openModal.account.id}
                            onCloseModal={() => setOpenModal('')}
                        />
                    )}
                    <table className="created-accounts__grid">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>IBAN</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {ajax.data.slice(0, 10).map((account) => ( */}
                            {data.slice(0, 10).map((account) => (
                                <CreatedAccount
                                    key={account.id}
                                    account={account}
                                    onSetModal={handleOpenEditForm}
                                />
                            ))}
                        </tbody>
                    </table>

                    <Pagination
                        query={query}
                        onNextPage={handleNavigate.bind(null, 'next')}
                        onPreviousPage={handleNavigate.bind(null, 'prev')}
                    />
                </>
            )}
        </>
    );
}
