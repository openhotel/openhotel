# @oh/config

Exposed functions

## getConfig

```ts
type ConfigType = {
  foo: string;
};
const config = await getConfig<ConfigType>({
  defaults: { foo: "faa" },
  values?: { foo: "fii" },
  fileName?: 'something.yml'
});
```
