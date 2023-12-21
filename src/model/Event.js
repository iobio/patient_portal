class Event {
    constructor(type, date, description) {
      this.type = type;
      this.date = date;
      this.description = description;
      this.formattedDate = this.formatDate();
      this.icon = this.setIcon();
      this.svgContainer = this.setSvgContainer();
      this.color = this.setColor();
    }

    setIcon() {
        const typeToIconMapping = {
            "Case Added": "case-added.svg",
            "Sample Received": "sample-received.svg",
            "Sequenced": "sequenced.svg",
            "Analysis Pipeline": "analysis-pipeline.svg",
            "Pheno Added": "pheno-added.svg",
            "Unknown sig variant": "unknown-sig-variant.svg",
            "Re-interprete Pipeline": "reinterprete-pipeline.svg",
            "Significant Variant": "significant-variant.svg",
            "Case Diagnosed": "case-diagnosed.svg",
          };
      
          // Set the Icon SVG based on the event type
          return typeToIconMapping[this.type] || null;

      
    }

    setColor() {
        const typeToColorMapping = {
            "Case Added": "#FFFFFF",
            "Sample Received": "#FFFFFF",
            "Sequenced": "#FFFFFF",
            "Analysis Pipeline": "#000080",
            "Pheno Added": "#006400",
            "Unknown sig variant": "#FFA500",
            "Re-interprete Pipeline": "#000080",
            "Significant Variant": "#FF0000",
            "Case Diagnosed": "#90B134",
          };
      
          // Set the color based on the event type
          return typeToColorMapping[this.type] || null;

      
    }

    setSvgContainer() {
        const typeToSvgContainerMapping = {
            "Case Added": "short-icon-container.svg",
            "Sample Received": "short-icon-container.svg",
            "Sequenced": "short-icon-container.svg",
            "Analysis Pipeline": "short-icon-container.svg",
            "Pheno Added": "short-icon-container.svg",
            "Unknown sig variant": "short-icon-container.svg",
            "Re-interprete Pipeline": "short-icon-container.svg",
            "Significant Variant": "short-icon-container.svg",
            "Case Diagnosed": "short-icon-container.svg",
          };
      
          // Set the SVG container based on the event type
          return typeToSvgContainerMapping[this.type] || null;
    }

    formatDate() {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const eventDate = new Date(this.date);
        const month = months[eventDate.getMonth()];
        const year = eventDate.getFullYear();

        return `${month} ${year}`;
    }
  }
  
  export default Event;
  