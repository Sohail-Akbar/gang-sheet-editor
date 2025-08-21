<?php

use Spatie\PdfToImage\Pdf;

$pdf = new Pdf('.');
$pdf->saveImage('output.svg');
