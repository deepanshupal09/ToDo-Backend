FROM node:20-bullseye

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Compile TypeScript
RUN npm run build

# Generate the Prisma client
RUN npx prisma generate

# Copy the entrypoint script and ensure it’s executable
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose the backend port
EXPOSE 8000

# Set the entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
