import React from 'react';
import './linkPopup.scss';
import { utilWysiwyg } from '../../utilWysiwyg';
import { IdEditorCommandCode } from '../../IdEditorCommandCode';

interface ILinkPopupOwnState {
    link: string;
    text: string;
}

interface ILinkPopupProps {
    onLinkAdd: (link: string, text?:string) => void;
    onClosePopup: () => void;
}

export class LinkPopup extends React.Component<ILinkPopupProps> {
    state: ILinkPopupOwnState = {link: '', text: ''}

    render() {
        return (
            <div className="insertLinkContainer">
                <input
                    value={this.state.link}
                    type={'text'}
                    placeholder='Paste URL'
                    onChange={(e: any) => this.setState({link: e.target.value})}
                />
                <button className="insertLinkDone" onClick={this.handleDone}>Insert</button>
            </div>
        )
    };

    private handleDone = () => {
        this.props.onLinkAdd(this.state.link, this.state.text)
        this.props.onClosePopup()
    }
}
