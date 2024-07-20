import './Pagination.css';

export default function Pagination({ query, onNextPage, onPreviousPage }) {
    const { page, size, maxPages } = query;

    let prev;
    let next;

    if (page === maxPages) {
        prev = (
            <button type="button" onClick={onPreviousPage}>
                Previous
            </button>
        );
    } else if (page === 0) {
        next = (
            <button type="button" onClick={onNextPage}>
                Next
            </button>
        );
    } else {
        if (page < maxPages) {
            prev = (
                <button type="button" onClick={onPreviousPage}>
                    Previous
                </button>
            );
        } else if (page > maxPages) {
            next = (
                <button type="button" onClick={onNextPage}>
                    Next
                </button>
            );
        }
    }

    return (
        <div className="pagination">
            {prev}

            {next}
        </div>
    );
}
