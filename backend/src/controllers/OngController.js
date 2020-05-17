const connection = require('../database/connection');
//para criptografia mas usaremos para gerar uma string aleatória para ong
const crypto = require('crypto');


module.exports = {

    async index (request, response) {

    const admin_id = '1e6c96e2';
    const verify = request.headers.authorization;

    if (verify !== admin_id){
        return response.status(401).json({ error: 'Operation not permitted.' });
    }else{
        const ongs = await connection('ongs').select('*');
        
        return response.json(ongs);
    } 
    
    
    },

    async create(request, response) {
        const { name, email, whatsapp, city, uf } = request.body;
        //gera 4 bytes de caracteres decimais
        const id = crypto.randomBytes(4).toString('HEX');

        await connection('ongs').insert({
            id,
            name,
            email,
            whatsapp,
            city,
            uf
        })

        return response.send({ id });
    },

    async delete(request, response) {
        const { id } = request.params;
        const admin_id = request.headers.authorization;

        //Verifica se quem está tentando deletar o incident é a mesma ong que o criou
        const ong = await connection('ongs')
            .where('id', id)
            .select('id')
            //como haverá só uma ong com o id fornecido, pode se usar o first pra pegar ele
            .first();

        if (admin_id !== '1e6c96e2') {
            //status de não autorizado
            return response.status(401).json({ error: 'Operation not permitted.' });
        }

        //Apaga o incident
        await connection('ongs').where('id', id).delete();
        //status de que foi concluído com sucesso mas não há nada para retornar
        return response.status(204).send();
    }
};
