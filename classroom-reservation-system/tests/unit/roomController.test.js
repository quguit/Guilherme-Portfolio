//import 
const { JsonWebTokenError } = require('jsonwebtoken');
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
});
