  //Sección MySQL del código
  const mySql = require("mysql2/promise");

  /**
   * Objeto con la configuración de la base de datos MySQL a utilizar.
   */
  const SQL_CONFIGURATION_DATA =
  {
  	host: process.env.MYSQL_HOST,
  	user: process.env.MYSQL_USERNAME,
  	password: process.env.MYSQL_PASSWORD, 
  	database: process.env.MYSQL_DB,	
  	port: 3306,
  	charset: 'UTF8_GENERAL_CI'
  }


  console.log("CONFIG MYSQL:", {
      host: SQL_CONFIGURATION_DATA.host,
      user: SQL_CONFIGURATION_DATA.user,
      database: SQL_CONFIGURATION_DATA.database,
      port: SQL_CONFIGURATION_DATA.port
  });



  /**
   * Realiza una query a la base de datos MySQL indicada en el archivo "mysql.js".
   * @param {String} queryString Query que se desea realizar. Textual como se utilizaría en el MySQL Workbench.
   * @returns Respuesta de la base de datos. Suele ser un vector de objetos.
   */
  exports.realizarQuery = async function (queryString, params = [])
  {
  	let connection;
  	try
  	{
  		connection = await mySql.createConnection(SQL_CONFIGURATION_DATA);
  		const [resultado] = await connection.execute(queryString, params);
  		return resultado;
  	}
  	finally
  	{
  		if (connection && connection.end) await connection.end();
  	}
 }




// //Funciona en casa
//   const mySql = require("mysql2/promise");

//   const SQL_CONFIGURATION_DATA = {
//       host: process.env.MYSQL_HOST,
//       user: process.env.MYSQL_USERNAME,
//       password: process.env.MYSQL_PASSWORD,
//       database: process.env.MYSQL_DB,
//       port: 3306,
//       charset: "UTF8_GENERAL_CI",
//       waitForConnections: true,
//       connectionLimit: 5,
//       queueLimit: 0
//   };
//   const pool = mySql.createPool(SQL_CONFIGURATION_DATA);

//   exports.realizarQuery = async function (queryString, params = []) {
//       const [resultado] = await pool.execute(queryString, params);
//       return resultado;
//   };


// adaptado

// // Sección MySQL del código
// const mySql = require("mysql2/promise");

// /**
//  * Objeto con la configuración de la base de datos MySQL a utilizar.
//  */
// const SQL_CONFIGURATION_DATA =
// {
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USERNAME,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DB,
//     port: 3306,
//     charset: 'UTF8_GENERAL_CI',
//     waitForConnections: true,
//     connectionLimit: 5,
//     queueLimit: 0
// };

// /**
//  * Pool de conexiones a la base de datos MySQL.
//  */
// const pool = mySql.createPool(SQL_CONFIGURATION_DATA);

// /**
//  * Realiza una query a la base de datos MySQL indicada en el archivo "mysql.js".
//  * @param {String} queryString Query que se desea realizar. Textual como se utilizaría en el MySQL Workbench.
//  * @returns Respuesta de la base de datos. Suele ser un vector de objetos.
//  */
// exports.realizarQuery = async function (queryString, params = [])
// {
//     const [resultado] = await pool.execute(queryString, params);
//     return resultado;
// };
