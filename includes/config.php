<?php
// Enable error reporting for development
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

// Define site constants
define('SITE_NAME', 'Gang Sheet Editor'); // Name of the site

// Asset versioning
define('ENV', 'local');
define('ASSETS_VERSION', ENV === 'prod' ? '1.0.0' : time());
define('ASSETS_V', "?v=" . ASSETS_VERSION);

define("PYTHON_PATH", 'C:\\Users\Sohail Akbar\\AppData\\Local\\Programs\\Python\\Python312\\Python.exe');
