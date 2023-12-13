const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require("jsonwebtoken");
const keys = require("./settings/keys");
const usuarioShema = require("./Models/usuario");
var bodyParser  = require('body-parser');
const port = 3000;
var request     = require("request");
var bodyParser  = require('body-parser');

app.set("key", keys.key);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const clienteRoute = require("./routes/clientes");
const viewsPath = path.join(__dirname, 'views');
const publicPath = path.join(__dirname, 'public');


app.set('view engine', 'ejs');
app.set('views', viewsPath);
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(clienteRoute);

app.get('/', (req, res) => {
    res.render('login', {tituloWeb:'Login'});
});

app.get('/signup', (req, res) => {
    res.render('signup', {tituloWeb:'Signup'});
});

app.get('/clientes', (req, res) => {
    res.render('cliente');
});

// Conection to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Conectado con MongoDB Atlas"))
.catch((error)=>console.log(error));

app.listen(port, () => {
    console.log('Conectado al puerto', port);
});



app.post("/login", async (req, res) => {
    const { usuario, clave, token } = req.body;

    try {
        const user = await usuarioShema.findOne({ usuario });

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        const validarClave = user.clave === clave;

        if (!validarClave) {
            return res.status(401).send("Contraseña incorrecta");
        }

        // Verifica el token de sesión
        jwt.verify(token, app.get('key'), (error, decoded) => {
            if (error) {
                return res.status(401).send("Token de sesión inválido");
            } else {
                // Si el token es válido, redirige al dashboard
                return res.redirect('/clientes');
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al iniciar sesión");
    }
});





app.post('/token', async (req, res) => {
    const { usuario, clave } = req.body;

    try {
        const usuarioExistente = await usuarioShema.findOne({ usuario });

        if (usuarioExistente) {
            return res.status(409).send("Este usuario ya está en uso");
        }

        const newUser = new usuarioShema({ usuario, clave });
        await newUser.save();

        const payload = {
            usuario: newUser.usuario,
            clave: newUser.clave 
        };

        const token = jwt.sign(payload, app.get('key'), {
            expiresIn: '1d'
        });

        res.render('token', {token})

    } catch (error) {
        console.error(error);
        res.status(500).send("Error creando el usuario");
    }
});

app.use((req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(401).send({
            error: 'Es necesario un token de autenticación'
        });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, app.get('key'), async (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    message: 'El token no es válido'
                });
            } else {
                try {
                    const user = await usuarioShema.findOne({ usuario: decoded.usuario });

                    if (!user) {
                        return res.status(404).send("Usuario no encontrado");
                    }
                    req.user = user;
                    next();
                } catch (err) {
                    console.error(err);
                    res.status(500).send("Error obteniendo información del usuario");
                }
            }
        });
    }
});



app.get('/info', (req, res) => {
    const user = req.user;

    res.json({
        message: `INFORMACION CONTABLE PRIVADA para ${user.usuario}`,
        userInfo: {
            usuario: user.usuario,
            clave: user.clave 
        }
    });
});