import * as d3 from 'd3';

export function SearchMenu() {

    const options = [
        { text: 'None', value: '' },
        { text: 'Application', value: 'Application' },
        { text: 'Evaluation', value: 'Evaluation' },
        { text: 'Diagnosis', value: 'Diagnosis' }
    ];

    let selectedOption = '';

    let container;
    let select;

    function createSearchMenu(selector, onOptionSelected) {
        container = d3.select(selector)
            .append("div")
            .attr("class", "search-menu");

        container.append("p")
            .attr("class", "title-text")
            .text("Filter by category:");

        select = container.append("select")

        select.append('option')
            .text('Please select a category')
            .attr('value', '')
            .attr('disabled', true)
            .attr('selected', true);

        select.selectAll('null')
        .data(options) 
        .enter() 
        .append('option')
        .text(d => d.text)
        .attr('value', d => d.value);

        select.on('change', function() {
            selectedOption = d3.select(this).node().value; // Update the selectedOption with the current value
            console.log('Selected option:', selectedOption); 

            if (typeof onOptionSelected === 'function') {
                onOptionSelected(selectedOption); // Execute callback with the selected option
            }
            
        });
    }

    return {
        createSearchMenu
    }

}