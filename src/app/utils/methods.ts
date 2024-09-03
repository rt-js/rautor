export type LowercaseMethods = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'trace' | 'head';
export type MethodProto = Record<LowercaseMethods, any>;
