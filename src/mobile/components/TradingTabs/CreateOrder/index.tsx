import * as React from 'react';
import { useSelector } from 'react-redux';
import { OrderComponent } from '../../../../containers';
import { selectUserLoggedIn } from '../../../../modules';
import { OpenOrders } from '../../index';
import { OrderBook } from '../../OrderBook';

const CreateOrderComponent = props => {
	const userLoggedIn = useSelector(selectUserLoggedIn);

	return (
		<div className="pg-mobile-create-order">
			<div className="pg-mobile-create-order__row-double">
				<OrderBook />
				<OrderComponent defaultTabIndex={props.currentOrderTypeIndex as number | undefined} />
			</div>
			{userLoggedIn ? <OpenOrders /> : null}
		</div>
	);
};

export const CreateOrder = React.memo(CreateOrderComponent);
