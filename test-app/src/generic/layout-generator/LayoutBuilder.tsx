import React from 'react';
import './layoutBuilder.scss';

enum IdPrebuildLayout {
    container = "Container",
    left30 = "Left30",
    right30 = "Right 30"
}

enum IdSplitType {
    vertical = 'vertical',
    horizontal = 'horizontal'
}

interface LayoutBuilderOwnState {
    target: any;
    hidePreLayout: boolean;
}

interface ILayoutBuilder {
    maxChild?: number;
}

export class LayoutBuilder extends React.PureComponent<ILayoutBuilder, LayoutBuilderOwnState> {
    private layoutRef = React.createRef<any>();
    readonly state: LayoutBuilderOwnState = {target: undefined, hidePreLayout: false};

    componentDidMount(): void {
        const layout = this.layoutRef.current;
        layout.addEventListener('mouseover', this.addHoveEffect);
        layout.addEventListener('mouseout', this.removeAllHoverEffect);
    }

    render (){
        return (
            <>
                <div className={'nav-lb'}>
                    <button onClick={() => this.splitVertically()}>Insert column</button>
                    <button onClick={this.splitHorizontally}>Insert Row</button>
                    <button onClick={this.handleDelete}>Delete</button>
                    <button onClick={this.clearAll}>Refresh</button>
                    {!this.state.hidePreLayout && 
                        <>
                        <button onClick={() => this.splitVertically(IdPrebuildLayout.left30)}>Layout Left 30</button>
                        <button onClick={() => this.splitVertically(IdPrebuildLayout.right30)}>Layout Right 30</button>
                        <button onClick={() => this.splitVertically(IdPrebuildLayout.container)}>Layout Container</button>
                        </>
                    }
                </div>
                <div className={'block-lb block-lb-100 block-lb-parent'}
                     onClick={(e: any) => this.handleSelection(e.target)}
                     ref={this.layoutRef}
                     onKeyDown={this.handleKeyDown}
                />
            </>
        );
    }

    componentWillUnmount(): void {
        const layout = this.layoutRef.current;
        layout.removeEventListener('mouseover', this.addHoveEffect);
        layout.removeEventListener('mouseout', this.removeAllHoverEffect);
    }

    private getBlock = (target: any, widthClass: string) => {
        if(!target || !target.childNodes) {
            return;
        }
        const block = document.createElement('DIV');
        block.setAttribute('class', `block-lb ${widthClass}`);
        block.setAttribute('contenteditable', 'true');

        const childNodes = Array.from(target.childNodes);

        const childToRemove = childNodes.filter((child: any) => {
           return (child.nodeType !== 1 || child.nodeName !== 'DIV' || !child.classList.contains('block-lb'))
        });

        childToRemove.forEach((elem: any) => {
           target.removeChild(elem);
        });

        target.appendChild(block);
    };

    private splitValue = (target: any) => {
        const split = target.getAttribute('data-split');
        return split ? parseInt(split) : 0;
    };

    private splitVertically = (layout?: IdPrebuildLayout) => {
        const {target} = this.state;
        if(!target) return;

        const {maxChild} = this.props;
        const type = target.getAttribute('data-split-type');
        const {width} = target.getBoundingClientRect();
        let splitVal = this.splitValue(target);

        if(splitVal >= (maxChild ? (maxChild - 1) : 3)) {
            alert('splitted max already');
            return;
        }

        if(type && type !== IdSplitType.vertical) {
            var anyExistingBlock = target.getElementsByClassName('block-lb');
            if(anyExistingBlock.length > 0) {
                alert('already splitted: ' + IdSplitType.vertical);
                return;
            }
        }

        if(width < 150) {
            alert('content too small to split');
            return;
        }

        target.style['flex-direction'] = 'row';
        target.setAttribute('data-split', `${++splitVal}`);
        target.setAttribute('data-split-type', IdSplitType.vertical);
        target.setAttribute('contenteditable', 'false');

        switch(layout) {
            case IdPrebuildLayout.left30:
                this.getBlock(target, 'block-lb-30');
                this.getBlock(target, 'block-lb-100');
                break;
            case IdPrebuildLayout.right30:
                this.getBlock(target, 'block-lb-100');
                this.getBlock(target, 'block-lb-30');

                break;
            case IdPrebuildLayout.container:
                this.getBlock(target, 'block-lb-30');
                this.getBlock(target, 'block-lb-100');
                this.getBlock(target, 'block-lb-30');
                break;
            default:
                this.getBlock(target, 'block-lb-100');
                if(target.childNodes.length === 1) {
                    this.getBlock(target, 'block-lb-100');
                }
                break;
        }

        this.setState({hidePreLayout: true})
    };

    private splitHorizontally = () => {
        const {target} = this.state;
        if(!target) return;

        const {maxChild} = this.props;
        const type = target.getAttribute('data-split-type');
        const {width} = target.getBoundingClientRect();
        let splitVal = this.splitValue(target);

        if(splitVal >= (maxChild ? (maxChild - 1) : 3)) {
            alert('splitted max already');
            return;
        }

        if(type && type !== IdSplitType.horizontal) {
            const anyExistingBlock = target.getElementsByClassName('block-lb');
            if(anyExistingBlock.length > 0) {
                alert('already splitted: ' + IdSplitType.horizontal);
                return;
            }
        }

        if(width < 150) {
            alert('content too small to split');
            return;
        }

        target.style['flex-direction'] = 'column';
        target.setAttribute('data-split', `${++splitVal}`);
        target.setAttribute('data-split-type', IdSplitType.horizontal);
        target.setAttribute('contenteditable', 'false');

        this.getBlock(target, 'block-lb-100');
        if(target.childNodes.length === 1) {
            this.getBlock(target, 'block-lb-100');
        }

        this.setState({hidePreLayout: true})
    };

    private removeAllHoverEffect = () => {
        this.setClass(undefined, 'lbf-hovered');
    };

    private addHoveEffect = (e: any) => {
        this.setClass(e.target, 'lbf-hovered');
    };

    private handleSelection = (target: any) => {
        this.setState({target});
        this.setClass(target, 'lbf-selected');
    };

    private clearAll = () => {
        const container = this.layoutRef.current;
        container.innerHTML = '';
        container.removeAttribute('data-split');
        container.removeAttribute('data-split-type');
        container.classList.remove('lbf-hovered');

        if(!this.hasChild()) {
            this.setState({hidePreLayout: false})
        }
    };

    private setClass = (target: any | undefined, className: string) => {
        const layout = this.layoutRef.current;
        const existing = layout.getElementsByClassName(className);

        layout.classList.remove(className);

        if(existing[0]) {
            existing[0].classList.remove(className);
        }

        if(target) {
            target.classList.add(className)
        }
    };

    private handleKeyDown = (e: any) => {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault()
        }
    };

    private handleDelete = () => {
        const {target} = this.state;
        const layout = this.layoutRef.current;
        if(!target) return;
        if(target === layout) {
            return;
        }

        const parent = target.parentNode;
        parent.removeChild(target);
        const splitVal = this.splitValue(parent);

        if(splitVal > 0) {
            parent.setAttribute('data-split', `${(splitVal - 1)}`);
        }

        this.handleSelection(parent);
        if(layout.childNodes.length === 0) {
            this.clearAll();
            this.setState({hidePreLayout: false})
        }
    }

    private hasChild = () => {
        const layout = this.layoutRef.current;
        if(layout) {
            return layout.childNodes.length > 0
        }
        return false;
    }
}