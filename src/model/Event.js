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
            "Application Submitted": "case-added.svg",
            "Medical Records Submitted": "sample-received.svg",
            "Medical Records Received": "sequenced.svg",
            "Decision Date": "analysis-pipeline.svg",
            "Evaluation Started": "pheno-added.svg",
            "Sequence Data Received": "unknown-sig-variant.svg",
            "Evaluation Completed": "reinterprete-pipeline.svg",
            "Wrap Up Documents": "significant-variant.svg",
            "Diagnosis entered": "case-diagnosed.svg",
            "Samples sent to MOSC": "case-diagnosed.svg",
            "Results Received": "case-diagnosed.svg",
          };
      
          // Set the Icon SVG based on the event type
          return typeToIconMapping[this.type] || null;

      
    }

    setColor() {
        const typeToColorMapping = {
            "Application Submitted": "#FFFFFF",
            "Medical Records Submitted": "#FFFFFF",
            "Medical Records Received": "#FFFFFF",
            "Decision Date": "#000080",
            "Evaluation Started": "#006400",
            "Sequence Data Received": "#FFA500",
            "Evaluation Completed": "#000080",
            "Wrap Up Documents": "#FF0000",
            "Diagnosis entered": "#90B134",
            "Samples sent to MOSC": "#90B134",
            "Results Received": "#90B134",
          };
      
          // Set the color based on the event type
          return typeToColorMapping[this.type] || null;

      
    }

    setSvgContainer() {
        const typeToSvgContainerMapping = {
            "Application Submitted": "short-icon-container.svg",
            "Medical Records Submitted": "short-icon-container.svg",
            "Medical Records Received": "short-icon-container.svg",
            "Decision Date": "short-icon-container.svg",
            "Evaluation Started": "short-icon-container.svg",
            "Sequence Data Received": "short-icon-container.svg",
            "Evaluation Completed": "short-icon-container.svg",
            "Wrap Up Documents": "short-icon-container.svg",
            "Diagnosis entered": "short-icon-container.svg",
            "Samples sent to MOSC": "short-icon-container.svg",
            "Results Received": "short-icon-container.svg",
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
  