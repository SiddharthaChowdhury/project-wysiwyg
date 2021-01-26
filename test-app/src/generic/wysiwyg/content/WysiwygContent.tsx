import React, {RefObject} from "react";
import "./wysiwygContent.scss";
import debounce from "lodash.debounce";
import {utilWysiwyg} from "../utilWysiwyg";
import { utilSuggestion, ISuggestionKeywordInfo } from "./suggestion/utilSuggestion";

interface IWysiwygContentProps {
    editable: boolean;
    editorRef: RefObject<HTMLDivElement>;
    debounceTime?: number;
    onChange?: () => any;
    trackEnabledToolbarProperties: () => any;
    setSetCursor(value: Array<any>): void;
    selection: Array<any>;
    onInitSetContent?: any;
}

export class WysiwygContent extends React.Component<IWysiwygContentProps> {
    private clearTime: any = null;

    componentDidMount () {
        const {editorRef: {current}, setSetCursor, onInitSetContent} = this.props;
        if(current) {
            utilWysiwyg.setCursorFocus(current);
            if(onInitSetContent) {
                current.innerHTML = this.props.onInitSetContent;
            }
            this.clearTime = setTimeout(() => {
                setSetCursor(utilWysiwyg.getCursorStatus());
            }, 0)
        }
    }
    componentWillUnmount () {
        clearTimeout(this.clearTime);
    }

    render () {
        const self = this;
        const {editable, editorRef, setSetCursor, onChange, debounceTime} = this.props;

        const debouncedUpdate = debounce(value => {
            if(onChange) {
                onChange();
            }
            setSetCursor(utilWysiwyg.getCursorStatus());
        }, debounceTime || 50);

        const debouncedKeyUp = debounce(event => {
            self.handleKeyUp(event)
        }, debounceTime || 200);


        return (
            <div className={"w-content"}>
                <div
                    // dangerouslySetInnerHTML={{__html: description || ''}}
                    contentEditable={editable}
                    className={"w-content-editable"}
                    data-editor={'true'}
                    ref={editorRef}
                    onKeyUp={e => debouncedKeyUp(e)}
                    onInput={() => debouncedUpdate(editorRef.current ? editorRef.current.innerHTML: "")}
                    onMouseUp={this.handleMouseUp}
                />
            </div>
        );
    }

    private handleMouseUp = () => {
        this.props.setSetCursor(utilWysiwyg.getCursorStatus());
        this.props.trackEnabledToolbarProperties();
    };

    private handleKeyUp = (e: any) => {
        const rangeSel = utilWysiwyg.getCursorStatus();

        this.detectSelection(rangeSel);
        this.props.trackEnabledToolbarProperties();

        const [range, sel] = rangeSel;
        const suggestionInfo: ISuggestionKeywordInfo | undefined = utilSuggestion.isSuggestionInvoked(sel);

        if(suggestionInfo && e.key !== "Shift") {
            utilSuggestion.getUISuggestion(suggestionInfo);
        } else {
            utilSuggestion.clearUISuggestionIfExists();
        }
    }

    private detectSelection = (rangeSel: any[]) => {
        this.props.setSetCursor(rangeSel);
        this.props.trackEnabledToolbarProperties();
    };
}
