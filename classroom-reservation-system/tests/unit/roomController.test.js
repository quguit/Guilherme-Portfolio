//import 
const roomController = require('../../controllers/roomController');
const Room = require('../../models/Room');



//Mock room model
jest.mock('../../models/Room', () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn().mockReturnThis(),
    populate: jest.fn(),
    findByIdAndUpdate: jest.fn(),
}));

describe('RoomController', () => {
    //clear all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test for create function
    describe('create', () => {
        //Test for successful create room
        it('deve criar sala com sucesso', async () => {
            // Mock request object
            const req = {
                body: {
                    number: '101',
                    type: 'Classroom',
                    capacity: 30,
                    resources: ['projector', 'whiteboard'],
                    status_clean: 'clean',
                    observations: 'New room',
                    responsibles: ['609c2470e4b08c001a3d63e5']
                }
            };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // mock room.findOne to return null (no existing room)
            Room.findOne.mockReturnValue(null);

            //mock created room response
            const createdRoom = {
                ...req.body,
                _id: 'mockId12'
            };
            Room.create.mockResolvedValue(createdRoom);

            // call the function
            await roomController.create(req, res);

            // verify that the necessary function were called with correct parameters
            expect(Room.findOne).toHaveBeenCalledWith({ number: req.body.number});
            expect(Room.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Sala cadastrada com sucesso.',
                room: createdRoom
            });
        });

        //test case: attempt to create a room with an existing number
        it('deve retornar erro, quando numero da sala ja esta cadastrado', async () => {
            // Mock request object
            const req = {
                body: {
                    number: '101',
                    type: 'Classroom',
                    capacity: 30,
                    resources: ['projector', 'whiteboard'],
                    status_clean: 'clean',
                }
            };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // mock room.findOne to return an existing room
            Room.findOne.mockReturnValue({ number: req.body.number });

            // call the function
            await roomController.create(req, res);

            // verify that the necessary function were called with correct parameters
            expect(Room.findOne).toHaveBeenCalledWith({ number: req.body.number });
            expect(Room.create).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Sala já cadastrada com esse número.' });
  
        });

        //Test case: handle server error during creation
        it('deve lidar com erros do servidor durante a criação', async () => {
            //mock request object
            const req = {
                body: {
                    number: '202',
                    type: 'Classroom'
                }
            };

            // mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            //mock room.findOne to throw an eror
            const errorMessage = 'Database conection failed';
            Room.findOne.mockRejectedValue( new Error(errorMessage));

            // call the function
            await roomController.create(req,res);

            //verify that the eror is handled correctly
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'erro ao cadastrar a sala',
                detalhes: errorMessage
            });
        });
    });
    //-------------------------------------------------
    // Test for List funcition
    describe('List', () => {
        //Test case: list all rooms without filters
        it('deve listar todas as salas sem filtros', async () => {
            // Mock request object with empty query
            const req = { query: {} };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock room data
            const mockRooms = [
                { number: '101', type: 'Classroom' },
                { number: '102', type: 'Laboratory' }
            ];
            // set up the mock chain
            Room.find.mockReturnThis();
            Room.populate.mockResolvedValue(mockRooms);

            // Call the function
            await roomController.list(req, res);

            // Verify that the necessary functions were called with correct parameters
            expect(Room.find).toHaveBeenCalledWith({});
            expect(Room.populate).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                total: 2,
                rooms: mockRooms
            });
        });

        //Test case: list rooms with filters
        it('deve listar salas com filtros aplicados', async () => {
            // Mock requesst object with filters
            const req = {
                query: {
                     number: '101',
                     type: 'Classroom',
                     capacity: 20,
                     status_clean: 'clean',
                     resources: 'projector'
                }
            };

            // mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            //mock filtered room data
            const mockRooms = [
                {_id:'1', number: '101', type: 'Classroom', capacity: 20, status_clean: 'clean', resources: ['projector'] }
            ];

            //set up the mock chain
            Room.find.mockReturnThis();
            Room.populate.mockResolvedValue(mockRooms);

            // call the function
            await roomController.list(req, res);

            //verify the that the necessary functions were called with correct parameters
            expect(Room.find).toHaveBeenCalledWith({
                number: '101',
                type: 'Classroom',
                capacity: { $gte: 20 },
                status_clean: 'clean',
                resources: { $in: ['projector'] }
            });
            expect(Room.populate).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                total: 1,
                rooms: mockRooms
            });
        });

        //Test case: handle server error during listing
        it('deve lidar com erros do servidor durante a listagem', async () => {
            // Mock request object
            const req = { query: {} };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock room.find to throw an error
            const errorMessage = 'Database query failed';
            Room.find.mockImplementation(() => {
                throw new Error(errorMessage);
            });

            // Call the function
            await roomController.list(req, res);

            // Verify that the error is handled correctly
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erro ao buscar as salas',
                detalhes: errorMessage
            });
        });
    });


  //-------------------------------------------------------------
  // Tests for update function
  //-------------------------------------------------------------
  
    describe('update', () => {
        // Test case: successfully update a room
        it('deve atualizar uma sala com sucesso', async () => {
            // Mock request object
            const req = {
                params: { id: 'roomId123' },
                body: {
                number: '101',
                type: 'Updated Type',
                capacity: 35
                }
            };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock updated room data
            const updatedRoom = {
                _id: 'roomId123',
                ...req.body
            };

            // Mock Room.findByIdAndUpdate to return updated room
            Room.findByIdAndUpdate.mockResolvedValue(updatedRoom);

            // Call the function
            await roomController.update(req, res);

            // Verify that the necessary functions were called with correct parameters
            expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
                req.params.id,
                req.body,
                {
                new: true,
                runValidators: true
                }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Sala atualizada com sucesso.',
                room: updatedRoom
            });
            });

        // Test case: attempt to update a non-existent room
        it('deve retornar erro ao tentar atualizar uma sala inexistente', async () => {
            // Mock request object
            const req = {
                params: { id: 'nonExistentId' },
                body: {
                number: '999',
                type: 'Non-existent Room'
                }
            };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock Room.findByIdAndUpdate to return null (room not found)
            Room.findByIdAndUpdate.mockResolvedValue(null);

            // Call the function
            await roomController.update(req, res);

            // Verify that the necessary functions were called with correct parameters
            expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
                req.params.id,
                req.body,
                {
                new: true,
                runValidators: true
                }
            );
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Sala não encontrada.' });
            });

        // Test case: handle server error during update
        it('deve lidar com erros de servidor durante a atualização', async () => {
            // Mock request object
            const req = {
                params: { id: 'roomId123' },
                body: {
                number: '101'
                }
            };

            // Mock response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock Room.findByIdAndUpdate to throw an error
            const errorMessage = 'Update operation failed';
            Room.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

            // Call the function
            await roomController.update(req, res);

            // Verify that the error is handled correctly
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erro ao a tualizar sala',
                detalhes: errorMessage
            });
        });
    });

});
