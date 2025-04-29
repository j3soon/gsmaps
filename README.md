# GSMaps

Google maps but its gaussian splats\
with a hint of Omniverse magic

## Developing

Clone the project

```bash
git clone https://github.com/Joshimello/gsmaps.git
cd gsmaps
```

You can use `bun` or `npm` to install dependencies and run the project,\
but I would highly recommend using `bun` for its faster performance.

```bash
# installing dependencies
bun i # or npm i

# starting dev server
bun run dev # or npm run dev
```

## Connecting with Omniverse stream

The config for Omniverse is located at

```bash
src/lib/omni.ts
```

Modify the config object in the file

```ts
export const omniverseConfig: OmniverseConfig = {
	serverIp: '172.28.33.205', // Change this to your Omniverse server IP
	signalingPort: 49100, // Default signaling port for Omniverse streaming
	mediaPort: 1024, // Default media port for Omniverse streaming
	streamSource: 'direct'
};
```
