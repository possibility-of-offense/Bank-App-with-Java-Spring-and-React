import { useEffect, useState } from 'react';

export default function useQuery({ data, countDocuments }) {
    const [query, setQuery] = useState({
        page: 0,
        size: process.env.REACT_APP_QUERY_ACCOUNTS,
        maxPages: 0,
    });

    const [ajax, setAjax] = useState({
        status: 'initial',
        error: null,
        data: [],
    });

    useEffect(() => {
        if (data) {
            setAjax((prev) => ({ ...prev, data }));
            setQuery((prev) => ({ ...prev, maxPages: countDocuments }));
        }
    }, [data, countDocuments]);

    return {
        ...ajax,
        query,
        onSetAjax: setAjax,
        onSetQuery: setQuery,
    };
}
