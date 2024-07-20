import './App.css';
import Sidebar from './components/ui/Sidebar';
import { createContext, useEffect, useState } from 'react';
import CreatedAccounts from './components/accounts/CreatedAccounts';
import AddNewAccount from './components/accounts/AddNewAccount';
import CreateTransfer from './components/transfers/CreateTransfer';
import useFetch from './hooks/useFetch';

export const RevalidateCacheContext = createContext('');

function App() {
    const [activeItem, setActiveItem] = useState('created-accounts');
    // Disable items if some AJAX is happening
    const [disableButtons, setDisableButtons] = useState(false);

    // Count account documents
    const [countDocuments, setCountDocuments] = useState(0);

    // Cache to the retrieval of the accounts
    const [accountsCache, setAccountsCache] = useState({
        cache: false,
        data: [],
    });

    const { fetcher, status, data, error } = useFetch({
        method: 'GET',
        url: process.env.REACT_APP_SHOW_ACCOUNTS,
        onSuccess: (data) =>
            setAccountsCache({
                cache: true,
                data,
            }),
    });

    // Change active item
    const handleChangeActiveItem = (newItem) => setActiveItem(newItem);

    // Handle disable button
    const handleDisableButtons = (val) => setDisableButtons(val);

    // Handle revalidate cache
    const handleRevalidateCache = () => {
        setAccountsCache({
            cache: false,
            data: [],
        });
    };

    useEffect(() => {
        if (activeItem === 'created-accounts' && !accountsCache.cache) {
            // Fetch accounts
            fetch(process.env.REACT_APP_COUNT_DOCUMENTS)
                .then((res) => res.json())
                .then(async (data) => {
                    setCountDocuments(data);
                    await fetcher();
                });
        }
    }, [activeItem, accountsCache]);

    return (
        <main className="App">
            <Sidebar
                activeItem={activeItem}
                onChangeActiveItem={handleChangeActiveItem}
                toDisableButtons={disableButtons}
            />

            <section className="main-wrapper">
                {/* Show created accounts */}
                {activeItem === 'created-accounts' && (
                    <RevalidateCacheContext.Provider
                        value={{ onRevalidateCache: handleRevalidateCache }}
                    >
                        <CreatedAccounts
                            accounts={accountsCache.data}
                            status={status}
                            error={error}
                            countDocuments={countDocuments}
                        />
                    </RevalidateCacheContext.Provider>
                )}

                {/* Show add new account form */}
                {activeItem === 'add-new-account' && (
                    <AddNewAccount
                        onDisableButtons={handleDisableButtons}
                        onRevalidateCache={handleRevalidateCache}
                    />
                )}

                {/* Show create bank transfer form */}
                {activeItem === 'create-bank-transfer' && (
                    <CreateTransfer onDisableButtons={handleDisableButtons} />
                )}
            </section>
        </main>
    );
}

export default App;
