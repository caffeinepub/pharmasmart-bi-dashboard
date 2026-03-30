import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Medicine {
    id: string;
    reorderPoint: bigint;
    name: string;
    isActive: boolean;
    category: string;
    unitPrice: number;
    currentStock: bigint;
}
export interface HighValueCustomer {
    id: string;
    name: string;
    orderCount: bigint;
    lastPurchaseMonth: string;
    totalSpent: number;
}
export interface FrequentCustomer {
    id: string;
    name: string;
    orderCount: bigint;
    lastPurchaseMonth: string;
    totalSpent: number;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMedicine(input: Medicine): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllMedicines(): Promise<Array<Medicine>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFrequentCustomers(threshold: bigint): Promise<Array<FrequentCustomer>>;
    getHighValueCustomers(threshold: number): Promise<Array<HighValueCustomer>>;
    getMedicineById(id: string): Promise<Medicine>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateMedicine(input: Medicine): Promise<void>;
}
