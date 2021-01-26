import { IdEditorCommandCode } from "./IdEditorCommandCode";

class UtilWysiwyg {
    public getSelectedNode = () => {
        const doc: any = document as any;
        if (doc.selection)
            return doc.selection.createRange().parentElement();
        else{
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0)
                return selection.getRangeAt(0).startContainer.parentNode;
        }
    };

    public getCursorStatus = (): Array<any> => {
        let sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel && sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
            }
        }
        return [range, sel];
    };

    public setCursorFocus = (el: HTMLElement) => {
        const range = document.createRange();
        range.selectNodeContents(el);
        let sel: any = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    };

    public resetWindowSelection = () => {
        let selection = window.getSelection();
        if( selection && selection.rangeCount > 1) {
            for(var i = 1; i < selection.rangeCount; i++) {
                selection.removeRange(selection.getRangeAt(i));
            }
        }

        window.focus();
    }

    public canExecuteCommand = (command: IdEditorCommandCode): boolean => document.queryCommandEnabled(command);
}

export const utilWysiwyg = new UtilWysiwyg();
