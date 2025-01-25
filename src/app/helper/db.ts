import { Employee } from "../models/employee.model";

const DATABASE_NAME = 'Employee Management';
const DB_VERSION = 1;
const TABLE_NAME = 'Employee Data';

/**
 * Initializing and setting up IndexedDB
 * @return { Promise<IDBDatabase> }
 */
export const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DATABASE_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(TABLE_NAME)) {
                db.createObjectStore(TABLE_NAME, {
                    keyPath: 'id',
                    autoIncrement: true
                })
            }
        }

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    })
}

/**
 * Function to get employee data from IndexedDB
 * @return { Promise<Employee[]> }
 */
export const getEmployees = async (): Promise<Employee[]> => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(TABLE_NAME, 'readonly');
        const table = transaction.objectStore(TABLE_NAME);
        const request = table.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    })
}

/**
 * Function to add new entry to the database
 * @param { Employee } employee new data
 * @return { Promise<void> }
 */
export const addEmployee = async (employee: Employee): Promise<void> => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(TABLE_NAME, 'readwrite');
        const table = transaction.objectStore(TABLE_NAME);
        const request = table.add(employee);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    })
}

/**
 * Fuction to remove an entry from the database by it's Id
 * @param { number } id Id of the entry
 * @return { Promise<void> }
 */
export const removeEmployee = async (id: number): Promise<void> => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(TABLE_NAME, 'readwrite');
        const table = transaction.objectStore(TABLE_NAME);
        const request = table.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    })
}

/**
 * Updating a single entry
 * @param { Employee } employee updated data
 * @return { Promise<void> }
 */
export const updateEmployee = async (employee: Employee): Promise<void> => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(TABLE_NAME, 'readwrite');
        const table = transaction.objectStore(TABLE_NAME);
        const request = table.put(employee);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    })
}