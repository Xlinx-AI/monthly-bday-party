import { cn, generateTicketNumber, formatPrice, formatDate } from '../utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('handles conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    });
  });

  describe('generateTicketNumber', () => {
    it('generates ticket number with 12DR prefix', () => {
      const ticket = generateTicketNumber();
      expect(ticket).toMatch(/^12DR-[A-Z0-9]+-[A-F0-9]{8}$/);
    });

    it('generates unique ticket numbers', () => {
      const ticket1 = generateTicketNumber();
      const ticket2 = generateTicketNumber();
      expect(ticket1).not.toBe(ticket2);
    });
  });

  describe('formatPrice', () => {
    it('formats number to RUB currency', () => {
      const formatted = formatPrice(1000);
      expect(formatted).toContain('1');
      expect(formatted).toContain('000');
    });

    it('formats string number to RUB currency', () => {
      const formatted = formatPrice('2500.50');
      expect(formatted).toContain('2');
      expect(formatted).toContain('500');
    });
  });

  describe('formatDate', () => {
    it('formats Date object to Russian locale', () => {
      const date = new Date('2024-12-25T10:30:00');
      const formatted = formatDate(date);
      expect(formatted).toContain('2024');
      expect(formatted).toContain('25');
    });

    it('formats date string to Russian locale', () => {
      const dateString = '2024-06-15T14:00:00';
      const formatted = formatDate(dateString);
      expect(formatted).toContain('2024');
      expect(formatted).toContain('15');
    });
  });
});
