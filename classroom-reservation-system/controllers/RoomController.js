const Room = require('../models/Room');
// Controller for handling room registration
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

// Controller for get room with filters
exports.list = async (req, res) => {
    try {
        const { number, type, capacity, status_clean, resources } = req.query;
        const filters = {};

        if (number) filters.number = number;
        if (type) filters.type = type;
        if (capacity) filters.capacity = { $gte: Number(capacity)}; //operador gte (maior ou igual)
        if (status_clean) filters.status_clean = status_clean;
        if (resources) filters.resources = { $in: [resources] }; //operador in (pertence a lista)

        const rooms = await Room.find(filters).populate('responsibles', 'name email');
        res.status(200).json({total: rooms.length, rooms});
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar as salas", detalhes: error.message });
    }
};

// Controller for update information
exports.update = async (req, res) => {
    try {
        const {id} = req.params;

        const updateRoom = await Room.findByIdAndUpdate(id, req.body, {
            new: true,            // retorna o documento atualizado
            runValidators: true   // aplica validações do modelo (schema)
        });

        if(!updateRoom) {
            return res.status(404).json({ error: 'Sala não encontrada.' });
        }

        res.status(200).json({
            message: 'Sala atualizada com sucesso.',
            room: updateRoom
        });
    } catch (error) {
        res.status(500).json({ error:"Erro ao a tualizar sala", detalhes: error.message });
    }
};