const { jsPDF } = window.jspdf;

document
  .getElementById("certificateForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form elements
    const name = document.getElementById("name").value;
    const score = document.getElementById("score").value;
    const generateBtn = document.getElementById("generateBtn");
    const btnText = generateBtn.querySelector(".btn-text");
    const spinner = generateBtn.querySelector(".spinner");
    const successMessage = document.getElementById("successMessage");
    const preview = document.getElementById("preview");

    // Show loading state
    generateBtn.disabled = true;
    btnText.classList.add("hidden");
    spinner.classList.remove("hidden");
    preview.innerHTML = "<p>Generating certificate...</p>";

    try {
      // Save data to backend
      const response = await fetch("http://localhost:3000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, score }),
      });
      if (!response.ok) throw new Error("Failed to save data to backend");
    } catch (error) {
      console.error("Error saving data:", error);
      successMessage.innerHTML =
        "Error saving data. Certificate generated locally.";
      successMessage.style.background = "#fee2e2";
      successMessage.style.color = "#dc2626";
      successMessage.classList.remove("hidden");
      setTimeout(() => successMessage.classList.add("hidden"), 3000);
    }

    // Generate PDF
    const pdf = new jsPDF({
      orientation: "landscape", // Landscape for a wider certificate
      unit: "mm",
      format: "a4",
    });

    // Add background gradient
    pdf.setFillColor(240, 240, 245);
    pdf.rect(0, 0, 297, 210, "F"); // Fill entire page with light gray

    // Add decorative border
    pdf.setLineWidth(2);
    pdf.setDrawColor(0, 102, 204); // Blue border
    pdf.rect(10, 10, 277, 190, "S"); // Outer border
    pdf.setLineWidth(1);
    pdf.setDrawColor(255, 215, 0); // Gold inner border
    pdf.rect(15, 15, 267, 180, "S");

    // Add company logo (placeholder base64 or URL)
    // Replace with your logo's base64 string or URL
    const logoUrl = "https://via.placeholder.com/50x50.png?text=Logo"; // Placeholder
    try {
      pdf.addImage(logoUrl, "PNG", 20, 20, 30, 30);
    } catch (error) {
      console.warn("Logo loading failed, skipping logo.");
    }

    // Add certificate title
    pdf.setFont("times", "bold");
    pdf.setFontSize(40);
    pdf.setTextColor(0, 51, 102); // Dark blue
    pdf.text("Certificate of Achievement", 148.5, 50, { align: "center" });

    // Add company name
    pdf.setFont("times", "italic");
    pdf.setFontSize(20);
    pdf.setTextColor(51, 51, 51); // Gray
    pdf.text("Stellar Academy", 148.5, 65, { align: "center" });

    // Add recipient details
    pdf.setFont("times", "normal");
    pdf.setFontSize(24);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Awarded to: ${name}`, 148.5, 100, { align: "center" });

    // Add score
    pdf.setFontSize(18);
    pdf.text(`Score: ${score}%`, 148.5, 120, { align: "center" });

    // Add date
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    pdf.text(`Date: ${today}`, 148.5, 140, { align: "center" });

    // Add signature lines
    pdf.setFontSize(14);
    pdf.text("_________________________", 80, 170);
    pdf.text("Director of Education", 80, 180);
    pdf.text("_________________________", 180, 170);
    pdf.text("Program Coordinator", 180, 180);

    // Add footer
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Stellar Academy - Excellence in Learning", 148.5, 195, {
      align: "center",
    });

    // Generate preview
    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);
    const iframe = `<iframe width='100%' height='400px' style='border-radius: 12px; border: 1px solid #e0e0e0;' src='${url}'></iframe>`;
    preview.innerHTML = iframe;

    // Save PDF
    pdf.save(`${name}-certificate.pdf`);

    // Show success message
    successMessage.innerHTML =
      "Certificate generated successfully! Check your downloads.";
    successMessage.classList.remove("hidden");
    setTimeout(() => successMessage.classList.add("hidden"), 3000);

    // Reset button state
    generateBtn.disabled = false;
    btnText.classList.remove("hidden");
    spinner.classList.add("hidden");
  });
