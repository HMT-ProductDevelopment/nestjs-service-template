FROM     node:16 as base
COPY     . /app/

FROM     base as test

FROM     base as builder
WORKDIR  /app
RUN      yarn install && yarn build && mkdir /pkg && mv dist public package.json package-lock.json /pkg/



FROM     node:16
RUN      useradd -m -U -d /app -s /bin/bash app
WORKDIR  /app
COPY     --chown=app:app --from=builder /pkg /app/ 
RUN      yarn install
USER     app
CMD      ["node", "dist/src/main", "2>&1"]