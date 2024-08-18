import { group, bench, run } from 'mitata';

for (let i = 0; i < 10; i++) bench('noop', () => { });

group('Stringify tuple', () => {
  const collectionItems = ['anitem', 'otheritem', 'yetanother', 'iteminthetuple'];
  const checkItem = Function(`return (s)=>${collectionItems.map((item) => `s===${JSON.stringify(item)}?${JSON.stringify(JSON.stringify(item))}:`).join('')}s`)();
  console.log(checkItem.toString());

  const items = new Array(100000).fill(0).map(() => collectionItems[Math.round(Math.random() * (collectionItems.length - 1))]);

  // @ts-ignore
  bench('Manual', () => items.map(JSON.stringify));
  bench('Check item', () => items.map(checkItem));
});

run();
