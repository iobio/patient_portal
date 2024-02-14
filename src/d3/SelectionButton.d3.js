import * as d3 from 'd3';

export function SelectionButton() {

    let container;

    function createButton(selector) {
        container = d3.select(selector)
            .append("div")
            .attr("class", "tabs-container");
    
        container.append("p")
            .attr("class", "title-text")
            .text("Check by view:");
    
        const timelineButton = container.append("button")
            .attr("class", "button timeline-view-button")
            .text("Timeline")
            .on("click", function() {
                updateButtonHighlight(this);
                showView('timeline');
            });
    
        container.append("button")
            .attr("class", "button table-view-button")
            .text("Table View")
            .on("click", function() {
                updateButtonHighlight(this);
                showView('table');  
            });

        // Highlight the timeline button by default
        updateButtonHighlight(timelineButton.node());
    }

    function updateButtonHighlight(clickedButton) {
        const selector = ".tabs-container";
        d3.selectAll(selector + " .button").classed("selected-button", false);
        d3.select(clickedButton).classed("selected-button", true);
    }

    function showView(viewType) {
        const timeline_view = document.querySelector('.timeline-svg');
        const table_view = document.querySelector('.table-view-container');

        if (viewType=== 'timeline') {
            timeline_view.style.display = 'block';
            table_view.style.display = 'none';
        } else if (viewType === 'table'){
            timeline_view.style.display = 'none';
            table_view.style.display = 'block';
        }
    }

    return {createButton}
    
}