import { useState } from 'react';

export default function useFetch({ method, url, onSuccess = null }) {
    const [state, setState] = useState({
        status: 'initial',
        data: [],
        error: null,
        reasons: null,
    });

    const fetcher = async (body = null) => {
        setState({
            status: 'loading',
            data: [],
            error: null,
            reasons: null,
        });

        try {
            let fetchOptions = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (method === 'POST' || method === 'PUT') {
                fetchOptions['method'] = method;
                fetchOptions['body'] = JSON.stringify(body);
            }

            const res = await fetch(url, fetchOptions);

            if (res.ok) {
                const data = await res.json();

                // Apply fake delay
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                });

                setState({
                    status: 'finish',
                    data,
                    error: null,
                    reasons: null,
                });

                if (onSuccess) {
                    onSuccess(data);
                }
            } else {
                const errorData = await res.json();

                throw new Error(JSON.stringify(errorData));
            }
        } catch (error) {
            const parsedError = JSON.parse(error.message);

            let errorType;
            let errorText;
            let mockFields = [];

            if (parsedError.message.includes('StatusEnum')) {
                errorType = 'status';
                errorText = 'Status must be either active or freeze';
                mockFields.push('status');
            } else if (parsedError.message.includes('IBAN is not unique!')) {
                errorType = 'iban';
                errorText = 'IBAN is not unique!';
                mockFields.push('iban');
            }

            setState((prev) => ({
                ...prev,
                data: null,
                status: 'finish',
                error:
                    errorType !== ''
                        ? errorText
                        : parsedError.errors?.join('\n | '),
                reasons: parsedError.hasOwnProperty('fields')
                    ? parsedError.fields
                    : mockFields,
            }));
        }
    };

    return {
        fetcher,
        ...state,
    };
}
