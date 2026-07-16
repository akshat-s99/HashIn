import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import request from 'supertest'; // Oh we don't have supertest. 

const app = express();
app.use(express.json());
app.use(mongoSanitize());
app.post('/', (req, res) => res.json(req.body));

console.log('Sanitize loaded');
