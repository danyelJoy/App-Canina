<?php 

$db = mysqli_connect('localhost','root','', 'appestetica');
$db->set_charset('utf8');

if(!$db){
    echo "Error en la conexión";
} 
