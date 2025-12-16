export interface ElectronAPI {
    saveData: (data: any) => Promise<boolean>;
    getData: () => Promise<any>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
