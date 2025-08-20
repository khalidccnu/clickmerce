# Build stage
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy all to the working directory
COPY . .

# Install dependencies
RUN yarn install

# Build the project
RUN yarn build

# ====================================================== #

# Release stage
FROM node:20-alpine AS release

# Set the working directory
WORKDIR /app

# Copy only the build artifacts from the build stage
COPY --from=build /app/.next /app/.next
COPY --from=build /app/public /app/public
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/yarn.lock /app/yarn.lock

# Install only production dependencies
RUN yarn install --omit=dev

# Expose the port that the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["yarn", "start"]
