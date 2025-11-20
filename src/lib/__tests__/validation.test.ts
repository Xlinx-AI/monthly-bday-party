import {
  registerSchema,
  loginSchema,
  createEventSchema,
  updateInterestsSchema,
} from '../validation';

describe('validation schemas', () => {
  describe('registerSchema', () => {
    it('validates valid registration data', () => {
      const validData = {
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        password: 'Password123',
        birthDate: '1990-01-01',
        phone: '+79991234567',
        city: 'Москва',
      };
      
      expect(() => registerSchema.parse(validData)).not.toThrow();
    });

    it('rejects invalid email', () => {
      const invalidData = {
        name: 'Иван Иванов',
        email: 'invalid-email',
        password: 'Password123',
        birthDate: '1990-01-01',
      };
      
      expect(() => registerSchema.parse(invalidData)).toThrow();
    });

    it('rejects short name', () => {
      const invalidData = {
        name: 'И',
        email: 'ivan@example.com',
        password: 'Password123',
        birthDate: '1990-01-01',
      };
      
      expect(() => registerSchema.parse(invalidData)).toThrow();
    });

    it('rejects weak password', () => {
      const invalidData = {
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        password: 'weak',
        birthDate: '1990-01-01',
      };
      
      expect(() => registerSchema.parse(invalidData)).toThrow();
    });

    it('rejects password without uppercase', () => {
      const invalidData = {
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        password: 'password123',
        birthDate: '1990-01-01',
      };
      
      expect(() => registerSchema.parse(invalidData)).toThrow();
    });
  });

  describe('loginSchema', () => {
    it('validates valid login data', () => {
      const validData = {
        email: 'user@example.com',
        password: 'Password123',
      };
      
      expect(() => loginSchema.parse(validData)).not.toThrow();
    });

    it('rejects invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'Password123',
      };
      
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });

    it('rejects empty password', () => {
      const invalidData = {
        email: 'user@example.com',
        password: '',
      };
      
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });
  });

  describe('createEventSchema', () => {
    it('validates valid event data', () => {
      const validData = {
        interestId: 'interest-123',
        title: 'День рождения',
        description: 'Празднуем день рождения',
        eventDate: '2024-12-25',
        location: 'Москва, ул. Примерная, 1',
        ticketPrice: 1500,
        maxGuests: 10,
      };
      
      expect(() => createEventSchema.parse(validData)).not.toThrow();
    });

    it('rejects short title', () => {
      const invalidData = {
        interestId: 'interest-123',
        title: 'Hi',
        eventDate: '2024-12-25',
        location: 'Москва',
        ticketPrice: 1500,
        maxGuests: 10,
      };
      
      expect(() => createEventSchema.parse(invalidData)).toThrow();
    });

    it('rejects negative ticket price', () => {
      const invalidData = {
        interestId: 'interest-123',
        title: 'День рождения',
        eventDate: '2024-12-25',
        location: 'Москва',
        ticketPrice: -100,
        maxGuests: 10,
      };
      
      expect(() => createEventSchema.parse(invalidData)).toThrow();
    });

    it('rejects too many guests', () => {
      const invalidData = {
        interestId: 'interest-123',
        title: 'День рождения',
        eventDate: '2024-12-25',
        location: 'Москва',
        ticketPrice: 1500,
        maxGuests: 200,
      };
      
      expect(() => createEventSchema.parse(invalidData)).toThrow();
    });
  });

  describe('updateInterestsSchema', () => {
    it('validates valid interests array', () => {
      const validData = {
        interests: ['спорт', 'музыка', 'путешествия'],
      };
      
      expect(() => updateInterestsSchema.parse(validData)).not.toThrow();
    });

    it('rejects too many interests', () => {
      const invalidData = {
        interests: Array(25).fill('интерес'),
      };
      
      expect(() => updateInterestsSchema.parse(invalidData)).toThrow();
    });
  });
});
