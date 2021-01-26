import React from "react";
import "./popup.scss";

export enum IdPopupAlign {
    left = "left",
    right = "right",
    center = "center"
}

interface IPopupOwnState {
    open: boolean;
    triggerHeight: number;
}

export interface IPopupProps {
    trigger?: React.ReactNode;
    content?: any;
    childFunc?: (close: () => any) => JSX.Element;
    align?: IdPopupAlign;
    open?: boolean;
    shadow?: boolean;
}

export class Popup extends React.Component<IPopupProps> {
    readonly state: IPopupOwnState = {
        open: this.props.open || false,
        triggerHeight: 0
    };
    private popupRef = React.createRef<any>();
    private triggerRef = React.createRef<any>();
    private overlayRef = React.createRef<any>();

    private timeOutHandler: null | number = null;

    render() {
        const { trigger } = this.props;
        const { open } = this.state;

        return (
            <>
                <span className={'popup-trigger-c'} ref={this.triggerRef} onClick={this.handleOnTriggerClicks}>{trigger}</span>
                {open && this.popupContent()}
                {open && this.calculateCorrectPopupPosition()}
            </>
        );
    }

    componentWillUnmount() {
        if(this.timeOutHandler) {
            clearTimeout(this.timeOutHandler)   
        }
    }

    private calculateCorrectPopupPosition = () => {
        this.timeOutHandler = setTimeout(() => {
            const popup = this.popupRef.current;
            const triggerDiam: DOMRect = this.triggerRef.current.getBoundingClientRect();
            const popupDiam: DOMRect = popup.getBoundingClientRect();

            if(popup) {
                const { align } = this.props;
                popup.style.top = `${triggerDiam.bottom}px`;

                if (align === IdPopupAlign.left) {
                    const left = (triggerDiam.right - popupDiam.width);
                    popup.style.left = `${left <= 0 ? '1' : left}px`;
                } else if(align === IdPopupAlign.right) {
                    popup.style.left = `${triggerDiam.left}px`;
                } else {
                    const left = (triggerDiam.left + (triggerDiam.width / 2) - (popupDiam.width / 2))
                    popup.style.left = `${left <= 0 ? '1' : left}px`;
                }

                popup.style.visibility = "visible";
            }
        });
    };

    private popupContent = () => {
        const { content, childFunc, shadow } = this.props;
        const popupStyle: React.CSSProperties = {
            position: "absolute",
            background: "white",
            zIndex: 1,
            visibility: "hidden"
        };

        if (shadow) {
            popupStyle.borderRadius = '3px'
            popupStyle.boxShadow = '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)';
        }

        const popUp = (
            <div className={'popup-overlay-c'} ref={this.overlayRef} onClick={this.handlePopupOverlayClick}>
                <span style={popupStyle} ref={this.popupRef}>
                {childFunc ? childFunc(this.handleClosePopup) : content || null}
                </span>
            </div>
        );

        return popUp;
    };

    private handleOnTriggerClicks = () => {
        // const diam: DOMRect = this.triggerRef.current.getBoundingClientRect();
        // /*
        //     bottom: 213.1999969482422
        //     height: 28
        //     left: 190.6374969482422
        //     right: 222.2999973297119
        //     top: 185.1999969482422
        //     width: 31.662500381469727
        //     x: 190.6374969482422 (no IE)
        //     y: 185.1999969482422 (no IE)
        // * */
        // console.log('diam', diam)
        this.setState({ open: !this.state.open });
    };

    private handlePopupOverlayClick = (e: React.MouseEvent) => {
        const {target} = e;
        if(target === this.overlayRef.current) {
            this.handleClosePopup();
        }
    }

    private handleClosePopup = () => {
        this.setState({open: false});
    }
}
