import React, {RefObject} from "react";
import {Fa} from "../../fa/Fa";
import {
    faAlignCenter,
    faAlignJustify,
    faAlignLeft,
    faAlignRight,
    faEraser, faFont,
    faItalic, faLink,
    faListOl,
    faListUl,
    faStrikethrough, faTable, faThLarge,
    faUnderline, faUnlink
} from "@fortawesome/free-solid-svg-icons";
import {IdEditorCommandCode} from "../IdEditorCommandCode";
import "./wysiwygToolbar.scss";
import {TablePopup} from "../dialogs/tablePopup/TablePopup";
import {IdPopupAlign, Popup} from "../../popup/Popup";
import {FontPopup} from "../dialogs/fontPopup/FontPopup";
import { IWysiwygToolbarProperties } from "../Wysiwyg";
import { LinkPopup } from "../dialogs/LinkPopup/LinkPopup";
import loader, { ILoaderDone, ILoaderFormat } from "../../spriteLoader/loader";
import { spriteToPiece } from "../../spriteLoader/spriteToPiece";

interface IWysiwygToolbarProps {
    editorRef: RefObject<HTMLDivElement>;
    execute(command: IdEditorCommandCode, defaultValue?: any): void;
    selection: Array<any>;
    toolbarProperties: IWysiwygToolbarProperties;
    trackEnabledToolbarProperties: () => any;
}

