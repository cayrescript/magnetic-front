<template>
    <div class="data-export">
        <select v-model="selectedFormat" id="export-format-select">
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="xml">XML</option>
        </select>
        <button @click="exportData" id="data-export-button" class="btn bg-green-600 text-white p-3 rounded">Export Data</button>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            selectedFormat: "csv",
        };
    },
    props: {
        data: {
            type: Array,
            required: true,
        },
    },
    methods: {
        exportData() {
            let formattedData = "";
            let mimeType = "";
            let extension = "";

            switch (this.selectedFormat) {
                case "csv":
                    formattedData = this.convertToCSV(this.data);
                    mimeType = "text/csv";
                    extension = ".csv";
                    break;
                case "json":
                    formattedData = this.convertToJSON(this.data);
                    mimeType = "application/json";
                    extension = ".json";
                    break;
                case "xml":
                    formattedData = this.convertToXML(this.data);
                    mimeType = "application/xml";
                    extension = ".xml";
                    break;
            }

            this.triggerDownload(formattedData, mimeType, extension);
        },
        convertToCSV(data) {
            if (!data || data.length === 0) {
                return "";
            }

            const replacer = (key, value) => (value === null ? "" : value);
            const header = Object.keys(data[0]);
            const csv = [
                header.join(","),
                ...data.map((row) =>
                    header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(",")
                ),
            ].join("\r\n");

            return csv;
        },
        convertToJSON(data) {
            return JSON.stringify(data, null, 2);
        },
        convertToXML(data) {
            const convertToXMLNode = (key, value) => {
                return `<${key}>${value}</${key}>`;
            };

            const xmlItems = data.map((item) => {
                const xmlItem = Object.entries(item)
                    .map(([key, value]) => convertToXMLNode(key, value))
                    .join("");

                return `<item>${xmlItem}</item>`;
            });

            return `<?xml version="1.0" encoding="UTF-8"?><items>${xmlItems.join("")}</items>`;
        },

        triggerDownload(data, mimeType, extension) {
            const blob = new Blob([data], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `export${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

    },
};
</script>

<style>
.data-export {
    display: flex;
    justify-content: flex-end;
    padding: 1rem 0;
}
</style>