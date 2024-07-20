import { useEffect, useRef, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import './EditStatus.css';
import Loader from '../ui/Loader';
import Alert from '../ui/Alert';
import Modal from '../ui/Modal';

export default function EditStatus({
    accountId,
    accountName,
    accountStatus,
    onCloseModal,
}) {
    // Status text
    const [statusText, setStatusText] = useState(accountStatus);
    // Show/hide alert
    const [toHideAlert, setToHideAlert] = useState(false);

    // Change status text
    const handleChangeStatusText = () => {
        setStatusText((prev) => {
            if (prev === 'active') return 'frozen';
            else return 'active';
        });
    };

    // Status text derivative variable
    let changeStatusButtonText = 'Change to ' + statusText;

    // AJAX functionality
    const { fetcher, status, data } = useFetch({
        url: process.env.REACT_APP_CHANGE_STATUS,
        method: 'PUT',
    });

    // timerRef to hold some timer which will be cleared on the dismounting the component
    let timerRef = useRef(null);
    const handleUpdateAccount = async () => {
        await fetcher({ accountId });

        setStatusText((prev) => (prev === 'freeze' ? 'active' : 'freeze'));

        timerRef.current = setTimeout(() => {
            setToHideAlert(true);
        }, 4000);
    };

    useEffect(() => {
        // Clear the timer
        return () => clearTimeout(timerRef.current);
    }, []);

    let toDisable = status === 'loading' ? true : false;
    let toShowAlert = data === true && status === 'finish' && !toHideAlert;

    return (
        <Modal
            onCloseModal={onCloseModal}
            onPreventClosingModal={status === 'loading'}
        >
            <div className="account-status__inner overflow-auto">
                <div className="account-status">
                    <h3>{accountName}</h3>
                    <button
                        type="button"
                        className="button-status"
                        onClick={handleChangeStatusText}
                    >
                        {statusText}
                    </button>
                </div>

                {/* Show alert */}
                {toShowAlert && <Alert>Status changed</Alert>}

                {/* Loading */}
                {status === 'loading' && (
                    <div className="change-status__loader-wrapper">
                        <Loader />
                    </div>
                )}

                <button
                    type="button"
                    className={`button-change-status ${
                        toDisable ? 'disabled' : ''
                    }`}
                    disabled={toDisable}
                    onClick={handleUpdateAccount}
                >
                    {changeStatusButtonText}
                </button>
            </div>
        </Modal>
    );
}
