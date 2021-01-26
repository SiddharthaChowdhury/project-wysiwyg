import React from "react";
import {ColorPicker, IColorPickerProps} from "./ColorPicker";
import "./colorPickerPopup.scss";
import {Popup} from "../popup/Popup";

interface IColorPickerPopupProps extends IColorPickerProps {
    trigger?: any;
    defaultColor?: string;
    label?: string;
    header?: string;
    hideColorString?: boolean;
}
// TODO: YET TO BE DONE (Incomplete) [align popup]

export const ColorPickerPopup: React.FC<IColorPickerPopupProps> = (props) => {
    const {trigger: Trigger, defaultColor, label, header, onChange, hideColorString, ...rest} = props;
    const [triggerColor, getTriggerColor] = React.useState(defaultColor || 'silver');

    const getTrigger = () => {
        if(props.trigger) {
            return <Trigger/>
        }
        return (
            <div className={'color-picker-popup-trigger' } title={triggerColor.toUpperCase()}>
                <span className={'color-picker-popup-trigger-label'}>Color</span>
                <span className={'color-picker-popup-trigger-color'} style={{backgroundColor: triggerColor}}/>
            </div>
        );
    };

    const colorPickerChange = (code: string) => {
        getTriggerColor(code);
        if(onChange) {
            onChange(code);
        }
    };

    const getColorPicker = (close: any) => {
        return <ColorPicker onChange={colorPickerChange} closePopup={close} {...rest}/>;
    };

    return (
        <div className={'color-picker-popup'}>
                <div className={'color-picker-popup-head'}>
                    {label && <label className={'color-picker-popup-head-label'}>{label}</label>}
                    {!hideColorString && <div className={'color-picker-popup-head-header'}>{header || triggerColor.toUpperCase()}</div>}
                </div>
            <Popup trigger={getTrigger()} childFunc={ close => getColorPicker(close)}/>
        </div>
    );
};
