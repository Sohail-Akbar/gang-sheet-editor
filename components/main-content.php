<div class="main-container pt-5">
    <div class="row mx-0">
        <!-- Cards -->
        <div class="col-md-5">
            <div class="card border">
                <div class="card-body py-4 px-3">
                    <div class="d-flex">
                        <div class="single-item">
                            <img src="./images/download.jpeg" class="img-fluid" alt="Gellery">
                            <p class="text-gray-800 fw-bold mb-0">Motiv 1</p>
                        </div>
                        <div class="single-item">
                            <img src="./images/download.jpeg" class="img-fluid" alt="Gellery">
                            <p class="text-gray-800 fw-bold mb-0">Motiv 2</p>
                        </div>
                        <div class="single-item">
                            <img src="./images/download.jpeg" class="img-fluid" alt="Gellery">
                            <p class="text-gray-800 fw-bold mb-0">Motiv 3</p>
                        </div>
                    </div>
                    <a href="#" class="text-gray-800 text-hover-primary d-flex flex-column text-right mt-3">
                        Alle Mative azeigen
                    </a>
                </div>
            </div>
        </div>
        <div class="col-md-5">
            <div class="card border">
                <div class="card-body py-4 px-3">
                    <div class="d-flex">
                        <div class="single-item">
                            <img src="./images/download.jpeg" class="img-fluid" alt="Gellery">
                            <p class="text-gray-800 fw-bold mb-0">Motiv 1</p>
                        </div>
                        <div class="single-item">
                            <img src="./images/download.jpeg" class="img-fluid" alt="Gellery">
                            <p class="text-gray-800 fw-bold mb-0">Motiv 2</p>
                        </div>
                        <div class="single-item">
                            <img src="./images/download.jpeg" class="img-fluid" alt="Gellery">
                            <p class="text-gray-800 fw-bold mb-0">Motiv 3</p>
                        </div>
                    </div>
                    <a href="#" class="text-gray-800 text-hover-primary d-flex flex-column text-right mt-3">
                        Alle Drukbogen azeigen
                    </a>
                </div>
            </div>
        </div>
        <!-- cards end -->
    </div>
    <div class="row mx-0 mt-5">
        <!-- list items -->
        <?php for ($i = 0; $i < 6; $i++) {  ?>
            <div class="col-md-4 mb-3">
                <div class="card border p-2">
                    <div class="media">
                        <div>
                            <img src="./images/download.jpeg" class="mr-3" alt="...">
                            <p class="fw-bold fs-9 text-gray-700 mb-1">Qualitat Optionale Auding</p>
                            <div class="d-flex justify-content-between">
                                <p class="fw-bold fs-9 text-gray-700 mb-0">DPI: 72 dpi</p>
                                <p class="color-box bg-success mx-4 mb-0"></p>
                            </div>
                        </div>
                        <div class="media-body">
                            <div class="qty-header d-flex justify-content-between mt-4">
                                <p class="text-gray-800 fs-8 fw-bold mb-0">Breite:</p>
                                <div class="d-flex w-100 flex-row-reverse">
                                    <span class="mx-1">mm</span>
                                    <input type="number" class="w-30px">
                                </div>
                            </div>
                            <div class="qty-header d-flex justify-content-between mt-4">
                                <p class="text-gray-800 fs-8 fw-bold mb-0">Hole:</p>
                                <div class="d-flex w-100 flex-row-reverse">
                                    <span class="mx-1">mm</span>
                                    <input type="number" class="w-30px">
                                </div>
                            </div>
                            <div class="qty-header d-flex justify-content-between mt-4">
                                <p class="text-gray-800 fw-bold mb-0 fs-8">Anzahl:</p>
                                <div class="d-flex w-100 flex-row-reverse">
                                    <!--begin::Dialer-->
                                    <div class="input-group w-65px"
                                        data-kt-dialer="true"
                                        data-kt-dialer-currency="true"
                                        data-kt-dialer-min="0"
                                        data-kt-dialer-max="10"
                                        data-kt-dialer-step="1"
                                        data-kt-dialer-prefix="">

                                        <!--begin::Decrease control-->
                                        <button class="btn btn-icon btn-outline btn-active-color-primary" type="button" data-kt-dialer-control="decrease">
                                            <i class="ki-duotone ki-minus fs-2"></i>
                                        </button>
                                        <!--end::Decrease control-->

                                        <!--begin::Input control-->
                                        <input type="text" class="form-control py-0 px-0" readonly placeholder="Amount" value="$10000" data-kt-dialer-control="input" />
                                        <!--end::Input control-->

                                        <!--begin::Increase control-->
                                        <button class="btn btn-icon btn-outline btn-active-color-primary" type="button" data-kt-dialer-control="increase">
                                            <i class="ki-duotone ki-plus fs-2"></i>
                                        </button>
                                        <!--end::Increase control-->
                                    </div>
                                    <!--end::Dialer-->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <?php } ?>
        <div class="col-md-12">
            <button class="btn btn-primary mb-4">Zur Drukb agmaisht</button>
        </div>
    </div>
</div>