import express from 'express'

import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize('deploy_nodejs', 'postgres', 'teste123', {
    host: 'deploy-nodejs.c7oi6egs4yoh.us-east-1.rds.amazonaws.com',
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

const usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: DataTypes.TEXT,
    senha: DataTypes.TEXT
});

const app = express()

app.use(express.json())

app.get("/teste/:nome/:senha", async (req, res) => {
    try {
        await sequelize.authenticate();
        console.log("Conexão estabelecida com o banco de dados")
        await usuario.sync()
        const novoUsuario = await usuario.create({
            nome: req.params.nome,
            senha: req.params.senha,
        });
        res.send("USUARIO INSERIDO", req.params.nome, req.params.senha)
    } catch (error) {
        res.send(error)
        console.log("Deu merda")
    } finally {
        sequelize.close()
    }
})

app.get("/", (req, res) => {
    console.log("E AGORA")
    res.send("EU MUDEI")
})



app.listen(3001, () => console.log("server rodando"))