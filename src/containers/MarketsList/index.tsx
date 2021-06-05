import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ConvertUsd, Decimal, MarketsHotOnlist, MarketTable } from '../../components';

import Tabs, { TabPane } from 'rc-tabs';
import styled from 'styled-components';

import { useMarketsFetch, useMarketsTickersFetch, useRangerConnectFetch } from '../../hooks';
import { Market, selectMarkets, selectMarketTickers, setCurrentMarket } from '../../modules';

import classNames from 'classnames';

const defaultTicker = {
	amount: '0.0',
	last: '0.0',
	high: '0.0',
	open: '0.0',
	low: '0.0',
	price_change_percent: '+0.00%',
	volume: '0.0',
};

const MarketsContainerStyles = styled.div`
	.active_id {
		fill: #f9c74f;
		color: #f9c74f;
	}

	margin-bottom: 35px;
`;

const TradeButtonStyles = styled.button`
	width: 62px;
	height: 32px;
	background: #313445;
	border: 0.5px solid #848e9c;
	box-sizing: border-box;
	border-radius: 4px;
	color: #2fb67e;
	outline: none;
`;
const MarketListFilsStyle = styled.div`
	width: 100%;
	background-color: rgb(49, 52, 69);
	.rc-tabs {
		padding: 0 18px;
	}
	.rc-tabs-nav {
		display: flex;
		justify-content: space-between;
		margin-bottom: 30px;
		border-bottom: 1px solid #999;

		.rc-tabs-nav-wrap {
			padding: 20px 0px 0 0;

			.rc-tabs-nav-list {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;

				.rc-tabs-tab {
					font-size: 14px;
					font-weight: 600;
					height: 40px;
					cursor: pointer;
					margin-right: 40px;
				}
				.rc-tabs-tab-active {
					font-weight: bold;
					color: #fff;
					border-bottom: 2px solid rgb(47, 182, 126);
				}
			}
		}
		.rc-tabs-extra-content {
			align-items: center;
			display: flex;
		}
		.rc-tabs-content {
			padding: 0 20px;
		}
	}
`;
const SearchCoinWrap = styled.div`
	border: solid 1px var(--input-border-color);
	border-radius: 4px;
	display: flex;
	height: calc(var(--big-gap) * 0.6);
	margin: 4px;
	overflow: hidden;

	input {
		background: none;
		border: none;
		color: var(--input-text-color);
		font-size: calc(var(--big-gap) * 0.25);
		line-height: calc(var(--big-gap));
		outline: none;
		padding: 0 calc(var(--big-gap) * 0.1);
		width: calc(100% - calc(var(--big-gap) * 0.6));
	}
`;
const SearchCoinWrapIcon = styled.div`
	align-items: center;
	border-right: solid 1px var(--input-border-color);
	display: flex;
	height: 100%;
	justify-content: center;
	width: calc(var(--big-gap) * 0.6);

	img {
		margin: 0;
	}
`;
export const MarketsList = props => {
	const favoritemMarketsLocal = JSON.parse(localStorage.getItem('favourites_markets') || '[]');
	const [marketIdsLocalState, setMarketIdsLocalState] = React.useState<string[]>(favoritemMarketsLocal);
	const [searchMarketInputState, setSearchMarketInputState] = React.useState('');

	useMarketsFetch();
	useMarketsTickersFetch();
	useRangerConnectFetch();
	const history = useHistory();
	const dispatch = useDispatch();
	const markets = useSelector(selectMarkets);
	const marketTickers = useSelector(selectMarketTickers);

	const handleRedirectToTrading = (id: string) => {
		const currentMarket: Market | undefined = markets.find(item => item.id === id);
		if (currentMarket) {
			props.handleChangeCurrentMarket && props.handleChangeCurrentMarket(currentMarket);
			dispatch(setCurrentMarket(currentMarket));
			history.push(`/trading/${currentMarket.id}`);
		}
	};

	const formatFilteredMarkets = (list: string[], market: Market) => {
		if (!list.includes(market.quote_unit)) {
			list.push(market.quote_unit);
		}

		return list;
	};

	let currentBidUnitsList: string[] = [''];

	if (markets.length > 0) {
		currentBidUnitsList = markets.reduce(formatFilteredMarkets, currentBidUnitsList);
	}

	const currentBidUnitMarkets = (props.markets || markets) as typeof markets;

	const clickFavoritesMarket = (id: string) => {
		const local = localStorage.getItem('favourites_markets') || '[]';
		const favouritesMarkets = JSON.parse(local);

		const foundFavoriteMarketIndex = favouritesMarkets.findIndex(
			(marketId: string) => marketId.toLowerCase() === id.toLowerCase(),
		);
		if (foundFavoriteMarketIndex >= 0) {
			favouritesMarkets.splice(foundFavoriteMarketIndex, 1);
			localStorage.setItem('favourites_markets', JSON.stringify(favouritesMarkets));
		} else {
			favouritesMarkets.push(id);
			localStorage.setItem('favourites_markets', JSON.stringify(favouritesMarkets));
		}

		const newLocal = localStorage.getItem('favourites_markets') || '[]';
		setMarketIdsLocalState(JSON.parse(newLocal));
	};

	const formattedMarkets = currentBidUnitMarkets.length
		? currentBidUnitMarkets
				.map(market => ({
					...market,
					last: Decimal.format(Number((marketTickers[market.id] || defaultTicker).last), market.price_precision),
					open: Decimal.format(Number((marketTickers[market.id] || defaultTicker).open), market.price_precision),
					price_change_percent: String((marketTickers[market.id] || defaultTicker).price_change_percent),
					high: Decimal.format(Number((marketTickers[market.id] || defaultTicker).high), market.price_precision),
					low: Decimal.format(Number((marketTickers[market.id] || defaultTicker).low), market.price_precision),
					volume: Decimal.format(Number((marketTickers[market.id] || defaultTicker).volume), market.amount_precision),
				}))
				.map(market => ({
					...market,
					change: Decimal.format((+market.last - +market.open).toFixed(market.price_precision), market.price_precision),
				}))
				.filter(
					market =>
						market.base_unit.includes(searchMarketInputState) || market.quote_unit.includes(searchMarketInputState),
				)
				.map(market => {
					const marketChangeColor = +(market.change || 0) < 0 ? '#E01E5A' : '#2FB67E';
					const marketName = market.name.split('/');
					const svgClass = classNames(marketIdsLocalState.includes(market.id) ? 'active_id' : '');

					return {
						...market,
						pair: (
							<div className="d-flex flex-row align-items-center">
								<svg
									onClick={() => clickFavoritesMarket(market.id)}
									width="20"
									height="20"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										className={svgClass}
										d="M10 14.3917L15.15 17.5L13.7834 11.6417L18.3334 7.69999L12.3417 7.19166L10 1.66666L7.65835 7.19166L1.66669 7.69999L6.21669 11.6417L4.85002 17.5L10 14.3917Z"
										fill="#848E9C"
									/>
								</svg>

								<span style={{ color: '#fff', marginLeft: 8 }}>{marketName[0]}</span>
								<span style={{ color: '#737f92' }}>/</span>
								<span style={{ color: '#737f92' }}>{marketName[1]}</span>
							</div>
						),
						last: (
							<span style={{ color: marketChangeColor }}>
								{market.last}
								<p className="m-0" style={{ color: 'rgb(115 127 146)' }}>
									$ <ConvertUsd value={+market.last} symbol={marketName[1]} />
								</p>
							</span>
						),
						open: <span style={{ color: marketChangeColor }}>{market.open}</span>,
						change: <span style={{ color: marketChangeColor }}>{market.change}</span>,
						volume: <span style={{ color: marketChangeColor }}>{market.volume}</span>,
						price_change_percent: <span style={{ color: marketChangeColor }}>{market.price_change_percent}</span>,
						trade: <TradeButtonStyles onClick={() => handleRedirectToTrading(market.id)}>Trade</TradeButtonStyles>,
					};
				})
		: [];
	const FavoriteMarkets = formattedMarkets.filter((e: any) => marketIdsLocalState.includes(e.id));

	const handldeSearchInputChange = (e: any) => {
		setSearchMarketInputState(e.target.value);
	};
	const MarketsTabs = () => {
		return (
			<MarketListFilsStyle>
				<Tabs
					defaultActiveKey="Spot Markets"
					tabBarExtraContent={
						<SearchCoinWrap>
							<SearchCoinWrapIcon>
								<img alt="" src={require('./icon/search.svg')} />
							</SearchCoinWrapIcon>
							<input type="text" placeholder="search coin name..." onChange={handldeSearchInputChange} />
						</SearchCoinWrap>
					}
				>
					<TabPane tab="Favorites" key="Favorites">
						<MarketTable columns={columns} data={FavoriteMarkets} />
					</TabPane>
					<TabPane tab="Spot Markets" key="Spot Markets">
						<MarketTable columns={columns} data={formattedMarkets} />
					</TabPane>
				</Tabs>
			</MarketListFilsStyle>
		);
	};
	const MarketsHotOnList = () => {
		return (
			<React.Fragment>
				<MarketsHotOnlist />
			</React.Fragment>
		);
	};
	const columns = React.useMemo(() => {
		return [
			{
				Header: 'Pair',
				accessor: 'pair',
			},
			{
				Header: 'Last Price',
				accessor: 'last',
			},
			{
				Header: '24h Change',
				accessor: 'price_change_percent',
			},
			{
				Header: '24h High',
				accessor: 'high',
			},
			{
				Header: '24h Low',
				accessor: 'low',
			},
			{
				Header: '24h Volume',
				accessor: 'volume',
			},
			{
				Header: 'Edit',
				accessor: 'trade',
			},
		];
	}, []);

	return (
		<MarketsContainerStyles>
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div>{MarketsHotOnList()}</div>
						<div>{MarketsTabs()}</div>
					</div>
				</div>
			</div>
		</MarketsContainerStyles>
	);
};

export const MarketsTableScreen = React.memo(MarketsList);
