<div class="left-content-header mt-3">
    <div class="file-upload">
        <span class="fw-bold fs-3 text-gray-800">Uploade Ihrer Dateien</span>
        <div class="drop_box">
            <header>
                <h4>Select File here</h4>
            </header>
            <p>Files Supported: PDF, TEXT, DOC, DOCX</p>

            <!-- Form to handle file upload -->
            <input type="file" name="file" accept=".doc,.docx,.pdf" id="fileID" class="d-none">
            <!-- Label to trigger file input -->
            <label for="fileID">
                <button type="button" class="btn btn-primary" onclick="document.getElementById('fileID').click();">Choose File</button>
            </label>
        </div>
    </div>
    <span class="fw-bold fs-3 text-gray-800">Allgemeine Einstellungen:</span>
    <!-- qty -->
    <div class="qty-header d-flex justify-content-between mt-4">
        <p class="text-gray-800 fw-bold mb-0">Abstand zwischen den mativen:</p>
        <div class="d-flex w-25">
            <input type="number" class="w-100">
            <span class="mx-2">cm</span>
        </div>
    </div>
    <!-- weitere bereiche -->
    <div class="mt-5">
        <span class="fw-bold fs-3 text-gray-800">Weitere Bereiche:</span>
        <div class="mt-5">
            <button class="btn btn-primary mb-4">Bgne Motive und Drckbagen</button>
            <button class="btn btn-primary">Bgne Motive und Drckbagen</button>
        </div>
    </div>
    <!-- informationen: -->
    <div class="informationen mt-5">
        <span class="fw-bold fs-3 text-gray-800">Informationen:</span>
        <div class="single-info-item">
            <span class="fw-bold fs-8 text-gray-700">Lorem ipsum dolor sit amet.</span>
            <p class="color-box bg-success mx-4 mb-0"></p>
        </div>
        <div class="single-info-item">
            <span class="fw-bold fs-8 text-gray-700">Lorem ipsum dolor sit amet.</span>
            <p class="color-box bg-warning mx-4 mb-0"></p>
        </div>
        <div class="single-info-item">
            <span class="fw-bold fs-8 text-gray-700">Lorem ipsum dolor sit amet.</span>
            <p class="color-box bg-danger mx-4 mb-0"></p>
        </div>
        <div class="single-info-item">
            <span class="fw-bold fs-8 text-gray-700">Lorem ipsum dolor sit amet.</span>
            <p class="color-box bg-danger mx-4 mb-0"></p>
        </div>
    </div>
</div>