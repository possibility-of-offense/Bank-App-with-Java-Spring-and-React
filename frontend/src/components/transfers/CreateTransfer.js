import { useEffect, useRef, useState } from 'react';
import './CreateTransfer.css';
import useFetch from '../../hooks/useFetch';
import FromUsers from './FromUsers';
import Loader from '../ui/Loader';
import ToUsers from './ToUsers';
import Alert from '../ui/Alert';

export default function CreateTransfer({ onDisableButtons }) {
    // Transfer data
    const [transfer, setTransfer] = useState({
        amount: '',
        maxAmount: null,
        from: null,
        to: null,
        type: null,
    });

    // Create transfer state
    const [createTransferState, setCreateTransferState] = useState({
        status: 'initial',
    });

    // Store original and temporary (filtered) users
    const [users, setUsers] = useState({
        original: [],
        temporary: [],
    });
    // Overdue amount limit
    const [overdueAmountLimitError, setOverdueAmountLimitError] = useState('');

    // To show alert
    const [showAlert, setShowAlert] = useState(false);

    // Timer ref
    const timerRef = useRef(null);

    // Handle change amount
    const handleChangeAmount = (e) => {
        if (parseFloat(e.target.value) > transfer.maxAmount) {
            setOverdueAmountLimitError('Amount limit overdued!');
        } else {
            setTransfer((prev) => ({ ...prev, amount: e.target.value }));
        }
    };

    // Handle change type
    const handleChangeType = (e) =>
        setTransfer((prev) => ({ ...prev, type: e.target.value }));

    const handleFilterUsers = (user) =>
        setUsers((prev) => ({
            ...prev,
            temporary: prev.original.filter((u) => u.id !== user),
        }));

    const { fetcher, status } = useFetch({
        url: process.env.REACT_APP_SHOW_ACCOUNTS,
        method: 'GET',
        onSuccess: (data) => setUsers((prev) => ({ ...prev, original: data })),
    });

    const handleSetUser = async (type, id) => {
        try {
            // Fetch available amount for the user
            const response = await fetch(
                process.env.REACT_APP_SHOW_ACCOUNT + '/' + id,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();

                if (data) {
                    setTransfer((prev) => ({
                        ...prev,
                        [type]: id,
                        maxAmount: data.availableAmount,
                    }));
                }
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleCreateTransfer = async () => {
        clearTimeout(timerRef.current);

        setCreateTransferState({ status: 'loading' });

        // Disable sidebarbutton
        onDisableButtons(true);

        try {
            const response = await fetch(
                process.env.REACT_APP_CREATE_TRANSFER,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        accountId: transfer.from,
                        beneficiaryAccountId: transfer.to,
                        amount: transfer.amount,
                        type: transfer.type,
                    }),
                }
            );

            if (response.ok) {
                await response.json();

                setShowAlert(true);

                timerRef.current = setTimeout(() => {
                    setShowAlert(false);
                }, 4000);
            }
        } catch (error) {
        } finally {
            setCreateTransferState({ status: 'finish' });
            // Enable sidebar buttons
            onDisableButtons(false);
        }
    };

    useEffect(() => {
        fetcher();

        // Clear timer
        return () => clearTimeout(timerRef.current);
    }, []);

    // Disable submit button
    let disabledSubmitButton =
        !transfer.amount || !transfer.type ? 'disabled' : '';

    return (
        <div className="create-transfer__wrapper">
            {/* Loader */}
            {status === 'loading' && (
                <div className="create-transfer__loader">
                    <Loader />
                </div>
            )}

            {/* Show alert */}
            {showAlert && <Alert>Transfer completed!</Alert>}

            {status === 'finish' && users.original.length > 0 && (
                <>
                    <div className="create-transfer__inner">
                        <div className="create-transfer__from-account">
                            <h5>From</h5>
                            <div className="create-transfer__from-users">
                                <FromUsers
                                    fromUser={transfer.from}
                                    users={users.original}
                                    onSetUser={handleSetUser.bind(null, 'from')}
                                    onFilterUsers={handleFilterUsers}
                                />
                            </div>
                        </div>
                        <div className="create-transfer__to-account">
                            <h5>To</h5>
                            <div className="create-transfer__to-users">
                                <ToUsers
                                    toUser={transfer.to}
                                    users={users.temporary}
                                    onSetUser={handleSetUser.bind(null, 'to')}
                                />
                            </div>
                        </div>
                        <div className="create-transfer__amount">
                            {overdueAmountLimitError && (
                                <p className="error">
                                    {overdueAmountLimitError}
                                </p>
                            )}
                            <input
                                disabled={!transfer.maxAmount}
                                type="number"
                                placeholder="Amount"
                                value={transfer.amount}
                                onChange={handleChangeAmount}
                            />
                            <div className="create-transfer__radio-buttons">
                                <input
                                    type="radio"
                                    name="type"
                                    value="debit"
                                    onClick={handleChangeType}
                                />
                                Debit
                                <br />
                                <input
                                    type="radio"
                                    name="type"
                                    value="credit"
                                    onClick={handleChangeType}
                                />
                                Credit
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleCreateTransfer}
                        disabled={!transfer.amount || !transfer.type}
                        className={disabledSubmitButton}
                    >
                        {createTransferState.status === 'loading' ? (
                            <Loader />
                        ) : (
                            'Send'
                        )}
                    </button>
                </>
            )}

            {status === 'finish' && users.original.length === 0 && (
                <h2>No users yet!</h2>
            )}
        </div>
    );
}
