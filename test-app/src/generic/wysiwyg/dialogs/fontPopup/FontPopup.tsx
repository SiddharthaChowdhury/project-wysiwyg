import React from 'react';
import './fontPopup.scss';
import {ColorPicker} from "../../../colorPicker/ColorPicker";

interface IFontPopupProps {
    onFontSizeChange: (size: any) => any;
    onFontForeColorChange: (color: string) => any;
    onFontBackColorChange: (color: string) => any;
    onClosePopup: () => void;
}

export class FontPopup extends React.Component<IFontPopupProps> {
    render() {

        return (
            <table>
                <thead>
                    <tr>
                        <td>Font size</td>
                        <td>Font colors</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{this.getFontSizeComponent()}</td>
                        <td>{this.getFontColorComponent()}</td>
                    </tr>
                </tbody>
            </table>
        )
    };

    private getFontSizeComponent = () => {
        const { onFontSizeChange, onClosePopup } = this.props;

        const changeFont = (size: number) => {
            onFontSizeChange(size);
            onClosePopup();
        }

        return (
            <div className={'wysiwyg-font-size'}>
                <div className={'wysiwyg-font-size-h1'} onClick={() => changeFont(7)} >Heading 1</div>
                <div className={'wysiwyg-font-size-h2'} onClick={() => changeFont(6)} >Heading 2</div>
                <div className={'wysiwyg-font-size-h3'} onClick={() => changeFont(5)}>Heading 3</div>
                <div className={'wysiwyg-font-size-normal'} onClick={() => changeFont(3)}>Normal</div>
            </div>
        )
    };

    private getFontColorComponent = () => {
        const {onFontBackColorChange, onFontForeColorChange, onClosePopup} = this.props;
        return (
            <div className={'wysiwyg-font-color'}>
                <div className={'wysiwyg-font-color-fore'}>
                    <small>Fore colors</small>
                    <ColorPicker lightColors={[]} onChange={(colorCode: string) => {
                        onFontForeColorChange(colorCode);
                        onClosePopup();
                    }}/>
                </div>
                <div className={'wysiwyg-font-color-back'}>
                    <small>Back colors</small>
                    <ColorPicker colors={[]} onChange={(colorCode: string) => {
                        onFontBackColorChange(colorCode);
                        onClosePopup();
                    }}/>
                </div>
            </div>
        );
    };

}