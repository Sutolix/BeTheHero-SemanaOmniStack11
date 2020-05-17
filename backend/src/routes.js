const express = require('express');

const OngController = require('./controllers/OngController');
const AdminController = require('./controllers/AdminController');
const IncidentController = require('./controllers/IncidentController');
const ProfileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController');
const AdminSessionController = require('./controllers/AdminSessionController');

const routes = express.Router();

routes.post('/sessions', SessionController.create);
routes.post('/admsessions', AdminSessionController.create);

routes.get('/ongs', OngController.index);
routes.post('/ongs', OngController.create);
routes.delete('/ongs/:id', OngController.delete);

routes.post('/admins', AdminController.create);

routes.get('/profile', ProfileController.index);

routes.get('/incidents', IncidentController.index);
routes.post('/incidents', IncidentController.create);
routes.delete('/incidents/:id', IncidentController.delete);

module.exports = routes;
