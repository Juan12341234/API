const express = require("express");
const bodyParser = require('body-parser');
const request = require("request");

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Crear clientes 
router.post('/crearCliente', function (req, res) {
    const { nombre, apellido, edad, tipoIdentificacion, numIdentificacion, email } = req.body;

    const url = "https://aandg-api.onrender.com/api/clientes/";

    request.post({
        url: url,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            nombre,
            apellido,
            edad,
            tipoIdentificacion,
            numIdentificacion,
            email
        })
    }, (error, response, body) => {
        if (error) {
            console.error('Error al enviar la solicitud:', error);
            return res.status(500).send('Error interno al intentar crear el cliente');
        }

        console.log('Respuesta de la API:', body);
        console.log('Registro guardado con éxito');
        res.redirect('/clientes');
    });
});

// Consultar clientes 
router.get('/clientes', function (req, res) {
    const url = "https://aandg-api.onrender.com/api/clientes/";

    request.get({
        url: url,
        headers: { "content-type": "application/json" }
    }, (error, response, body) => {
        if (error) {
            console.error('Error al obtener datos:', error);
            return res.status(500).send('Error interno al obtener datos de clientes');
        }

        console.log('Estos son los datos a consultar');
        const clientes = JSON.parse(body);
        res.render('cliente', { clientes });
    });
});

// Actualizar clientes 
router.post('/editarCliente', function (req, res) {
    const { idEditar, nombreEditar, apellidoEditar, edadEditar, tipoIdentificacionEditar, numIdentificacionEditar, emailEditar } = req.body;

    const url = `https://aandg-api.onrender.com/api/clientes/${idEditar}`;

    request.put({
        url: url,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            nombre: nombreEditar,
            apellido: apellidoEditar,
            edad: edadEditar,
            tipoIdentificacion: tipoIdentificacionEditar,
            numIdentificacion: numIdentificacionEditar,
            email: emailEditar
        })
    }, (error, response, body) => {
        if (error) {
            console.error('Error al enviar la solicitud:', error);
            return res.status(500).send('Error interno al intentar actualizar el cliente');
        }

        console.log('Registro actualizado con éxito');
        res.redirect('/clientes');
    });
});

// Eliminar clientes 
router.get('/eliminarCliente/:id', function (req, res) {
    const clienteId = req.params.id;
    const url = `https://aandg-api.onrender.com/api/clientes/${clienteId}`;

    request.delete({
        url: url,
        headers: { "content-type": "application/json" }
    }, (error, response, body) => {
        if (error) {
            console.error('Error al enviar la solicitud:', error);
            return res.status(500).send('Error interno al intentar eliminar el cliente');
        }

        console.log('Registro eliminado con éxito');
        res.redirect('/clientes');
    });
});

module.exports = router;
