import * as d3 from 'd3';

export function SelectionButton() {

    let container;

    function createButton(selector, showViewCallback) {
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
                showViewCallback('timeline');
            });
    
        container.append("button")
            .attr("class", "button table-view-button")
            .text("Table View")
            .on("click", function() {
                updateButtonHighlight(this);
                showViewCallback('table');  
            });

        // Highlight the timeline button by default
        updateButtonHighlight(timelineButton.node());
    }

    function updateButtonHighlight(clickedButton) {
        const selector = ".tabs-container";
        d3.selectAll(selector + " .button").classed("selected", false);
        d3.select(clickedButton).classed("selected", true);
    }

    return {createButton}
    
}