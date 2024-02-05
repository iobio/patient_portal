import * as d3 from 'd3';
import Event from '../model/Event.js'; 


export function Timeline() {

    let x, x2, xTop, y, y2, mainChart, navChart, width, height, height2, xAxis, xAxisTop, xAxis2, yAxis_left, 
    yAxis_right, brush, container, svg, margin, margin2, defaultSelection, formattedData;

    function initializeTimeline(selector, data, openModalCallback) {

        container = d3.select(selector);
        width = 960;
        height = 500;
        svg = container.append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "timeline-svg");

        
        margin = {top: 20, right: 20, bottom: 110, left: 20},
        margin2 = {top: 420, right: 20, bottom: 30, left: 20},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        height2 = +svg.attr("height") - margin2.top - margin2.bottom,

        x = d3.scaleTime().range([0, width]),
        x2 = d3.scaleTime().range([0, width]),
        xTop = d3.scaleTime().range([0, width]), 
        y = d3.scaleLinear().range([height, 0]),
        y2 = d3.scaleLinear().range([height2, 0]);

        xAxis = d3.axisBottom(x)
                    // .ticks(d3.timeMonth.every(1))  // Show ticks for every month
                    .tickFormat(d3.timeFormat("%b %Y"))
                    .tickSize(-height);

        xAxisTop = d3.axisTop(xTop)
                    .tickSize(0)
                    .tickFormat("");

        xAxis2 = d3.axisBottom(x2)
                    .ticks(d3.timeYear.every(1))  // Show ticks for every year
                    .tickFormat(d3.timeFormat("%Y"));

        yAxis_left = d3.axisLeft(y)
                        .tickSize(0)
                        .tickFormat("");

        yAxis_right = d3.axisRight(y)
                        .tickSize(0)
                        .tickFormat("");

        brush = d3.brushX()
            .extent([[0, 0], [width, height2]])
            .on("brush end", brushed); 

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        mainChart = svg.append("g")
            .attr("class", "mainChart")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        navChart = svg.append("g")
            .attr("class", "navChart")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const startYear = currentYear - 9;
        const minDate = new Date(startYear, 0, 1); // Jan 1st of start year
        const maxDate = new Date(currentYear, 11, 31); // Dec 31st of current year
        console.log("minDate:", minDate)
        console.log("maxDate:", maxDate)


        // Parse dates
        const parseDate = d3.timeParse("%Y-%m-%d");
        const formatMonthYear = d3.timeFormat("%b %Y");

        // Transform the data
        formattedData = data.map(event => ({
            type: event.type,
            date: parseDate(event.date),
            description: event.description,
            svgFile: `public/${event.type}.svg`,
            category: event.category,
            categoryColor: event.color
        }));

        console.log("formatted data:",formattedData);

        // let minDate = d3.min(formattedData, function(d) { return d.date; });
        // let maxDate = d3.max(formattedData, function(d) { return d.date; });

        // Adjust to start at the beginning of the minDate year and end at the end of the maxDate year
        x.domain([d3.timeYear.floor(minDate), d3.timeYear.ceil(maxDate)]);
        x2.domain([d3.timeYear.floor(minDate), d3.timeYear.ceil(maxDate)]);

        xTop.domain(x.domain());
        
        y2.domain(y.domain());

        // Add a count for each month to keep track of events in the same month
        const monthEventCount = {};

        // Loop through the formatted data and update y-coordinate based on the count
        formattedData.forEach(function(d) {
            const monthKey = formatMonthYear(d.date);
                // Extract the second day of the month
            const secondDayOfMonth = new Date(d.date);
            secondDayOfMonth.setDate(2);

            // Add the second day of the month as a new property which will be used to align the events vertically
            d.secondDayOfMonth = secondDayOfMonth;

            if (!monthEventCount[monthKey]) {
                monthEventCount[monthKey] = 1;
            } else {
                monthEventCount[monthKey]++;
            }
            d.verticalOffset = monthEventCount[monthKey]; // New property to store vertical offset
        });

        let lastEventDate = formattedData[formattedData.length - 1].secondDayOfMonth;

        // Calculate next month after last event and five months before that
        let nextMonthAfterLastEvent = d3.utcMonth.offset(lastEventDate, 1);
        let fiveMonthsBeforeNext = d3.utcMonth.offset(nextMonthAfterLastEvent, -6);

        // Ensure fiveMonthsBeforeNext is not before the min date
        if (fiveMonthsBeforeNext < minDate) {
            fiveMonthsBeforeNext = minDate;
            // Adjust nextMonthAfterLastEvent to maintain 6 month range
            nextMonthAfterLastEvent = d3.utcMonth.offset(fiveMonthsBeforeNext, 6);
        }

        let endOfTimeline = d3.timeYear.offset(d3.timeYear.ceil(maxDate), 1);

        // Ensure nextMonthAfterLastEvent is not beyond the max date
        if (nextMonthAfterLastEvent > endOfTimeline) {
            nextMonthAfterLastEvent = endOfTimeline;
            // Adjust fiveMonthsBeforeNext to maintain 6 month range
            fiveMonthsBeforeNext = d3.utcMonth.offset(nextMonthAfterLastEvent, -6);
        }

        // Set default selection
        defaultSelection = [x2(fiveMonthsBeforeNext), x2(nextMonthAfterLastEvent)];

        console.log("defaultSelection", defaultSelection);

        mainChart.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        mainChart.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis_left);

        mainChart.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + width + ",0)")
            .call(yAxis_right);

        mainChart.selectAll(".tick line")
            .attr("class", "tick-line");

        mainChart.selectAll(".dot")
            .data(formattedData)
            .enter().append("image") 
            .attr("class", "dot") // Assign a class for styling
            .attr("xlink:href", function(d) { return d.svgFile; })
            .attr("x", d => x(d.secondDayOfMonth))
            .attr("y", d => d.verticalOffset * 40) // Adjust the y-coordinate based on the vertical offset
            .attr("width", 25) 
            .attr("height", 25);

        mainChart.selectAll(".dotText")
            .data(formattedData)
            .enter().append("text")
            .attr("class", "dotText") // Assign a class for styling
            .attr("x", d => x(d.secondDayOfMonth) + 30) // Position the text to the right of the image
            .attr("y", d => height / 30 + d.verticalOffset * 40) // Align the text vertically with the image
            .text(function(d) { return d.type; })
            .on("click", function(event, d) {
                console.log('dotText clicked', d);
                openModalCallback(d.type, d.description);
            });


        navChart.selectAll(".dotContext")
            .data(formattedData)
            .enter().append("circle") 
            .attr("class", "dotContext") // Assign a class for styling
            .attr("cx", d => x2(d.secondDayOfMonth))
            .attr("cy", d => height2 / 4 + d.verticalOffset * 7)
            .attr("r", 3)
            .style("fill", function(d) { return d.categoryColor; }); 

        navChart.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);

        navChart.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, defaultSelection);

        svg.append("g")
            .attr("class", "axis axis--x-top")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(xAxisTop);

            // figuring out why zoom event and click event are conflicting
        // svg.append("rect")
        //     .attr("class", "zoom")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        //     .call(zoom);
    }


    function brushed(event) {
        let s = event.selection || defaultSelection;
        let fixedBrushWidth = defaultSelection[1] - defaultSelection[0];
    
        if (s[1] - s[0] !== fixedBrushWidth) {
            if (event.sourceEvent && event.sourceEvent.type === "mousemove") {
                // Adjust the brush position while maintaining the fixed size
                let newStart = s[0];
                let newEnd = newStart + fixedBrushWidth;
    
                // Prevent the brush from exceeding the right boundary
                if (newEnd > x2.range()[1]) {
                    newEnd = x2.range()[1];
                    newStart = newEnd - fixedBrushWidth;
                }
    
                // Update the selection
                s = [newStart, newEnd];
                d3.select(".navChart .brush").call(brush.move, s);
            }
        }
    
        x.domain(s.map(x2.invert, x2));
        
    
        mainChart.selectAll(".dot")
            .attr("x", d => x(d.secondDayOfMonth))
            .attr("y", d => d.verticalOffset * 35);
    
        mainChart.selectAll(".dotText")
            .attr("x", d => x(d.secondDayOfMonth) + 30)
            .attr("y", d => height / 30 + d.verticalOffset * 35);
    
        mainChart.select(".axis--x").call(xAxis);
    
        mainChart.selectAll(".tick line")
            .attr("class", "tick-line");
            
    }


    function updateChart(selectedOption, openModalCallback) {
        const filteredData = selectedOption ? 
        formattedData.filter(d => d.category === selectedOption) : formattedData;

        console.log("filteredData", filteredData);
        updateMainChart(filteredData, openModalCallback);
        updateNavChart(filteredData);
    }


    function updateMainChart(filteredData, openModalCallback) {
        // Clear existing elements
        const mainChart = d3.select(".mainChart");
        mainChart.selectAll(".dot, .dotText").remove();

        // Add new elements based on filtered data
        mainChart.selectAll(".dot")
            .data(filteredData)
            .enter().append("image")
            .attr("class", "dot")
            .attr("xlink:href", function(d) { return d.svgFile; })
            .attr("x", d => x(d.secondDayOfMonth))
            .attr("y", d => d.verticalOffset * 40)
            .attr("width", 25)
            .attr("height", 25);

        mainChart.selectAll(".dotText")
            .data(filteredData)
            .enter().append("text")
            .attr("class", "dotText")
            .attr("x", d => x(d.secondDayOfMonth) + 30)
            .attr("y", d => height / 30 + d.verticalOffset * 40)
            .text(function(d) { return d.type; })
            .on("click", function(event, d) {
            console.log('dotText clicked', d);
            openModalCallback(d.type, d.description);
            }.bind(this));
    }

      
    function updateNavChart(filteredData) {
        // Clear existing elements
        const navChart = d3.select(".navChart");
        navChart.selectAll(".dotContext").remove();
    
        // Add new elements based on filtered data
        navChart.selectAll(".dotContext")
            .data(filteredData)
            .enter().append("circle")
            .attr("class", "dotContext")
            .attr("cx", d => x2(d.secondDayOfMonth))
            .attr("cy", d => height2 / 4 + d.verticalOffset * 7)
            .attr("r", 3)
            .style("fill", function(d) { return d.categoryColor; });
    
    }

    return {initializeTimeline,updateChart};
}



