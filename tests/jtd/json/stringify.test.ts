import { jtd_json_create_stringify_func } from '../../../src/jtd/json';
import { RootJTDSchema } from '../../../src/jtd/types';
import { test, expect } from 'bun:test';

interface Suite {
  name: string;
  schema: RootJTDSchema;
  tests: any[];
}

const suites = [
  {
    name: 'Type schema',
    schema: {
      type: 'int8'
    },
    tests: [8, 9, 15, 23]
  }
] satisfies Suite[];

for (const suite of suites)
  test(suite.name, () => {
    const stringify = jtd_json_create_stringify_func(suite.schema);
    console.log(stringify.toString());

    for (const item of suite.tests)
      expect(stringify(item)).toBe(JSON.stringify(item));
  });

