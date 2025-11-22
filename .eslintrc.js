module.exports = {
  extends: ['next/core-web-vitals'],
  // Workaround for circular reference issue
  ignorePatterns: ['node_modules/', '.next/', 'out/'],
};

