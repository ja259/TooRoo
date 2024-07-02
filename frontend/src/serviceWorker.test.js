import * as serviceWorker from './serviceWorker';

describe('Service Worker', () => {
    it('should register service worker in production', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';
        const mockRegister = jest.fn();
        navigator.serviceWorker = {
            register: mockRegister,
        };
        window.addEventListener = jest.fn((event, callback) => {
            if (event === 'load') {
                callback();
            }
        });

        serviceWorker.register();

        expect(mockRegister).toHaveBeenCalled();
        process.env.NODE_ENV = originalEnv;
    });

    it('should not register service worker in development', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';
        const mockRegister = jest.fn();
        navigator.serviceWorker = {
            register: mockRegister,
        };
        window.addEventListener = jest.fn((event, callback) => {
            if (event === 'load') {
                callback();
            }
        });

        serviceWorker.register();

        expect(mockRegister).not.toHaveBeenCalled();
        process.env.NODE_ENV = originalEnv;
    });

    it('should unregister service worker', () => {
        const mockUnregister = jest.fn();
        navigator.serviceWorker = {
            ready: Promise.resolve({
                unregister: mockUnregister,
            }),
        };

        serviceWorker.unregister();

        expect(mockUnregister).toHaveBeenCalled();
    });
});
