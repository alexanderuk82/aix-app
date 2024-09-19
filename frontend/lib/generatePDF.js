import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const generateStyledPDF = (analysisData, atomicData) => {
	const doc = new jsPDF();
	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	let yPosition = 20;

	// Title and Description on First Page
	doc.setFontSize(24);
	doc.text("Interview Analysis Report", pageWidth / 2, yPosition, {
		align: "center"
	});
	yPosition += 10;
	doc.setFontSize(14);
	doc.text(
		"This report contains insights and atomic analysis from the UX interview.",
		pageWidth / 2,
		yPosition,
		{ align: "center" }
	);
	yPosition += 20;

	const renderSection = (title, data, yPosition) => {
		doc.setFontSize(18);
		doc.text(title, 10, yPosition);
		yPosition += 10;

		doc.setFontSize(14);
		Object.keys(data).forEach((category) => {
			if (yPosition > pageHeight - 30) {
				doc.addPage();
				yPosition = 20;
			}
			doc.setFontSize(16);
			doc.text(category, 10, yPosition);
			yPosition += 10;
			doc.setFontSize(12);

			const formattedText = JSON.stringify(data[category], null, 2)
				.replace(/[\[\]{}"]/g, "")
				.replace(/,/g, "\n");

			const lines = doc.splitTextToSize(formattedText, pageWidth - 20);
			lines.forEach((line) => {
				if (yPosition > pageHeight - 20) {
					doc.addPage();
					yPosition = 20;
				}
				doc.text(line, 10, yPosition);
				yPosition += 5; // Adjust line height as needed
			});
			yPosition += 10; // Adjust gap between categories
		});

		return yPosition;
	};

	// UX Analysis Section
	yPosition = renderSection("UX Analysis", analysisData, yPosition);

	// Atomic UX Analysis Section
	if (yPosition > pageHeight - 30) {
		doc.addPage();
		yPosition = 20;
	}
	renderSection("Atomic UX Analysis", atomicData, yPosition);

	doc.save("interview_analysis_report.pdf");
};

export default generateStyledPDF;
