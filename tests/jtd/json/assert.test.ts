import { jtd_json_create_assert_func } from "../../../src/jtd/json";
import { RootJTDSchema } from "../../../src/jtd/types";
import { test, expect } from 'bun:test';

interface Suite {
  name: string;
  schema: RootJTDSchema;
  tests: {
    value: any;
    valid: boolean;
  }[]
}

const suites = [
  {
    name: 'Type schema',
    schema: {
      type: 'int8'
    },
    tests: [
      { value: null, valid: false },
      { value: 128, valid: false },
      { value: 127, valid: true }
    ]
  },

  {
    name: 'Enum schema',
    schema: {
      enum: ['a', 'b', 'c']
    },
    tests: [
      { value: 'a', valid: true },
      { value: 'd', valid: false },
      { value: 8, valid: false }
    ]
  },

  {
    name: 'Elements schema',
    schema: {
      elements: { type: 'string' }
    },
    tests: [
      { value: [1, '2', null], valid: false },
      { value: ['5', '6', '7'], valid: true }
    ]
  },

  {
    name: 'Object schema',
    schema: {
      properties: {
        name: { type: 'string' },
        age: { type: 'uint8' }
      },
      optionalProperties: {
        isAdmin: { type: 'boolean' }
      }
    },
    tests: [
      {
        value: { name: 'a', age: 18 },
        valid: true
      },
      {
        value: { name: 'b', age: -1 },
        valid: false
      },
      {
        value: { name: 'c', age: 34, isAdmin: true },
        valid: true
      }
    ]
  },

  {
    name: 'Discriminator schema',
    schema: {
      discriminator: 'type',
      mapping: {
        user: {
          properties: {
            name: { type: 'string' }
          }
        },
        admin: {
          properties: {
            name: { type: 'string' },
            pwd: { type: 'string' }
          }
        }
      }
    },
    tests: [
      {
        value: { type: 'user', name: 'a' },
        valid: true
      },
      {
        value: { type: 'admin', name: 'b' },
        valid: false
      },
      {
        value: { type: 'admi', name: 'c', pwd: 't' },
        valid: false
      },
      {
        value: { type: 'admin', name: 'd', pwd: 'k' },
        valid: true
      }
    ]
  },

  {
    name: 'Ref schema',
    schema: {
      definitions: {
        node: {
          properties: {
            store: { type: 'int8' }
          },
          optionalProperties: {
            next: { ref: 'node' }
          }
        }
      },

      properties: {
        items: { elements: { type: 'string' } },
        root: { ref: 'node' }
      }
    },
    tests: [
      {
        value: {
          items: ['a', 'b', 'c'],
          root: {
            store: 0,
            next: {
              store: 2,
              next: {
                store: 1
              }
            }
          }
        },
        valid: true
      }
    ]
  }
] satisfies Suite[];

for (const suite of suites)
  test(suite.name, () => {
    const assert = jtd_json_create_assert_func(suite.schema);
    console.log(assert.toString());

    for (const item of suite.tests)
      expect(assert(item.value) ? item.value : null).toBe(item.valid ? item.value : null);
  });
