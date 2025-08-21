<?php require_once "./includes/config.php"; ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= SITE_NAME ?></title>
    <link rel="stylesheet" href="./assets/css/plugins.bundle.css<?= ASSETS_V ?>">
    <link rel="stylesheet" href="./assets/css/style.bundle.css<?= ASSETS_V ?>">
    <link rel="stylesheet" href="./assets/css/fullcalendar.bundle.css<?= ASSETS_V ?>">
    <link rel="stylesheet" href="./assets/css/style.css<?= ASSETS_V ?>">
</head>

<body>
    <?php require_once "./includes/navbar.php"; ?>
    <div class="gang-sheet-editor mx-5">
        <div class="row mx-0">
            <div class="col-md-3">
                <?php require_once "./components/sidebar-content.php"; ?>
            </div>
            <div class="col-md-9">
                <?php require_once "./components/main-content.php"; ?>
            </div>
        </div>
    </div>


    <script src="./assets/js/plugins.bundle.js<?= ASSETS_V ?>"></script>
    <script src="./assets/js/scripts.bundle.js<?= ASSETS_V ?>"></script>
    <script src="./assets/js/fullcalendar.bundle.js<?= ASSETS_V ?>"></script>
</body>

</html>