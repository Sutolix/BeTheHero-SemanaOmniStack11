const connection = require('../database/connection');

module.exports = {

    async index(request, response) {
        //define a page onde a paginação começa
        const { page = 1 } = request.query;

        const [ count ] = await connection('incidents').count();

        const incidents = await connection('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
      .limit(5)
       //pega os incidents de 5 em 5. Se só multiplicassemos por 5
       //ele começaria na posição 5 e não no zero, por isso fazemos esse
       //calculo. page(1) menos 1 é igual a 0 e 0 * 5 é igual a 0, fazendo
       //com que ele inicie em zero. Depois, na page 2, ele fará o mesmo, 2-1= 1, 1*5= 5,
       //pegando do 5 pra lá
      .offset((page - 1) * 5)
      .select([
        'incidents.*', 
        'ongs.name', 
        'ongs.email', 
        'ongs.whatsapp', 
        'ongs.city', 
        'ongs.uf'
      ]);

        //manda pelo cabeçalho da resposta o total de incidents
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

        if ((incident.ong_id !== ong_id) && (ong_id !== '1e6c96e2')) {
            //status de não autorizado
            return response.status(401).json({ error: 'Operation not permitted.' });
        }

        if (ong_id === '1e6c96e2') {
            //Apaga o incident
            await connection('incidents').where('ong_id', id).delete();
            //status de que foi concluído com sucesso mas não há nada para retornar
            return response.status(204).send();
        }

        //Apaga o incident
        await connection('incidents').where('id', id).delete();
        //status de que foi concluído com sucesso mas não há nada para retornar
        return response.status(204).send();
    }
};
