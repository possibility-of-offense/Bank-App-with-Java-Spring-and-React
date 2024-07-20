import './ShowAccount.css';
import Modal from '../ui/Modal';
import useFetch from '../../hooks/useFetch';
import { useEffect, useState } from 'react';
import Loader from '../ui/Loader';
import EditForm from './EditForm';

export default function ShowAccount({ onCloseModal, accountId }) {
    const { fetcher, data, status } = useFetch({
        url: process.env.REACT_APP_SHOW_ACCOUNT + '/' + accountId,
        method: 'GET',
    });

    useEffect(() => {
        // Fetch account data
        fetcher();
    }, []);

    const [showEditForm, setShowEditForm] = useState(false);

    // Show edit form
    const handleShowEditForm = () => setShowEditForm(true);

    let accountInfo;
    let editForm;
    if (!showEditForm) {
        accountInfo = status === 'finish' && data && (
            <>
                <p>
                    <strong>Name: </strong>
                    {data.name}
                </p>
                <p>
                    <strong>IBAN: </strong>
                    {data.iban}
                </p>
                <p>
                    <strong>Status: </strong>
                    {data.status}
                </p>
                <p>
                    <strong>Available Amount: </strong>
                    {data.availableAmount}
                </p>
                <br />
                <button
                    type="button"
                    className="edit-account__button"
                    onClick={handleShowEditForm}
                >
                    Edit account
                </button>
            </>
        );
    } else if (showEditForm) {
        editForm = (
            <EditForm
                accountId={accountId}
                name={data.name}
                iban={data.iban}
                status={data.status}
                availableAmount={data.availableAmount}
                onCloseModal={onCloseModal}
            />
        );
    }

    return (
        <Modal onCloseModal={onCloseModal}>
            {/* Show loader */}
            {status === 'loading' && <Loader />}

            <div className="account-info__inner overflow-auto">
                {/* Account info */}
                {accountInfo}

                {/* Edit Form */}
                {editForm}
            </div>
        </Modal>
    );
}
