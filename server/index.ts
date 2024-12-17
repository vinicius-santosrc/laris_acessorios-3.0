/**
 * Creation Date: 13/12/2024
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2024, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const cors = require('cors');
const port = 3001;

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const pass = process.env.DB_PASSWORD;
const secretKey = process.env.secretKey;

const connection = mysql.createConnection({
    host: host,
    user: user,
    password: pass,
    database: 'u637683078_laris_acc',
    ssl: {
        rejectUnauthorized: false,
    },
    connectionLimit: 50,
    acquireTimeout: 10000,
    waitForConnections: true,
    reconnect: {
        maxAttempts: 10,
        delay: 3000
    }
})

app.use(express.json());
app.use(cors());

app.get(`/api/v1/${secretKey}/admins`, (req, res) => {
    connection.query('SELECT * FROM administradores', (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao obter dados' });
        } else {
            res.json(result);
        }
    })
});

app.post(`/api/v1/${secretKey}/cupons/myaccount/add`, (req, res) => {
    const item = req.body
    connection.query('UPDATE `users` SET cupons = ?, cupons_usados = ? WHERE uid = ? ', [item.cupons, item.cupom_usado, item.user_uid], (err, result) => {
        if (err) {
            console.error(err);  // Log the error for debugging
            res.status(500).json({ error: 'Erro ao obter dados' });
        } else {
            res.status(200).json({ message: 'Cupom adicionado na conta com sucesso' });
        }
    });
});

app.post(`/api/v1/${secretKey}/products/delete`, (req, res) => {
    const item = req.body
    connection.query('delete from `produtos` where id = ?', [item.id], (err, result) => {
        if (err) {
            console.error(err);  // Log the error for debugging
            res.status(500).json({ error: 'Erro ao obter dados' });
        } else {
            res.status(200).json({ message: 'Produto deletado com sucesso' });
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});