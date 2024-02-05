import * as d3 from 'd3';

export function Table() {
    
    let container;
    let table;
    let thead;
    let tbody;
    let rows;

    function createTable(selector, data) {
        container = d3.select(selector)
            .append("div")
            .attr("class", "table-view-container hide")
            .append("div")
            .attr("class", "table-container");
        
        table = container.append('table');

        thead = table.append('thead');
        thead.append('tr')
                .selectAll('th')
                .data(['Event', 'Date', 'Category'])
                .enter()
                .append('th')
                .text(d => d);
    
        tbody = table.append('tbody');
    
        rows = tbody.selectAll('tr')
            .data(data)
            .enter()
            .append('tr');
    
        rows.selectAll('td')
            .data(event => [event.type, event.date, event.category])
            .enter()
            .append('td')
            .text(d => d);
    }
    
    return {createTable}

}