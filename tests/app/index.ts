import { dynamicError, staticError } from '../../src/error';
import { App } from '../../src/app';

const randomError = staticError();
const msgError = dynamicError<string>();

const app = new App()
  // Throw error randomly for testing
  .use(() => {
    if (Math.random() < 0.3) return randomError;
    if (Math.random() < 0.6) return msgError.create('File not found');
  })

  // Static route
  .get('/', {
    type: 'static',
    body: 'Hi'
  })

  // Normal route
  .get('/*', (c) => c.params[0])

  // JSON route
  .get('/json', {
    type: 'json',
    fn: (c) => c
  })

  // Handle static error
  .catch(randomError, (c) => {
    c.status = 500;
    return 'An error occured';
  })

  // Handle dynamic error
  .catch(msgError, (msg, c) => {
    c.status = 404;
    return msg;
  });

const fetch = app.compile();
console.log(fetch.toString());

export default { fetch };
