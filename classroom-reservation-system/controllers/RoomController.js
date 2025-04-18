const Room = require('../models/Room');

exports.register = async (req, res) => {
    try {
        const {
            number,
            type,
            capacity,
            resources,
            status_clean,
            observations,
            responsibles
        } = req.body;

        const existing = await Room.findOne({ number });
        if (existing) {
            return res.status(400).json({ error: 'Sala já cadastrada com esse número.'});
        }

        const room = await Room.create({
            number,
            type,
            capacity,
            resources,
            status_clean,
            observations,
            responsibles
        });

        res.status(201).json({
            message: 'Sala cadastrada com sucesso.',
            room
        });
    } catch (error) {
        res.status(500).json({ error: "erro ao cadastrar a sala", detalhes: error.message });
    }
};