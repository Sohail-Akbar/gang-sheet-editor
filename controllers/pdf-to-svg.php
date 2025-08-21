<?php
require_once "../includes/config.php";

// Allow error reporting for debugging (optional)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if a PDF file has been uploaded
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['pdfFile'])) {
    $pdfFile = $_FILES['pdfFile'];

    // Check for upload errors
    if ($pdfFile['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'File upload error']);
        exit;
    }

    // Set a temporary file path
    $fileName = 'pdf_' . uniqid() . '.pdf'; // Unique file name
    $tempFilePath = "../uploads/" . $fileName; // Correcting the file path

    // Move the uploaded file to the temporary path
    if (!move_uploaded_file($pdfFile['tmp_name'], $tempFilePath)) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not move uploaded file']);
        exit;
    }

    // Prepare to call the Python script
    $pythonScript = 'pdf-to-svg.py'; // Update with the actual path to your Python script

    // Use double quotes around the Python path and script path
    $command = '"' . PYTHON_PATH . '"   "' . realpath($pythonScript) . '"  "' . realpath($tempFilePath) . '" 2>&1';

    // Execute the Python script and capture the output
    $output = shell_exec($command);
    echo $command;
    // Check if output is empty and handle accordingly
    if ($output === null || $output === '') {
        http_response_code(500);
        echo json_encode(['error' => 'PDF to SVG conversion failed. No output returned.']);
        exit;
    }

    // Clean up the temporary file
    unlink($tempFilePath);

    // Respond with the SVG data
    header('Content-Type: application/json');
    echo json_encode(['svg' => $output]);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'No PDF file uploaded']);
}
