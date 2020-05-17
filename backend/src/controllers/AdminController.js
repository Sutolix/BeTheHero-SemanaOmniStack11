const connection = require('../database/connection');
//para criptografia mas usaremos para gerar uma string aleatória para ong
const crypto = require('crypto');


module.exports = {

    async index (request, response) {
    
    const admins = await connection('admins').select('*');
        
    return response.json(admins);
    
    },

    async create(request, response) {
        const { name, email } = request.body;
        //gera 4 bytes de caracteres decimais
        const id = crypto.randomBytes(4).toString('HEX');

        await connection('admins').insert({
            id,
            name,
            email
        })

        return response.send({ id });
    }
};
