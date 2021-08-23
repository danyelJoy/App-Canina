<?php 

function obtenerServicios() : array {
    try{

        //Imoportar una conexón
        require 'database.php';
        //var_dump($db);

        //Escribir el código SQL
        $sql = 'SELECT * FROM servicios';

        $consulta = mysqli_query($db, $sql);


        //Arreglo vacio
        $servicios = [];
        $i = 0;

        //Obtener los resultados
        // echo "<pre>";
        // $consulta = mysqli_query($db, $sql);        
        // var_dump(mysqli_fetch_assoc($consulta) );
        // echo "</pre>";

        while ($row = mysqli_fetch_assoc($consulta)) {

            $servicios[$i] ['id'] = $row['id'];
            $servicios[$i] ['nombre'] = $row['nombre'];
            $servicios[$i] ['precio'] = $row['precio'];

            $i++;

            // echo "<pre>";
            // var_dump($row);
            // echo "</pre>";

        }
        // echo "<pre>";
        // var_dump(json_encode($servicios));
        // echo "</pre>";

        return $servicios;

        

    } catch (\Throwable $th) {
       //throw $th 
        var_dump($th);

    }    
        
}

obtenerServicios();