export const WysiwygToolbar: React.FC<IWysiwygToolbarProps> = ({execute, editorRef, selection, toolbarProperties, trackEnabledToolbarProperties}) => {
    const [asset, setAsset] = React.useState<any>(null);

    React.useEffect(() => {
        // SPRITE from: https://www.facetstudios.com/sprite-generator;
        const payload: ILoaderFormat = {
            json: {
                sprite: "/assets/sprite.json"
            },
            // image: {
            //     sprite : "/assets/editorSpritesheet.png"
            // }
        }
        
        loader(payload,  (result: ILoaderDone) => {
            const {json}: any = result;

            
            const doneSplitting = (data: any) => {
                console.log('Splitting DONE >>>>>>>> ', data);
                setAsset(data);
            };
            spriteToPiece("/assets/sprite.png", json.sprite.data, doneSplitting)
        });
    }, []);

    const handleExecute = (command: IdEditorCommandCode, defaultValue?: any) => {
        execute(command, defaultValue);
        trackEnabledToolbarProperties()
    };

    const onFontSizeChange = (size: number) => {
        execute(IdEditorCommandCode.fontSize, size);
    };
    const onFontForeColorChange = (color: string) => {
        execute(IdEditorCommandCode.foreColor, color);
    };
    const onFontBackColorChange = (color: string) => {
        execute(IdEditorCommandCode.backColor, color);
    };

    const Button = (props: any) => {
        const {children, onClick, ...rest} = props;

        const handleToolButtonClick = () => {
            const [range, sel] = selection;
            const {current} = editorRef;

            if(onClick && current) {
                if(!range || !sel) {
                    current.focus()
                } else {
                    if(sel.focusNode !== current) {
                        current.focus();
                    }
                }

                onClick();
            }
        };

        return (
            <button onClick={handleToolButtonClick} {...rest} >{props.children}</button>
        )
    };

    const editorHasContent = (): boolean => {
        const {current} = editorRef;
        if(current) {
            return !!current.innerHTML
        }

        return true;
    };

    const onLinkAdd = (link: string, text?:string) => {
        handleExecute(IdEditorCommandCode.createLink, link);
    }

    const getButtonIconStyle = (name: string): React.CSSProperties => {
        if(!asset) {
            return {};
        }

        return {
            backgroundImage: `url('${asset[name]}')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '30px',
            height: '30px',
        }
    }

    if(!asset) {
        return <div>Please wait...</div>
    }

    return (
        <div className={"w-toolbar"}>
            <div className={"w-toolbar-font-style w-toolbar-group"}>
                <Button style={{backgroundColor: "rgb(200, 219, 247)"}} onClick={() => {handleExecute(IdEditorCommandCode.removeFormat)}}><Fa icon={faEraser} /></Button>
            </div>
            <div className={"w-toolbar-font-style w-toolbar-group"}>
                <Button className={`${toolbarProperties.isB ? 'button-is-active': ''}`} onClick={() => handleExecute(IdEditorCommandCode.bold)} style={getButtonIconStyle('bold')}></Button>
                <Button className={`${toolbarProperties.isI ? 'button-is-active': ''}`} onClick={() => handleExecute(IdEditorCommandCode.italic)}><Fa icon={faItalic} /></Button>
                <Button className={`${toolbarProperties.isU ? 'button-is-active': ''}`} onClick={() => handleExecute(IdEditorCommandCode.underline)}><Fa icon={faUnderline} /></Button>
                <Button className={`${toolbarProperties.isSTRIKE ? 'button-is-active': ''}`} onClick={() => handleExecute(IdEditorCommandCode.strikeThrough)}><Fa icon={faStrikethrough} /></Button>
            </div>
            <div className={"w-toolbar-font w-toolbar-group"}>
                <Popup
                    trigger={<Button className={`${toolbarProperties.isFONT ? 'button-is-active': ''}`}><Fa icon={faFont} /></Button>}
                    childFunc={(close) => (
                        <FontPopup
                            onClosePopup={close}
                            onFontBackColorChange={onFontBackColorChange}
                            onFontSizeChange={onFontSizeChange}
                            onFontForeColorChange={onFontForeColorChange}
                        />
                    )}
                    shadow={true}
                    align={IdPopupAlign.right}
                />
            </div>
            <div className={"w-toolbar-alignment w-toolbar-group"}>
                <Button className={`${toolbarProperties.isLEFT ? 'button-is-active': ''}`} onClick={() => handleExecute(IdEditorCommandCode.justifyLeft)}><Fa icon={faAlignLeft} /></Button>
                <Button className={`${toolbarProperties.isCENTER ? 'button-is-active': ''}`} onClick={() => handleExecute(IdEditorCommandCode.justifyCenter)}><Fa icon={faAlignCenter} /></Button>
                <Button className={`${toolbarProperties.isRIGHT ? 'button-is-active': ''}`} onClick={() => handleExecute(IdEditorCommandCode.justifyRight)}><Fa icon={faAlignRight} /></Button>
                <Button className={`${toolbarProperties.isJUSTIFY ? 'button-is-active': ''}`} onClick={() => handleExecute(IdEditorCommandCode.justifyFull)}><Fa icon={faAlignJustify} /></Button>
            </div>
            <div className={"w-toolbar-list w-toolbar-group"}>
                <Button className={`${toolbarProperties.isUL ? 'button-is-active': ''}`} onClick={() => handleExecute(IdEditorCommandCode.insertUnorderedList)}><Fa icon={faListUl} /></Button>
                <Button className={`${toolbarProperties.isOL ? 'button-is-active': ''}`} onClick={() => handleExecute(IdEditorCommandCode.insertOrderedList)}><Fa icon={faListOl} /></Button>
            </div>
            <div className={"w-toolbar-list w-toolbar-group"}>
                <Popup
                    trigger={<Button className={`${toolbarProperties.isA ? 'button-is-active': ''}`}><Fa icon={faLink} /></Button>}
                    childFunc={(close) => (
                        <LinkPopup
                            onClosePopup={close}
                            onLinkAdd={onLinkAdd}
                        />
                    )}
                    shadow={true}
                    align={IdPopupAlign.left}
                />
                <Button onClick={() => execute(IdEditorCommandCode.unlink)}><Fa icon={faUnlink} /></Button>
            </div>
            {editorHasContent() &&
                <div className={"w-toolbar-table w-toolbar-group"}>
                <Popup
                    trigger={<Button className={`${toolbarProperties.isTABLE ? 'button-is-active': ''}`}><Fa icon={faTable} /></Button>}
                    childFunc={close => (
                        <div style={{display: 'flex', padding: '5px'}}>
                            <TablePopup onClosePopup={close} selection={selection} editorRef={editorRef}/>
                        </div>
                    )}
                    shadow={true}
                />
            </div>
            }

            {!editorHasContent() &&
                <div className={"w-toolbar-table w-toolbar-group"}>
                    <Popup
                        trigger={<Button><Fa icon={faThLarge} /></Button>}
                        content={
                            <div style={{display: 'flex', padding: '5px'}}>
                                templates to be added
                            </div>
                        }
                        shadow={true}
                    />
                </div>
            }
        </div>
    );
};
