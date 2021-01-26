import React, {RefObject} from "react";
import "./tablePopup.scss";

interface ITablePopupOwnProps {
    rows: number;
    cols: number;
}

interface ITablePopupProps {
    editorRef: RefObject<HTMLDivElement>;
    selection: Array<any>;
    onClosePopup: () => void;
}

export class TablePopup extends React.Component<ITablePopupProps, ITablePopupOwnProps>  {
    state = {rows: 5, cols: 5, max: 10, min: 1};
    containerRef: RefObject<HTMLDivElement> = React.createRef();

    render () {
        const {rows, cols} = this.state;
        const divs = this.getTableSelectionMatrix();
        return (
            <div className={"wysiwyg-table-popup"}>
                <div className={"wysiwyg-table-popup-input-container"}>
                    <div>
                        <label>Rows</label>
                        <input type={"number"} value={rows} onChange={(e: any) => {
                            this.setState({rows: this.fixRange(e.target.value)})
                        }}/>
                    </div>
                    <div>
                        <label>Columns</label>
                        <input type={"number"} value={cols} onChange={(e: any) => {
                            this.setState({cols: this.fixRange(e.target.value)})
                        }}/>
                    </div>

                </div>
                <div ref={this.containerRef} style={{width: `${this.getGridContWidth()}px`}}>
                    {divs.map((div: any, index: number) => (
                        <React.Fragment key={index}>
                            {div}
                        </React.Fragment>
                    ))}
                </div>
                <div className={"wysiwyg-table-popup-btn-cont"}>
                    <div>{`${rows} x ${cols} table`}</div>
                    <button onClick={this.onInsertTable}>Insert</button>
                </div>
            </div>
        );
    }

    private getGridContWidth = () => {
        const {cols, max} = this.state;
        let newCols = cols;
        if( cols < max) newCols++;
        return ((newCols*25)+((newCols*5)/2));
    };

    private fixRange = (val: number): number => {
        const {max, min} = this.state;

        if (val < min) { return 1; }
        if(val > max) { return 10; }

        return val;
    };

    private getTableSelectionMatrix = () => {
        const {rows, cols, max} = this.state;
        const divsArr: Array<any> = [];
        let loopRows = rows;
        if( rows < max ) loopRows++;
        let loopCols = cols;
        if(cols < max)  loopCols++;

        for(let i = 1; i <= loopRows; i++) {
            for(let j = 1; j <= loopCols; j++) {
                divsArr.push(<div
                    data-row={i}
                    data-col={j}
                    title={`${i} x ${j}`}
                    className={`${ (i > rows || j > cols) ? 'wysiwyg-table-popup-selection-cell-extra': 'wysiwyg-table-popup-selection-cell'}`}
                    onClick={(e: any) => {
                        const elem = e.target;
                        const row = elem.getAttribute('data-row');
                        const col = elem.getAttribute('data-col');
                        this.setState({rows: row, cols: col})
                    }}
                />)
            }
        }

        return divsArr;
    };

    private onInsertTable = () => {
        const {rows, cols} = this.state;

        let tableString = '<table cellpadding="10" style="border: 1px solid silver;  border-collapse: collapse;">';
        for(let i = 1; i <= rows; i++) {
            tableString += '<tr>';
            for(let j = 1; j <= cols; j++) {
                tableString += '<td style="border: 1px solid silver;"></td>';
            }
            tableString += '</tr>';
        }
        tableString += '</table>';

        this.pasteHtmlAtCaret(tableString);
        this.props.onClosePopup()
    };

    private pasteHtmlAtCaret = (htmlElement: any) => {
        const {selection, editorRef:{current}} = this.props;
        const div = current;

        if(selection.length === 2 && div && htmlElement) {
            const [range, sel] = selection;

            // Get HTML element in required format
            let html = htmlElement;
            if(typeof html !== "string") {
                const tmp = document.createElement("DIV");
                tmp.appendChild(htmlElement);
                html = tmp.innerHTML;
            }

            // Logic for replacing selection with HTML element
            const el = document.createElement("div");
            el.innerHTML = html;
            let frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                const newRange = range.cloneRange();
                newRange.setStartAfter(lastNode);
                newRange.collapse(true);
                sel.removeAllRanges();
                sel.addRange(newRange);
            }
        }
    };
}