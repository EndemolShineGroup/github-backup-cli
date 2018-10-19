# Setup base dependency (extends)
FROM node:8

# Setup where the code will be called
COPY . /opt/workdir
WORKDIR /opt/workdir

# Install dependencies
RUN yarn

# Build the code
RUN yarn build

# Run command
ENTRYPOINT [ "node", "dist/index.js" ]
CMD []
