<?php
require_once "../includes/config.php";

$pdfFile = '../uploads/pdf_6703fad2bf2b0.pdf'; // Input PDF file path
$svgFile = 'output.svg'; // Desired output SVG file path

// Path to your Python executable
$python = PYTHON_PATH; // Ensure PYTHON_PATH is correctly defined in your config

// Path to the Python script
$script = './pdf-to-svg.py'; // Script path

// Construct the command
$command = escapeshellcmd("$python $script $pdfFile $svgFile 2>&1");

// Print the command for debugging
echo "Executing command: $command\n";

// Execute the command
exec($command, $output, $returnVar);

// Check for success
if ($returnVar === 0) {
    echo "Conversion successful: $svgFile";
} else {
    // Display any errors captured
    echo "Error in conversion. Output: " . implode("\n", $output);
}
