# Citizenly Project Server
This is the server-side code of the Citizenly (Admin+User) Project. 

# Authentication
Passport is used to implement JWT(JSON Web Token) based authentication. There is only one user role currently 
that is admin so user credentials are matched with some secret constants that are only known to the administrator. 

# Database 
Relational Database MySQL is used with NodeJS connector MySQL2.
Sequelize is used for Object-relational mapping(ORM). 

# Folder Structure
Models and Controllers based struture is followed to utilize Separation of Concerns 
and implement each feature independent of the other.

# Models 
Models entities can be found 
in the ./models folder. 

# Controllers
Controllers are defined in the ./controllers folder. 

# Civic API
Civic API is used to get the data of representatives. 
Each response from Civic API is returned based on the `search_term` parameter 
provided from the client side. After getting the data from Civic API, 
it checks for Custom Added Representatives in the Local(to the server) Database
related to the `search_term` provided in the request.

# Adding Custom Representatives
Users have the option to create custom representative by sending a POST request to
the `/add-new-rep` route with the required fields in the body.

# Server Configuration
Express powered NodeJS app is served on PORT 8080 by default if `PORT` variable is not defined
in the .env file.

# Start the Server
Its simple, just run the `npm start` command to initialize the server. 