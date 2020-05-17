const connection = require('../database/connection');

module.exports = {
    async create(request, response) {
        const { id } = request.body;

        const admin = await connection('admins')
            .where('id', id)
            .select('name')
            .first();

        if (!admin) {
            //bad request
            return response.status(400).json({ error: 'No Admin found with this ID' });
        }

        return response.json(admin);
    }
}
