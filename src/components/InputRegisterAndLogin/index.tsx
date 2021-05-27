import * as React from 'react';
import toggleInputIcon from './assets/dropdown.jpg';
export interface InputRegisterAndLoginProps {
	className?: string;
	type: string;
	label: string;
	defaultLabel: string;
	handleChangeInput?: (value: string) => void;
	inputValue: string | number;
	handleFocusInput?: () => void;
	placeholder: string;
	classNameLabel?: string;
	classNameInput?: string;
	autoFocus?: boolean;
	onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
	readOnly?: boolean;
	id?: string;
	handleClick?: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
	isDisabled?: boolean;
	labelVisible?: boolean;
	toggleInput?: boolean | undefined;
	isInvalid?: boolean;
}

interface OnChangeEvent {
	target: {
		value: string;
	};
}
type Props = InputRegisterAndLoginProps;

const InputRegisterAndLogin: React.FC<Props> = props => {
	const handleChangeValue = (e: OnChangeEvent) => {
		props.handleChangeInput && props.handleChangeInput(e.target.value);
	};

	const [toggle, setToggle] = React.useState(props.toggleInput);
	const handleClicktoggleInput = () => {
		if (props.toggleInput) {
			setToggle(!toggle);
		}
	};
	return (
		<div id="custom-input-register-login" className={props.className || ''}>
			<label
				htmlFor="email"
				className={props.classNameLabel}
				onClick={() => {
					handleClicktoggleInput();
				}}
			>
				{props.label}
				{props.toggleInput ? <img src={toggleInputIcon} className="toggle-input" /> : ''}
				{(props.labelVisible || '') && (props.label || props.defaultLabel)}
			</label>
			{!toggle ? (
				<div className="col-12">
					<input
						className={'form-control form-input' || props.classNameInput}
						name="email"
						required
						type={props.type.toString()}
						// value={props.inputValue.toString()}
						placeholder={props.placeholder}
						autoFocus={props.autoFocus}
						onFocus={props.handleFocusInput}
						onBlur={props.handleFocusInput}
						onChange={e => handleChangeValue(e)}
						readOnly={props.readOnly}
						id={props.id}
						onClick={props.handleClick}
						disabled={props.isDisabled}
						onKeyPress={props.onKeyPress}
					/>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};
export { InputRegisterAndLogin };
