
const bookingController = require('../../../controllers/bookingController');
const Booking = require('../../../models/Booking');

// Mock Booking model
jest.mock('../../../models/Booking', () => ({
  find: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  sort: jest.fn()
}));

describe('Booking Controller', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //-------------------------------------------------------------
  // Tests for list function
  //-------------------------------------------------------------
  describe('list', () => {
    // Test case: list all bookings without filters
    it('deve listar todas as reservas sem filtros', async () => {
      // Mock request object with empty query
      const req = { query: {} };

      // Mock response object
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock booking data
      const mockBookings = [
        {
          _id: 'booking1',
          start_time: new Date('2025-05-15T14:00:00Z'),
          end_time: new Date('2025-05-15T16:00:00Z'),
          room_id: {
            _id: 'room1',
            number: '101',
            type: 'Classroom',
            responsibles: [
              { name: 'Teacher 1', email: 'teacher1@example.com' }
            ]
          },
          user_id: {
            _id: 'user1',
            name: 'John Doe',
            email: 'john@example.com'
          },
          status_booking: 'confirmed',
          key_return: false,
          purpose: 'Class presentation'
        },
        {
          _id: 'booking2',
          start_time: new Date('2025-05-16T10:00:00Z'),
          end_time: new Date('2025-05-16T12:00:00Z'),
          room_id: {
            _id: 'room2',
            number: '102',
            type: 'Laboratory',
            responsibles: [
              { name: 'Teacher 2', email: 'teacher2@example.com' }
            ]
          },
          user_id: {
            _id: 'user2',
            name: 'Jane Smith',
            email: 'jane@example.com'
          },
          status_booking: 'pending',
          key_return: false,
          purpose: 'Lab experiment'
        }
      ];

      // Set up the mock chain
      Booking.find.mockReturnThis();
      Booking.populate.mockReturnThis();
      Booking.sort.mockResolvedValue(mockBookings);

      // Call the function
      await bookingController.list(req, res);

      // Verify that the necessary functions were called with correct parameters
      expect(Booking.find).toHaveBeenCalledWith({});
      expect(Booking.populate).toHaveBeenCalledWith('room_id', 'number type responsibles');
      expect(Booking.populate).toHaveBeenCalledWith('user_id', 'name email');
      expect(Booking.populate).toHaveBeenCalledWith({
        path: 'room_id',
        populate: {
          path: 'responsibles',
          select: 'name email'
        }
      });
      expect(Booking.sort).toHaveBeenCalledWith({ start_time: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        total: 2,
        bookings: expect.any(Array)
      });
      expect(res.json.mock.calls[0][0].bookings.length).toBe(2);
    });

    // Test case: list bookings with user filter
    it('deve listar reservas filtradas por usuário', async () => {
      // Mock request object with user filter
      const req = {
        query: {
          user_id: 'user1'
        }
      };

      // Mock response object
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock filtered booking data
      const mockBookings = [
        {
          _id: 'booking1',
          start_time: new Date('2025-05-15T14:00:00Z'),
          end_time: new Date('2025-05-15T16:00:00Z'),
          room_id: {
            _id: 'room1',
            number: '101',
            type: 'Classroom',
            responsibles: [
              { name: 'Teacher 1', email: 'teacher1@example.com' }
            ]
          },
          user_id: {
            _id: 'user1',
            name: 'John Doe',
            email: 'john@example.com'
          },
          status_booking: 'confirmed',
          key_return: false,
          purpose: 'Class presentation'
        }
      ];

      // Set up the mock chain
      Booking.find.mockReturnThis();
      Booking.populate.mockReturnThis();
      Booking.sort.mockResolvedValue(mockBookings);

      // Call the function
      await bookingController.list(req, res);

      // Verify that the necessary functions were called with correct parameters
      expect(Booking.find).toHaveBeenCalledWith({
        user_id: 'user1'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        total: 1,
        bookings: expect.any(Array)
      });
    });

    // Test case: list bookings with room filter
    it('deve listar reservas filtradas por sala', async () => {
      // Mock request object with room filter
      const req = {
        query: {
          room_id: 'room2'
        }
      };

      // Mock response object
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock filtered booking data
      const mockBookings = [
        {
          _id: 'booking2',
          start_time: new Date('2025-05-16T10:00:00Z'),
          end_time: new Date('2025-05-16T12:00:00Z'),
          room_id: {
            _id: 'room2',
            number: '102',
            type: 'Laboratory',
            responsibles: [
              { name: 'Teacher 2', email: 'teacher2@example.com' }
            ]
          },
          user_id: {
            _id: 'user2',
            name: 'Jane Smith',
            email: 'jane@example.com'
          },
          status_booking: 'pending',
          key_return: false,
          purpose: 'Lab experiment'
        }
      ];

      // Set up the mock chain
      Booking.find.mockReturnThis();
      Booking.populate.mockReturnThis();
      Booking.sort.mockResolvedValue(mockBookings);

      // Call the function
      await bookingController.list(req, res);

      // Verify that the necessary functions were called with correct parameters
      expect(Booking.find).toHaveBeenCalledWith({
        room_id: 'room2'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        total: 1,
        bookings: expect.any(Array)
      });
    });

    // Test case: list active bookings only
    it('deve listar apenas reservas ativas (futuras)', async () => {
      // Mock current date for test consistency
      const mockCurrentDate = new Date('2025-05-10T12:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockCurrentDate);

      // Mock request object with active_only filter
      const req = {
        query: {
          active_only: 'true'
        }
      };

      // Mock response object
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock future bookings
      const mockBookings = [
        {
          _id: 'booking1',
          start_time: new Date('2025-05-15T14:00:00Z'),
          end_time: new Date('2025-05-15T16:00:00Z'),
          room_id: {
            _id: 'room1',
            number: '101',
            type: 'Classroom',
            responsibles: [
              { name: 'Teacher 1', email: 'teacher1@example.com' }
            ]
          },
          user_id: {
            _id: 'user1',
            name: 'John Doe',
            email: 'john@example.com'
          },
          status_booking: 'confirmed',
          key_return: false,
          purpose: 'Class presentation'
        }
      ];

      // Set up the mock chain
      Booking.find.mockReturnThis();
      Booking.populate.mockReturnThis();
      Booking.sort.mockResolvedValue(mockBookings);

      // Call the function
      await bookingController.list(req, res);

      // Verify that the necessary functions were called with correct parameters
      expect(Booking.find).toHaveBeenCalledWith({
        end_time: { $gte: mockCurrentDate }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        total: 1,
        bookings: expect.any(Array)
      });

      // Restore original Date implementation
      global.Date.mockRestore();
    });

    // Test case: list bookings with date range filter
    it('deve listar reservas filtradas por intervalo de datas', async () => {
      // Mock request object with date filters
      const req = {
        query: {
          start_date: '2025-05-15',
          end_date: '2025-05-16'
        }
      };

      // Mock response object
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock bookings in date range
      const mockBookings = [
        {
          _id: 'booking1',
          start_time: new Date('2025-05-15T14:00:00Z'),
          end_time: new Date('2025-05-15T16:00:00Z'),
          room_id: {
            _id: 'room1',
            number: '101',
            type: 'Classroom',
            responsibles: [
              { name: 'Teacher 1', email: 'teacher1@example.com' }
            ]
          },
          user_id: {
            _id: 'user1',
            name: 'John Doe',
            email: 'john@example.com'
          },
          status_booking: 'confirmed',
          key_return: false,
          purpose: 'Class presentation'
        },
        {
          _id: 'booking2',
          start_time: new Date('2025-05-16T10:00:00Z'),
          end_time: new Date('2025-05-16T12:00:00Z'),
          room_id: {
            _id: 'room2',
            number: '102',
            type: 'Laboratory',
            responsibles: [
              { name: 'Teacher 2', email: 'teacher2@example.com' }
            ]
          },
          user_id: {
            _id: 'user2',
            name: 'Jane Smith',
            email: 'jane@example.com'
          },
          status_booking: 'pending',
          key_return: false,
          purpose: 'Lab experiment'
        }
      ];

      // Set up the mock chain
      Booking.find.mockReturnThis();
      Booking.populate.mockReturnThis();
      Booking.sort.mockResolvedValue(mockBookings);

      // Call the function
      await bookingController.list(req, res);

      // Verify that the necessary functions were called with correct parameters
      expect(Booking.find).toHaveBeenCalledWith({
        start_time: {
          $gte: expect.any(Date),
          $lte: expect.any(Date)
        }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        total: 2,
        bookings: expect.any(Array)
      });
    });

    // Test case: handle server error during listing
    it('deve lidar com erros de servidor durante a listagem', async () => {
      // Mock request object
      const req = { query: {} };

      // Mock response object
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock Booking.find to throw an error
      const errorMessage = 'Database query failed';
      Booking.find.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      // Call the function
      await bookingController.list(req, res);

      // Verify that the error is handled correctly
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao buscar reservas',
        detalhes: errorMessage
      });
    });
  });
});