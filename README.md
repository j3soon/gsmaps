# GSMaps

> Please note that this repo `j3soon/gsmaps` is a fork of [`Joshimello/gsmaps`](https://github.com/Joshimello/gsmaps) for the purpose of submitting pull requests to the original repo. Please consider starring the original repo instead of this fork.

Google maps but its gaussian splats\
with a hint of Omniverse magic

## Running with Docker

Clone the project

```bash
git clone https://github.com/Joshimello/gsmaps.git
cd gsmaps
```

Build the docker image

```bash
docker build -t joshimello/gsmaps .
```

Run the docker container

```bash
docker run -p 3000:3000 joshimello/gsmaps
```

There are some environment variables you can set to customize the container

```bash
docker run -p 3000:3000 \
  -e PORT=3000 \
  -e HOST=0.0.0.0 \
  -e OMNIVERSE_SERVER_IP=127.0.0.1 \
  -e OMNIVERSE_SIGNALING_PORT=49100 \
  -e OMNIVERSE_MEDIA_PORT=1024 \
  -e OMNIVERSE_STREAM_SOURCE=direct \
  joshimello/gsmaps
```

For debugging purposes:

```sh
docker run --rm -it -p 5173:5173 \
  -v ${PWD}:/app \
  --entrypoint /bin/bash \
  joshimello/gsmaps
# in the container
bun run dev --host
```

> As a side note, I don't think the current mechanism for setting environment variables is working. We still need to manually change the `src/lib/omni.ts` file. Since the `process` object seems to be undefined.

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
