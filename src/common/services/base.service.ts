import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export abstract class BaseService {
  constructor(protected readonly prisma: PrismaService) {}

  /**
   * Handle database errors and convert them to appropriate exceptions
   */
  protected handleDatabaseError(error: any, operation: string): never {
    if (error.code === 'P2002') {
      // Unique constraint violation
      throw new Error(`${operation} failed: Record already exists`);
    } else if (error.code === 'P2025') {
      // Record not found
      throw new Error(`${operation} failed: Record not found`);
    } else if (error.code === 'P2003') {
      // Foreign key constraint violation
      throw new Error(`${operation} failed: Related record not found`);
    } else {
      throw new Error(`${operation} failed: ${error.message}`);
    }
  }

  /**
   * Generate a unique identifier
   */
  protected generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Sanitize string input
   */
  protected sanitizeString(input: string): string {
    return input.trim().replace(/\s+/g, ' ');
  }

  /**
   * Validate email format
   */
  protected isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get current timestamp
   */
  protected getCurrentTimestamp(): Date {
    return new Date();
  }

  /**
   * Format date to ISO string
   */
  protected formatDate(date: Date): string {
    return date.toISOString();
  }
}
