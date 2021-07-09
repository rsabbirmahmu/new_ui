import format from 'date-fns/format';
import * as React from 'react';
import classnames from 'classnames';

import { fetchBuyHistory, selectBuyHistoryList } from './../../../../modules';
import { useDispatch, useSelector } from 'react-redux';
interface BuyHistoryProps {
	ieoID: number;
	uid: string;
}

export const BuyHistory: React.FC<BuyHistoryProps> = (props: BuyHistoryProps) => {
	const [numberPage, setNumberPage] = React.useState<number>(1);
	const listHistory = useSelector(selectBuyHistoryList);
	const pageSize = 5;
	const dispatch = useDispatch();
	React.useEffect(() => {
		dispatch(
			fetchBuyHistory({
				uid: props.uid,
				ieo_id: props.ieoID,
				page: numberPage - 1,
				pageSize: pageSize,
			}),
		);
	}, [numberPage]);
	const EmptyComponent = () => {
		return (
			<div className="col-12 d-flex justify-content-center mb-3">
				<img
					src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
					style={{ marginTop: '3rem' }}
					alt="empty"
				/>
			</div>
		);
	};
	const loadingHistory = () => {
		return (
			<div className="loading d-flex -justify-content-center">
				<div className="spinner-border text-primary m-auto" role="status">
					<span className="sr-only">Loading...</span>
				</div>
			</div>
		);
	};
	const disabledForwardClass = classnames('disable-forward');
	const renderPagination = () => {
		return (
			<nav aria-label="Page navigation">
				<ul className="pagination" style={{ justifyContent: 'flex-end' }}>
					<li className="page-item">
						<a
							className={`page-link ${numberPage === 1 ? disabledForwardClass : ''}`}
							aria-label="Previous"
							onClick={() => {
								if (numberPage > 1) {
									setNumberPage(numberPage - 1);
								}
							}}
						>
							<span aria-hidden="true">«</span>
							<span className="sr-only">Previous</span>
						</a>
					</li>
					<li className="page-item">
						<a className="page-link">{numberPage}</a>
					</li>

					<li className="page-item">
						<a
							className={`page-link ${numberPage * pageSize >= listHistory.total ? disabledForwardClass : ''}`}
							aria-label="Next"
							onClick={() => {
								if (numberPage * pageSize < listHistory.total) {
									setNumberPage(numberPage + 1);
								}
							}}
						>
							<span aria-hidden="true">»</span>
							<span className="sr-only">Next</span>
						</a>
					</li>
				</ul>
			</nav>
		);
	};
	const renderHistory = () => {
		return listHistory.payload.map(item => {
			return (
				<>
					<tr className="text-center" style={{ color: '#ffff', border: '1px solid #848e9' }}>
						<td>{Number(item.quantity)}</td>
						<td>{item.base_currency}</td>
						<td>{Number(item.total)}</td>
						<td>{item.quote_currency}</td>
						<td>{format(new Date(item.created_at), 'HH:mm:ss dd/MM/yyyy')}</td>
					</tr>
				</>
			);
		});
	};

	return (
		<div id="buy-history">
			<h2 className="text-center text-white">Your Purchase</h2>
			<div className="table-responsive-xl mb-4">
				<table className="table">
					<thead
						style={{
							background: 'rgba(0, 0, 0, 0.08)',
							borderRadius: '3px',
							boxSizing: 'border-box',
							color: '#ffff',
						}}
					>
						<tr className="text-center">
							<th>Quantity</th>
							<th>Currency</th>
							<th>Total Purchase</th>
							<th>Purchase Currency</th>
							<th>Buy Date</th>
						</tr>
						<tr></tr>
					</thead>
					<tbody>{listHistory.loading ? <></> : renderHistory()}</tbody>
				</table>
				{listHistory.loading ? loadingHistory() : !listHistory.payload.length ? EmptyComponent() : <></>}
			</div>
			{renderPagination()}
		</div>
	);
};
