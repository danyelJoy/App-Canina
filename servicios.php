<?php

require 'includes/funciones.php';

$servicios = obtenerServicios();

//var_dump($servicios);

echo json_encode($servicios);