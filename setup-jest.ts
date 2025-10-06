import { setupZoneTestEnv } from "jest-preset-angular/setup-env/zone";

setupZoneTestEnv();

// Add Jasmine globals for Jest
declare global {
  const jasmine: any;
  const spyOn: any;
}

// Mock jasmine globals
global.jasmine = {
  createSpy: (name: string) => jest.fn().mockName(name)
};

global.spyOn = (obj: any, method: string) => jest.spyOn(obj, method);
