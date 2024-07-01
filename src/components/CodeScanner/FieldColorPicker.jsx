import React from 'react';
import styled from 'styled-components';

import { SketchPicker } from 'react-color';

import Admin from 'hive-admin';
import FieldText from 'hive-admin/src/components/FieldText';

import { Tooltip } from '../common/components/Popover';

const ColorPickerTooltip = styled(Tooltip)`
	.ant-popover-inner-content {
		padding: 0px;
	}
`;

const ColorPicker = styled(SketchPicker)`
	box-shadow: none !important;
	> .flexbox-fix:nth-child(2) {
		margin-top: 8px;
	}
	> .flexbox-fix:nth-child(3) {
		display: none !important;
	}
	> .flexbox-fix:nth-child(4) {
		border: 0px !important;
	}
`;

const ColorBox = styled.div`
	width: 14px;
	height: 14px;
	border-radius: 50%;
	transform: translate(-1px, -1px);
`;

const Prefix = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

export default class FieldColorPicker extends FieldText {
	constructor(props) {
		super(props);
		this.state = this.state || {};
		this.state.currentColor = this.props.value;
		this.state.currentColorChanging = false;
	}

	renderInput(props) {
		const value = this.state.currentColorChanging
			? this.state.currentColor
			: this.props.value;
		return (
			<ColorPickerTooltip
				title={
					<ColorPicker
						disableAlpha
						color={value}
						onChange={({ hex }) =>
							this.setState({
								currentColorChanging: true,
								currentColor: hex,
							})
						}
						onChangeComplete={({ hex }) => {
							this.setState({
								currentColorChanging: false,
								currentColor: hex,
							});
							this.props.onChange(hex);
						}}
					/>
				}
			>
				{super.renderInput({
					...props,
					value,
					prefix: (
						<Prefix>
							<ColorBox style={{ background: value }} />
							&nbsp; Color:
						</Prefix>
					),
				})}
			</ColorPickerTooltip>
		);
	}
}

Admin.addToLibrary('FieldColorPicker', (config) =>
	FieldColorPicker.create(config)
);
