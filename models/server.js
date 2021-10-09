const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            categorias: '/api/categorias',
            buscar: '/api/buscar',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
            auth: '/api/auth',

        }



        // Conectar a base de datos 
        this.conectarDB();

        //Middlewares
        this.middlewares();


        //Rutas de mi app
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        //Cors
        this.app.use( cors() );

        //lectura y parseo del Body
        this.app.use( express.json() );

        //Directorio publico
        this.app.use(express.static('public'))


    }

    routes() {

        this.app.use( this.paths.auth, require('../routes/auth') );
        this.app.use( this.paths.buscar, require('../routes/buscar') );
        this.app.use( this.paths.categorias, require('../routes/categorias') );
        this.app.use( this.paths.productos, require('../routes/productos') );
        this.app.use( this.paths.usuarios, require('../routes/usuarios') );


    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor correindo en puerto', this.port);
        });

    }

}


module.exports = Server;

