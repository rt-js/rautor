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

/**
(r)=>{const m=r.method;if(m==='GET'){const u=r.url,s=u.indexOf('/',12),e=u.indexOf('?',s+1),p=e===-1?u.slice(s):u.substring(s,e);if(p==='/'){const x0=f1();if(Array.isArray(x0)&&x0[0]===eS)
switch(x0[1]){case 0:{const c={status:200,headers:[]};return new Response(f2(c),c);}case 1:{const c={status:200,headers:[]};return new Response(f3(x0[2],c),c);}default:return sE;}
return new Response(f4());}}return nF;}
*/
