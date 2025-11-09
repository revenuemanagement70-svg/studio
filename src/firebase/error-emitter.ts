import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

type Events = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// Extend EventEmitter to provide type-safe event handling
declare interface TypedEventEmitter<T extends Record<string, any>> {
  on<K extends keyof T>(event: K, listener: T[K]): this;
  off<K extends keyof T>(event: K, listener: T[K]): this;
  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): boolean;
}

class TypedEventEmitter<
  T extends Record<string, any>,
> extends EventEmitter {}

export const errorEmitter = new TypedEventEmitter<Events>();
