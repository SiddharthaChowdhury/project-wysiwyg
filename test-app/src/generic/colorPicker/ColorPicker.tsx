import React from "react";
import {colorPickerBoldColors, colorPickerLightColors} from "./IdColors";
import "./colorPicker.scss";

export interface IColorPickerProps {
    colors?: string[];
    lightColors?: string[];
    onChange?: (colorCode: string) => any;
    onMouseEnter?: (colorCode: string) => any;
    closePopup?: () => any;
}

export class ColorPicker extends React.PureComponent<IColorPickerProps> {

    render () {
        const {colors, lightColors} = this.props;

        return (
            <div className={"color-picker"}>
                {this.getColorPalette(colors || colorPickerBoldColors)}
                {this.getColorPalette(lightColors || colorPickerLightColors)}
            </div>
        );
    }

    private getColorPalette = (codes: string[]) => {
        return (
            <div className={"color-picker-color-palette"}>
                {codes.map((colorCode: string, _key: number) => {
                    return(
                        <div
                            key={_key}
                            className={"color-picker-color-palette-tab"}
                            style={{backgroundColor: colorCode}}
                            title={colorCode.toUpperCase()}
                            onClick={() => this.handleClick(colorCode)}
                            onMouseEnter={() => this.handleMouseEnter(colorCode)}
                        />
                    )
                })}
            </div>
        );
    };

    private handleClick = (code: string) => {
        const {onChange, closePopup} = this.props;
        if(onChange) {
            onChange(code);
        }

        if(closePopup) {
            closePopup();
        }
    };

    private handleMouseEnter = ( code: string) => {
        const {onMouseEnter} = this.props;
        if(onMouseEnter) {
            onMouseEnter(code);
        }
    }
}