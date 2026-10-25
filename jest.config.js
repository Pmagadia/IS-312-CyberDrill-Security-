/** Jest settings. Run the tests with: npm test */
export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/src/test/fileMock.ts',
  },
  setupFiles: ['<rootDir>/src/test/setupPolyfills.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
}
