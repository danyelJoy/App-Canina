
let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []

}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();

});

function iniciarApp(){
    mostrarServicios();

    //Resalta el Div Actual segun el tab al que se 
    mostrarSeccion();
    //Ocula o muestra la sección segun el tab al que se presiona
    cambiarSeccion();
    //Paginacion siguiente y anterior
    paginaSiguiente();
    paginaAnterior();

    //Comprueba la página actual para ocultar
    botonesPaginador();

    //Muestra el resumen de la cita(o mensaje de error)
    mostrarResumen();
    //Almacen el nombre de la cita
    nombreCita();

    //Almacena la fecha de la cita en el objeto
    fechaCita();
    //Deshabilita días anteriores a la fecha de actual
    deshabilitaFechaAnterior();

    //Almacena la hora
    horaCita();
}
function mostrarSeccion (){

    //Eliminar mostrar-seccion de la sección anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if( seccionAnterior ){
        seccionAnterior.classList.remove('mostrar-seccion');
    }     

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Eliminar la clase actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual')
    if( tabAnterior ) {
        tabAnterior.classList.remove('actual');
    }    

    //Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');


}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt (e.target.dataset.paso);


            mostrarSeccion();
            botonesPaginador();
        })
    })
}

async function mostrarServicios(){
    try {

        //const url = 'http://localhost:3000/servicios.php';

        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();

        const {servicios} = db;
        // Generar el HTML
        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio;


            //DOM Scripting
            // Generar nombre de servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            //Generar el precio del producto

            const precioServicio = document.createElement ('P')
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');
            
            //Generar  div contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //Seleccionar un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;

            // Inyectar precio y nombre el div de servicio

            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);            
            
            //Inyectar en HTML
            document.querySelector('#servicios').appendChild(servicioDiv);
        });        
        
    }catch (error) {
        console.log(error);
    }
}

function seleccionarServicio (e) {

    let elemento;
    //Forzar que el elemento al cual le damos click sea el DIV
    if(e.target.tagName === 'P'){
        elemento = e.target.parentElement;

    }else {
        elemento = e.target;
    }

    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');
        
        const id =parseInt (elemento.dataset.idServicio);
        
        eliminarServicio(id);

    }else {
        elemento.classList.add('seleccionado');
        

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent 
        }
        agregarServicio(servicioObj);
    }
}
function eliminarServicio(id){
    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);
    console.log(cita);
}
function agregarServicio(servicioObj){
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj]

    console.log(cita);
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;

        ;
        botonesPaginador();
    });
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        //console.log(pagina);
        botonesPaginador();
    });
}
 function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1){
        paginaAnterior.classList.add('ocultar')
  
        paginaSiguiente.classList.remove('ocultar');
    } else if (pagina === 3 ) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        mostrarResumen(); // Estamos en la página 3  carga el resumen
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();   

 }

 function mostrarResumen(){
     //destructuring
     const{ nombre, fecha, hora, servicios } = cita;

     //Seleccionar el resumen
     const resumenDiv = document.querySelector('.contenido-resumen');

    //LIMIPA EL HTML
    while( resumenDiv.firstChild ) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }
    

    //Validacion de objeto 
    if(Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos por llenar, hora, fecha o nombre';

        noServicios.classList.add('invalidar-cita');
        //Agregar a resumen Div
        resumenDiv.appendChild(noServicios);

        return;
               
    }
    
    const headingCita = document.createElement('H3');
    headingCita.textContent='Resumen de la Cita'
    // Mostrar resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre: </span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha: </span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Cita: </span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');
    
    const headingServicios = document.createElement('H3');
    headingServicios.textContent='Resumen de servicios'

    serviciosCita.appendChild(headingServicios);
    let cantidad = 0;


    // Iterar sobre  el arreglo de servicios
    servicios.forEach(servicio =>{

        const{nombre, precio} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');
        //console.log(parseInt(totalServicio[1].trim()));
        cantidad += parseInt(totalServicio[1].trim());

        //console.log(textoServicio);

        // Colocar texto y precio
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);
        
    });

    console.log(cantidad);

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);  
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);  
    
    resumenDiv.appendChild(serviciosCita);   
    
    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a pagar:$  </span>${cantidad}`
    resumenDiv.appendChild(cantidadPagar);

 }

 function nombreCita(){
     const nombreInput = document.querySelector('#nombre');

     nombreInput.addEventListener('input', (e) =>{
        const nombreTexto = e.target.value.trim();

        //Validacion de nombre de texto 
        if(nombreTexto === '' || nombreTexto.length < 3 ){
            mostrarAlerta('Nombre no valido', 'error')
            //console.log('nombre no valido');
        } else{
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;
            //console.log(cita);
        }
     });
 }
function mostrarAlerta (mensaje, tipo) {
    //console.log('el mensaje es', mensaje);
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return;
    }


    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error'){
        alerta.classList.add('error')
    }

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);
    //console.log(alerta);

    //Eliminar la alerta después de 3 segundos
    setTimeout(() => {
        alerta.remove();        
    }, 3000);

}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        //console.log(e.target.value);

        const dia = new Date(e.target.value).getUTCDay();

        if([0 , 6].includes(dia)) {
            //console.log('Selecciona una fecha de L a V');
            e.preventDefault();
            fechaInput.value= '';
            mostrarAlerta('Fines de semana fuera de servicio', 'error');
        } else {
            cita.fecha = fechaInput.value;
            console.log(fecha);
        }
        
    });
}

function deshabilitaFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;
    
    const fechaDeshabilitar = `${year}-${mes < 10 ?`0${mes}` : mes}-${dia < 10 ? `0${dia}` :dia }`;

    inputFecha.min = fechaDeshabilitar;
    
    //console.log(fechaDeshabilitar);

}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {
        const horaCita = e.target.value
        const hora = horaCita.split(':')

        if(hora[0] < 10 || hora[0]> 18){
            mostrarAlerta('Hora no valida, sin servicio')
            setTimeout(() => {
                inputHora.value= '';                
            }, 3000);
            
            //console.log('Horario no valido');
        }else {
            cita.hora = horaCita;

            console.log(cita);
        }

        console.log(hora);
    });
}