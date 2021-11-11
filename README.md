# Citizenly Project Server
This is the server-side code of the Citizenly (Admin+User) Project. 

# Authentication
<a href="http://www.passportjs.org/">PassportJS</a> is used to implement JWT(<a href="https://jwt.io/">JSON Web Token</a>) based authentication. There is only one user role currently 
that is admin so user credentials are matched with some secret constants that are only known to the administrator. 

# Database 
Relational Database <a href="https://www.mysql.com/">MySQL</a> is used with NodeJS connector <a href="https://www.npmjs.com/package/mysql2">MySQL2</a>.
a href="https://sequelize.org/">Sequelize</a> is used for <a href="https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping">Object-Relational Mapping(ORM)</a>. 

# Folder Structure
Models and Controllers based struture is followed to utilize Separation of Concerns 
and implement each feature independent of the other.

# Models 
Models entities can be found 
in the <a href="https://github.com/Hamid-Akhtar/citizenly-server/tree/master/models">./models</a> folder. 

# Controllers
Controllers are defined in the <a href="https://github.com/Hamid-Akhtar/citizenly-server/tree/master/controllers">./controllers</a> folder. 

# Google Civic API
<a href="https://developers.google.com/civic-information">Civic API</a> is used to get the data of representatives. 
Each response from <strong>Civic API</strong> is returned based on the `search_term` parameter 
provided from the <strong>client side</strong>. After getting the data from Civic API, 
it checks for Custom Added Representatives in the Local(to the server) Database
related to the `search_term` provided in the request.

# Adding Custom Representatives
Users have the option to create custom representative by sending a POST request to
the `/add-new-rep` route with the required fields in the body.

# Server Configuration
Express powered NodeJS app is served on PORT 8080 by default if `PORT` variable is not defined
in the <strong>.env</strong> file.

# Start the Server
Its simple, just run the `npm start` command to initialize the server. 
