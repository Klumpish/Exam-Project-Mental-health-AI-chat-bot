#use Node.js image
FROM node:18-alpine

#Set working directory
WORKDIR /app

#copy package files
COPY package*.json ./

#install dependencies
RUN npm install

# Copy source code
COPY . .

# build next.js app
RUN npm run build -- --no-lint

#expose port 3000
EXPOSE 3000

#Start the application
CMD ["npm","start"]
