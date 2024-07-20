import { useEffect, useRef, useState } from 'react';
import './AddNewAccount.css';
import useFetch from '../../hooks/useFetch';
import Alert from '../ui/Alert';
import Loader from '../ui/Loader';

export default function AddNewAccount({ onDisableButtons, onRevalidateCache }) {
    const { fetcher, status, error, reasons } = useFetch({
        method: 'POST',
        url: process.env.REACT_APP_ADD_ACCOUNT,
    });

    // Show/hide alert
    const [hideAlert, setHideAlert] = useState(false);

    // State to hold the formData
    const [formState, setFormState] = useState({
        name: 'dada',
        iban: 'dada',
        status: 'active',
        availableAmount: '12412',
    });

    // Timer to hide the alert
    let timer = useRef(null);
    let nameRef = useRef(null);

    // Update the formState data based on the key : name | iban | status | availableAmount
    const handleUpdateState = (key, e) =>
        setFormState((prev) => ({ ...prev, [key]: e.target.value }));

    // Derivative variable, holding if the formState is not completely empty
    let notEmptyState = Object.values(formState).every((el) => el !== '');

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset alert state
        setHideAlert(false);
        // Disable sidebar buttons
        onDisableButtons(true);

        if (notEmptyState) {
            await fetcher({
                name: formState.name,
                iban: formState.iban,
                status: formState.status,
                availableAmount: formState.availableAmount,
            });

            onRevalidateCache();
        }

        nameRef.current.focus();

        // Enable sidebar buttons
        onDisableButtons(false);

        if (!error) {
            timer.current = setTimeout(() => {
                setHideAlert(true);
            }, 4000);
        }
    };

    useEffect(() => {
        return () => clearTimeout(timer.current);
    }, []);

    useEffect(() => {
        if (reasons && reasons.length > 0) {
            setFormState((prev) => ({
                name: reasons?.includes('name') ? '' : prev.name,
                iban: reasons?.includes('iban') ? '' : prev.iban,
                status: reasons?.includes('status') ? '' : prev.status,
                availableAmount: reasons?.includes('availableAmount')
                    ? ''
                    : prev.availableAmount,
            }));
        } else {
            if (status === 'finish') {
                setFormState((prev) => ({
                    name: '',
                    iban: '',
                    status: '',
                    availableAmount: '',
                }));
            }
        }
    }, [reasons, status]);

    // Apply disabled class
    let toDisable = !notEmptyState || status === 'loading';

    return (
        <form className="add-account__form" onSubmit={handleSubmit}>
            {/* Show Alert */}
            {status === 'finish' && !error && !hideAlert && (
                <Alert>Account was added</Alert>
            )}

            {/* Loader */}
            {status === 'loading' && <Loader />}

            {/* Show Error */}
            {error && <h4 className="error">{error}</h4>}
            <h2>Add new account</h2>
            <div
                className={`input ${
                    reasons?.includes('name') ? 'error-input' : ''
                }`}
            >
                <input
                    ref={nameRef}
                    autoFocus
                    type="text"
                    id="name"
                    value={formState.name}
                    onChange={handleUpdateState.bind(null, 'name')}
                />
                <label
                    htmlFor="name"
                    className={formState.name !== '' ? 'focused' : ''}
                >
                    Name
                </label>
            </div>
            <div
                className={`input ${
                    reasons?.includes('iban') ? 'error-input' : ''
                }`}
            >
                <input
                    type="text"
                    id="iban"
                    value={formState.iban}
                    onChange={handleUpdateState.bind(null, 'iban')}
                />
                <label
                    htmlFor="iban"
                    className={formState.iban !== '' ? 'focused' : ''}
                >
                    IBAN
                </label>
            </div>
            <div
                className={`input ${
                    reasons?.includes('status') ? 'error-input' : ''
                }`}
            >
                <input
                    type="text"
                    id="status"
                    value={formState.status}
                    onChange={handleUpdateState.bind(null, 'status')}
                />
                <label
                    htmlFor="status"
                    className={formState.status !== '' ? 'focused' : ''}
                >
                    Status
                </label>
            </div>
            <div
                className={`input ${
                    reasons?.includes('availableAmount') ? 'error-input' : ''
                }`}
            >
                <input
                    type="text"
                    id="availableAmount"
                    value={formState.availableAmount}
                    onChange={handleUpdateState.bind(null, 'availableAmount')}
                />
                <label
                    htmlFor="availableAmount"
                    className={
                        formState.availableAmount !== '' ? 'focused' : ''
                    }
                >
                    Available amount
                </label>
            </div>
            <button
                type="submit"
                disabled={toDisable}
                className={toDisable ? 'disabled' : ''}
            >
                Add new account
            </button>
        </form>
    );
}
