export class DebugInfoPanel {
    private style: any = {
        position: 'absolute',
        width: '300px',
        height: '600px',
        left: '100px',
        top: '100px',
        color: 'green',
        'background-color': 'black',
        'white-space': 'nowrap'
    }
    
    private table: HTMLTableElement = document.createElement("table");
    
    private container = document.createElement("div");

    private values: any = {};
    
    constructor() {
        for(var key in this.style) {
            this.container.style[key] = this.style[key];
        }

        this.container.draggable = true;

        this.container.appendChild(this.table);

        this.container.ondragend = (event: any) => {
            this.container.style.left = event.x + "px";
            this.container.style.top = (event.y - parseFloat(this.container.style.height)) + "px";
        }
    }

    private addRow(name: string, value: any): (value: any) => void {
        var row: HTMLTableRowElement = this.table.insertRow();

        this.addNameCell(name.split('childvalue_').pop(), row);

        var valueBinding: any = {};

        if(value.forEach) {
            this.addValueCell(row);

            var callbacks = [];
            
            for(var i = 0; i < value.length; i++) {
                callbacks.push(this.addRow('childvalue_' + i, value[i]));
            }

            valueBinding.setValue = (values) => {
                callbacks.forEach((callback, i) => callback(values[i]));
            }
        } else {
            valueBinding.setValue = this.addValueCell(row);
        }

        if(name.indexOf('childvalue') === -1) {
            this.values[name] = valueBinding;
        }

        return valueBinding.setValue;
    }

    private addValueCell(row): (value: any) => void {
        var cell: HTMLTableCellElement = row.insertCell();

        cell.align = 'left'
        cell.vAlign = 'center';

        cell.style.width = '100%';

        return (value: any) => {
            cell.innerHTML = value + '';
        }
    }

    private addNameCell(name: string, row: HTMLTableRowElement): void {
        var cell: HTMLTableCellElement = row.insertCell(0);

        cell.innerHTML = name + " :";

        cell.align = 'right'
        cell.vAlign = 'center';

        cell.style.width = 'auto';
    }

    accept(name: string, value: any): void {
        if(!this.values[name]) {
            this.addRow(name, value);
        }
        
        this.setValue(name, value);
    }
    
    private setValue(name: string, value: any) {
        this.values[name].setValue(value);
    }
    
    attach(): void {
        document.body.appendChild(this.container);
    }
}

export class ControlPanel {
    private style: any = {
        position: 'absolute',
        width: '200px',
        height: '300px',
        left: '350px',
        top: '100px',
        color: 'green',
        background: 'linear-gradient(to top, #b5bdc8 0%, #828c95 36%, #28343b 100%)',
        borderRadius: '15px',
        fontFamily: 'helvetica',
        paddingBottom: '10px',
        paddingLeft: '5px',
        paddingRight: '5px'
    }

    private table: HTMLTableElement = document.createElement("table");

    private container = document.createElement("div");

    constructor() {
        for(var key in this.style) {
            this.container.style[key] = this.style[key];
        }

        this.container.draggable = true;

        this.table.style.width = "100%";
        this.table.style.height = "100%";

        this.container.appendChild(this.table);

        this.container.ondragend = (event: any) => {
            this.container.style.left = event.x + "px";
            this.container.style.top = (event.y - parseFloat(this.container.style.height)) + "px";
        };

        var titleElement = this.addCell(this.table.insertRow());

        titleElement.innerText = 'Controls';

        titleElement.style.color = 'white';
    }

    addButton(name: string, callback: () => void): void {
        var row: HTMLTableRowElement = this.table.insertRow();

        var cell = this.addCell(row);

        cell.style.paddingBottom = '7px';

        var button: HTMLInputElement = document.createElement("input");

        button.type = 'button';
        button.value = name.toUpperCase();

        button.style.width = '100%';
        button.style.height = '100%';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.background  = 'linear-gradient(to top, #cccccc 0%, #888888 36%, #333333 100%)';
        button.style.color = 'white';
        
        button.addEventListener('click', () => callback());

        cell.appendChild(button);
    }

    addSlider(name: string, minMaxStepDefault: number[], callback: (value: number) => void, resetValue?: number): void {
        var row: HTMLTableRowElement = this.table.insertRow();
        
        var cell = this.addCell(row);

        cell.style.paddingBottom = '7px';

        var wrapper = document.createElement('div');

        wrapper.style.width = '100%';
        wrapper.style.height = '100%';

        wrapper.style.borderRadius = '5px';
        wrapper.style.background  = 'linear-gradient(to top, #cccccc 0%, #888888 36%, #333333 100%)';
        wrapper.style.color = 'white';

        wrapper.innerHTML = '<label style = "font-family: helvetica; font-size: x-small; font-weight: normal;">' + name.toUpperCase() + '</label>';

        cell.appendChild(wrapper);

        var button: HTMLInputElement = document.createElement("input");

        button.type = "range";

        button.style.width = "100%";
        button.style.margin = "0px";
        button.style.marginTop = "5px";

        button.min = minMaxStepDefault[0] + '';
        button.max = minMaxStepDefault[1] + '';
        button.step = minMaxStepDefault[2] + '';
        button.defaultValue = minMaxStepDefault[3] + '';

        button.draggable = true;

        button.addEventListener("dragstart", event => {
            event.preventDefault();
            event.stopPropagation();
            
            return false;
        })

        button.addEventListener("input", () => {
            var value = parseFloat(button.value);

            callback(value === NaN ? 0 : value);
        });

        wrapper.appendChild(button);
    }

    private addCell(row: HTMLTableRowElement, width?: number): HTMLTableCellElement {
        var cell: HTMLTableCellElement = row.insertCell();

        cell.align = 'center'
        cell.vAlign = 'center';

        cell.style.width = width === undefined ? '100%' : (width + '%');

        return cell;
    }

    attach(): void {
        document.body.appendChild(this.container);
    }
}

function mouseEvent(type, sx, sy, cx, cy) {
    var evt;
    
    var e = {
        bubbles: true,
        cancelable: (type != "mousemove"),
        view: window,
        detail: 0,
        screenX: sx,
        screenY: sy,
        clientX: cx,
        clientY: cy,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        button: 0,
        relatedTarget: undefined
    };
    
    if(typeof( document.createEvent ) == "function") {
        evt = document.createEvent("MouseEvents");
        
        evt.initMouseEvent(type, e.bubbles, e.cancelable, e.view, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, document.body.parentNode);
    } else if((<any>document).createEventObject) {
        evt = (<any>document).createEventObject();
        
        for(var prop in e) {
            evt[prop] = e[prop];
        }
        
        evt.button = { 0:1, 1:4, 2:2 }[evt.button] || evt.button;
    }
    
    return evt;
}

function dispatch(el, evt) {
    if(el.dispatchEvent) {
        el.dispatchEvent(evt);
    } else if(el.fireEvent) {
        el.fireEvent('on' + evt.type, evt);
    }
    
    return evt;
}

export function touchStreetView(element) {
    if(!element) {
        return;
    }
    
    var event = mouseEvent("mouseup", 1, 1, 1, 1);

    dispatch(element, event);
}