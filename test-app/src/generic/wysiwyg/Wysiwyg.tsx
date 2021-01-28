import React, {RefObject} from 'react';
import "./wysiwyg.scss";
import {IdEditorCommandCode} from "./IdEditorCommandCode";
import {WysiwygToolbar} from "./toolBar/WysiwygToolbar";
import {WysiwygContent} from "./content/WysiwygContent";
import { utilWysiwyg } from './utilWysiwyg';

export interface IWysiwygToolbarProperties {
    isSTRIKE?: boolean;
    isU?: boolean;
    isI?: boolean;
    isB?: boolean;
    isUL?: boolean;
    isOL?: boolean;
    isA?: boolean;
    isLEFT?: boolean;
    isRIGHT?: boolean;
    isCENTER?: boolean;
    isJUSTIFY?: boolean;
    isFONT?: boolean;
    isTABLE?: boolean;
}

interface IWysiwygOwnState {
    toolbarProperties: IWysiwygToolbarProperties;
    editable: boolean;
    cursorSelection: any[];
    debugContent: string;
}

interface IWysiwygProps {
    label: string;
    debounceTime?: number;
    onChange?: (content: any) => any;
    debugCode?: boolean;
    onInitSetContent?: string;
}

export class Wysiwyg extends React.Component<IWysiwygProps, IWysiwygOwnState> {
    readonly state: IWysiwygOwnState = {
        editable: true,
        cursorSelection: [],
        debugContent: '',
        toolbarProperties: {
            isSTRIKE: false,
            isU: false,
            isI: false,
            isB: false,
            isUL: false,
            isOL: false,
            isA: false,
            isLEFT: false,
            isRIGHT: false,
            isCENTER: false,
            isJUSTIFY: false,
            isTABLE: false,
        },
    };
    private editorRef: RefObject<HTMLDivElement> = React.createRef();

    render (){
        return (
            <div className={"wysiwyg-cont"}>
                <div className={"wysiwyg-top-label"}>
                    <label>{this.props.label}</label>
                </div>
                <div className={"wysiwyg"}>
                    <WysiwygToolbar
                        execute={this.executeCommand}
                        editorRef={this.editorRef}
                        selection={this.state.cursorSelection}
                        toolbarProperties={this.state.toolbarProperties}
                        trackEnabledToolbarProperties={this.trackEnabledToolbarProperties}
                    />
                    <WysiwygContent
                        onInitSetContent={this.props.onInitSetContent}
                        onChange={this.handleChange}
                        debounceTime={this.props.debounceTime}
                        setSetCursor={this.setSetCursor}
                        editable={this.state.editable}
                        editorRef={this.editorRef}
                        selection={this.state.cursorSelection}
                        trackEnabledToolbarProperties={this.trackEnabledToolbarProperties}
                    />
                    {this.props.debugCode &&
                        <div>
                            {this.state.debugContent}
                        </div>
                    }
                </div>
            </div>
        );
    }

    private handleChange = () => {
        const {onChange} = this.props;

        if(onChange && this.editorRef.current) {
            onChange(this.editorRef.current.innerHTML);
        }
        if(this.props.debugCode) {
            const to_show = this.editorRef.current ? this.editorRef.current.innerHTML : '';
            this.setState({debugContent: to_show})
        }
    };

    private can = (command: IdEditorCommandCode) => {
        return document.queryCommandEnabled (command);
    };

    private executeCommand = (command: IdEditorCommandCode, defaultValue?: any) => {
        if (utilWysiwyg.canExecuteCommand(command)) {
            document.execCommand (command, false, defaultValue);
            return;
        } else {
            // console.log('Force executing command', this.state.cursorSelection);
            const [range] = this.state.cursorSelection;
            let windowSelection = window.getSelection();
            if(windowSelection && range) {
                windowSelection.removeAllRanges();
                windowSelection.addRange(range);
                document.execCommand (command, false, defaultValue);
            }
        }
    };

    private setSetCursor = (value: any) => {
        this.setState({cursorSelection: value});
    };

    private updateToolbarProperties = (properties: IWysiwygToolbarProperties) => {
        this.setState({toolbarProperties: properties});
    };

    private trackEnabledToolbarProperties = () => {
        const {cursorSelection} = this.state;
        const self = this;

        const currentSelection = cursorSelection[1];
        const editorNode = this.editorRef.current;
        const nodes: {nodeName: string, align?: string}[] = [];

        if(editorNode && currentSelection) {
            let target = currentSelection.focusNode;

            while(editorNode !== target && target !== null) {
                nodes.push({nodeName: target.nodeName, align: target.style ? target.style.textAlign: undefined});

                if(target.parentNode) {
                    target = target.parentNode;
                } else {
                    target = null;
                }
            }
        }

        deriveActiveProperties();

        function deriveActiveProperties () {
            if(nodes.length > 0) {
                const initialToolbarProperties: IWysiwygToolbarProperties = {}

                nodes.forEach((node: {nodeName: string, align?: string}) => {
                    const {nodeName, align} = node;
                    if(nodeName === "STRIKE"){ initialToolbarProperties.isSTRIKE = true; }
                    if(nodeName === "U"){ initialToolbarProperties.isU = true; }
                    if(nodeName === "I"){ initialToolbarProperties.isI = true; }
                    if(nodeName === "B"){ initialToolbarProperties.isB = true; }
                    if(nodeName === "UL"){ initialToolbarProperties.isUL = true; }
                    if(nodeName === "OL"){ initialToolbarProperties.isOL = true; }
                    if(nodeName === "A"){ initialToolbarProperties.isA = true; }
                    if(nodeName === "TABLE"){ initialToolbarProperties.isTABLE = true; }
                    if(nodeName === "FONT" || nodeName === "SPAN"){ initialToolbarProperties.isFONT = true; }

                    if(align === "justify") { initialToolbarProperties.isJUSTIFY = true; }
                    if(align === "center") { initialToolbarProperties.isCENTER = true; }
                    if(align === "left") { initialToolbarProperties.isLEFT = true; }
                    if(align === "right") { initialToolbarProperties.isRIGHT = true; }
                });

                self.updateToolbarProperties(initialToolbarProperties);
            }
        }
    }
}
