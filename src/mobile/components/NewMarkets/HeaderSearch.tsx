import classNames from 'classnames';
import React, { useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { FaSearch } from 'react-icons/fa';

interface SearchProps {
	backToAll: () => void;
	onSearch: (pageIndex: string) => void;
}

export const HeaderSearch: React.FC<SearchProps> = ({ onSearch, backToAll }) => {
	const [isOpenInput, setIsOpenInput] = useState(true);
	const [valueSearch, setValueSearch] = useState('');

	const nonSearch = classNames('td-mobile-new-market__header', { 'd-none': !isOpenInput }, { 'td-mobile-new-market__header--show': isOpenInput });
	const search = classNames(
		'td-mobile-new-market__header-search ',
		{ 'd-none': isOpenInput },
		{ 'td-mobile-new-market__header-search--show': !isOpenInput },
	);

	const openForm = value => {
		if (value) {
			setIsOpenInput(false);
		} else {
			setValueSearch('');
			backToAll();
			setIsOpenInput(true);
		}
	};

	const onChangeInput = e => {
		if (e.target.value === '') {
			backToAll();
		}
		onSearch(e.target.value);
		setValueSearch(e.target.value);
	};

	return (
		<div>
			<div className={nonSearch}>
				<div className="td-mobile-new-market__header__title">Market</div>

				<div className="td-mobile-new-market__header__search " onClick={() => openForm(true)}>
					<FaSearch />
				</div>
			</div>
			<div className={search}>
				<div className="td-mobile-new-market__header-search__input input-group">
					<span>
						<FaSearch />
					</span>

					<DebounceInput
						className="form-control w-100"
						value={valueSearch}
						placeholder="Tìm kiếm các thẻ"
						minLength={1}
						debounceTimeout={300}
						onChange={onChangeInput}
					/>
				</div>
				<div className="td-mobile-new-market__header-search__desc" onClick={() => openForm(false)}>
					Hủy
				</div>
			</div>
		</div>
	);
};
