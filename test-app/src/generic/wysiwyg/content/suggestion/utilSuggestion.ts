export enum IdSuggestionKey {
    ticket = '#',
    doc = '##',
    user = '@'
}

export interface ISuggestionKeywordInfo {
    keyword: string;
    caretAt: number;
    type: IdSuggestionKey;
    rect?: DOMRect;
    parentNode?: HTMLElement;
}

class UtilSuggestion {

    private readonly SUGGESTION_OVERLAY_CLASS = 'wysiwyg-container-suggestion-overlay';

    public isSuggestionInvoked = (selection: Selection): ISuggestionKeywordInfo | undefined => {

        if(!selection || !selection.focusNode || !selection.anchorNode) {
            return;
        }

        const {anchorNode, focusNode}: any = selection;
        let parentNode: any = focusNode.parentNode;

        // if(parentNode) {
        //     while(parentNode.getAttribute('data-editor') !== 'true') {
        //         parentNode = parentNode.parentNode;
        //     }
        // }

        const textContentFull: string = focusNode.nodeValue || focusNode.textContent || '';
        const caretAt = selection.focusOffset;
        
        function getFocusRect (): DOMRect | undefined {
            const newRange = document.createRange();

            newRange.selectNodeContents(anchorNode);
            const rects = newRange.getClientRects();
            let rectDiam = undefined;
            if (rects.length > 0) {
                rectDiam = rects[(rects.length - 1)];
            }

            return rectDiam;
        }

        function getKeywordInfo() {
            const preText = textContentFull.substring(0, caretAt),
                postText = textContentFull.substring(caretAt, textContentFull.length);

            let targetSuggestionKey = null,
                keywordStartIndex = null,
                keywordEndIndex = null;

            const fetchTargetKey = (text: string, index: number) => {
                if(text[index] + text[index + 1] === IdSuggestionKey.doc) return IdSuggestionKey.doc;
                if(text[index] === IdSuggestionKey.ticket) return IdSuggestionKey.ticket;
                if(text[index] === IdSuggestionKey.user) return IdSuggestionKey.user;

                return null;
            }

            if(preText.lastIndexOf(' ') === -1) {
                // First word at start of line
                targetSuggestionKey = fetchTargetKey(preText, 0);

                if(targetSuggestionKey) {
                    keywordStartIndex = 0;
                }
            } else {
                const startIndex = preText.lastIndexOf(' ');
                targetSuggestionKey = fetchTargetKey(preText, (startIndex + 1 ));

                if(targetSuggestionKey) {
                    keywordStartIndex = startIndex + 1;
                }
            }

            if (targetSuggestionKey && keywordStartIndex !== null) {
                // Only if some suggestionKey found next part nedds to be derived

                if (postText.indexOf(' ') === -1) { // Cursor at the end of line
                    keywordEndIndex = postText.length + preText.length;
                } else {
                    keywordEndIndex = postText.indexOf(' ') + preText.length;
                }
            }

            if(targetSuggestionKey && keywordStartIndex !== null && keywordEndIndex !== null && keywordStartIndex <= keywordEndIndex ) {
                const keyword: ISuggestionKeywordInfo = {
                    parentNode,
                    keyword: preText.substring(keywordStartIndex, caretAt) + textContentFull.substring(caretAt, keywordEndIndex),
                    caretAt,
                    type: targetSuggestionKey,
                    rect: getFocusRect()
                };

                return keyword;
            }

            return undefined;
        }

        return getKeywordInfo()
    }

    public getUISuggestion = (keywordInfo: ISuggestionKeywordInfo) => {

        this.clearUISuggestionIfExists();
        const {rect, parentNode} = keywordInfo;
        
        const overlay =  document.createElement('DIV');
        overlay.setAttribute('class', this.SUGGESTION_OVERLAY_CLASS);
        overlay.addEventListener('click', function (){
            this.remove()
        });

        const container: HTMLElement =  document.createElement('DIV');
        container.setAttribute('class', 'wysiwyg-container-suggestion');
        container.setAttribute('style', `
            top: ${(rect?.y! + rect?.height! + 10)}px; 
            left: ${rect?.x}px;
        `);
        container.setAttribute('contenteditable', 'false');
        
        overlay.appendChild(container);
        parentNode!.appendChild(overlay);

        switch(keywordInfo.type) {
            case IdSuggestionKey.user:
                this.getUserSuggestionList(container, keywordInfo);
                break;
            case IdSuggestionKey.ticket:
                this.getTicketSuggestionList(container, keywordInfo);
                break;
            case IdSuggestionKey.doc:
                break;
        }
    }

    public clearUISuggestionIfExists = () => {
        const suggestionBoxExists = document.querySelector('.' + this.SUGGESTION_OVERLAY_CLASS);
        if(suggestionBoxExists) {
            suggestionBoxExists.removeEventListener('click', function() {
            })
            suggestionBoxExists.remove();
        }
    }

    private getUserSuggestionList = (container: HTMLElement, keywordInfo: ISuggestionKeywordInfo) => {
        const elements: any[] = [
            {avatar: "http://tinygraphs.com/squares/123", id: 12, fName: "Madan", lName: "Mohan", email: "uiadanmohan@gg.com"},
            {avatar: "http://tinygraphs.com/squares/143", id: 22, fName: "Sour", lName: "Morgan", email: "gadanrrsmohan@gg.com"},
            {avatar: "http://tinygraphs.com/squares/163", id: 542, fName: "Matha", lName: "Choda", email: "yadanmohddsan@gg.com"},
            {avatar: "http://tinygraphs.com/squares/173", id: 16, fName: "Khankir", lName: "Nati", email: "nmohan@gg.com"},
            {avatar: "http://tinygraphs.com/squares/183", id: 17, fName: "Jhaterkalo", lName: "Chulpechano", email: "madanmohan@gg.com"},
            {avatar: "http://tinygraphs.com/squares/193", id: 19, fName: "Joe", lName: "Row", email: "iouanmoh44@g.com"},
        ];

        elements.forEach((elem: any) => {
            const listItem = document.createElement('DIV');
            listItem.setAttribute('class', 'wysiwyg-container-suggestion__item');
            listItem.innerHTML = elem.fName + elem.lName;
            container.appendChild(listItem);
        })
    }

    private getTicketSuggestionList = (container: HTMLElement, keywordInfo: ISuggestionKeywordInfo) => {
        const elements: any[] = [
            {code: "COD-12", id: 12, title: "Ticket title can be really small and also can bee too big"},
            {code: "COD-14", id: 22, title: "Ticket title can be really small and also can bee too big, and so small"},
            {code: "COD-15", id: 542, title: "And also can bee too big, long week end a marea dey"},
            {code: "COD-16", id: 16, title: "Khankir naati khali bolte"},
            {code: "COD-18", id: 17, title: "Jhaterkalo il ngod is best"},
            {code: "COD-17", id: 19, title: "John doe from the cellar"},
        ];

        elements.forEach((elem: any) => {
            const listItem = document.createElement('DIV');
            listItem.setAttribute('class', 'wysiwyg-container-suggestion__item');
            listItem.innerHTML = elem.title;
            container.appendChild(listItem);
        })
    }
}

export const utilSuggestion = new UtilSuggestion();