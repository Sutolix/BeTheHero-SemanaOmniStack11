const connection = require('../database/connection');

module.exports = {

    async index(request, response) {
        const { page = 1 } = request.query;

        const [ count ] = await connection('incidents').count();

        const incidents = await connection('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        'incidents.*', 
        'ongs.name', 
        'ongs.email', 
        'ongs.whatsapp', 
        'ongs.city', 
        'ongs.uf'
      ]);

        response.header("X-Total-Count", count['count(*)']);

        return response.json(incidents);
    },

    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });

        return response.json({ id });

    },

    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        //Verifica se quem está tentando deletar o incident é a mesma ong que o criou
        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            //como haverá só um incident com o id fornecido, pode se usar o first pra pegar ele
            .first();

        if (incident.ong_id !== ong_id) {
            //status de não autorizado
            return response.status(401).json({ error: 'Operation not permitted.' });
        }

        //Apaga o incident
        await connection('incidents').where('id', id).delete();
        //status de que foi concluído com sucesso mas não há nada para retornar
        return response.status(204).send();
    }
};
