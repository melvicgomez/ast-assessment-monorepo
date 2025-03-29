# Chatbot
This is a small chatbot with text generated response. It has an authentication so you cannot spam my limit neurons(Cloudflare terminology).

### Tech Stack
- Backend: ExpressJS
- Frontend: NextJS
- AI: Cloudflare AI Worker (model: `@cf/meta/llama-3-8b-instruct`)


### Prerequisites
- Postman collection is located in root folder: `AST.postman_collection.json`
- Install all dependencies for backend `./ast-backend/` run the command `npm i`
- Install all dependencies for frontend `./ast-frontend/` run the command `npm i`

### How to run it locally?

#### Running the backend locally
- Copy `.env.template` and rename to `.env`, refer to my email about the correct values for these environment variables:
  ```
  CLOUDFLARE_WORKER_ACCOUNT_ID=''
  CLOUDFLARE_WORKER_API_TOKEN=''
  CLOUDFLARE_WORKER_MODEL=''
  ```
- In `.env`, update `JWT_SECRET=` with any value but make sure no spaces
- Run the command `npm run dev` in the `./ast-backend` directory
- Wait for few seconds, you should be able to access it `http://localhost:8000/`


#### Running the frontend locally
- Copy `.env.template` and rename to `.env`;
- Run the command `npm run dev` in the `./ast-frontend` directory
- Wait for few seconds, you should be able to access it `http://localhost:3000/`

### Docker deployment
I used docker desktop in windows for this setup but hopefully it works in your machine too!
- Run the command `docker-compose up --build -d`
- After the build and deployment, run the command `docker ps` to validate that the containers are running 
- Fallback, just use the `Running the frontend locally` and `Running the backend locally` guide.

### Key features in backend (description)
- Request rate limit - 5 requests per minute, mainly for the endpoint `/send-message` because  I'm using free tier in Cloudflare Workers(**10,000 Neurons per day**)
- I used dummyjson site for users (in my setup, users can be change depends on your preferences) but I fixed the values from this url
  ```
  https://dummyjson.com/users?limit=5&skip=10&select=firstName,lastName,email,password
  ```
- JWT token are generated based on dummy user from (dummyjson.com)
- JWT token expires after **1hour** of issuance, you can tweak the `expiresIn` value for testing
  ```
    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
  ```
 - This endpoint `/send-message` is protected by JWT token, you must login first before accessing it.

### Key features in frontend (description)
  - User data and token are stored in localstorage so when user refresh the page, user still logged in
  - When token is expired, user is automatically redirected to login page
  - When user login and chat with my chatbot, conversation is stored in localstorage too
  - When user logout with conversation history, login again(same user) this app retrieves the conversation
  - When user logout with conversation history, different user login the chat history is cleared (other users cannot see their messages)
  - Added clear messages button
  - Added logout button
  
### Summary
Frontend, I used NextJS because of the community. I considered Vite but if we plan to scale it in large-scale then NextJS is best option. NextJS also have alot of useful plugins.
Backend, I used ExpressJS since it is a small project and smaller built files(I alsmost use NestJS because it is opinionated).
Biggest challenge is that I had issues with CORS, and state rehydration.
Monorepo type of setup because of Docker, it is easier to build and deploy.