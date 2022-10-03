const express = require ('express');
const app =express();
const { writeUserDataToKafka, readMessages } = require('./user.kafka')
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "Customer API",
        description: "Customer API Information",
        contact: {
          name: "Amazing Developer"
        },
        servers: ["http://localhost:8080"]
      }
    },
    // ['.routes/*.js']
    apis: ["index.js"]
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// app.use(express.json());

const students  =[
{id:1, name :'jorge', age:'18', enroll : false},
{id:2, name :'pedro', age:'38', enroll : false},
{id:3, name :'marta', age:'25', enroll : false},
]

readMessages()

/**
 * @openapi
 * /kafka:
 *  get:
 *    description: Use to request  kafka
 *    responses:
 *      '200':
 *        description: A successful response
 */
 app.get("/kafka", async (req, res) => {
  await writeUserDataToKafka({ email: 'example', isNew: false, message: null })
    res.status(200).send("Customer results");
  });

// app.get('/welcome' , (req, res) =>{
//     console.log('accediendo a capa de expoicion');
//     res.send('Node js api');

// });




app.get('/api/students' , (req, res) =>{

  
    console.log('accediendo a capa de expoicion');
    console.log('accediendo a capa de integracion');
    res.send(students);


});



app.get('/api/students/:id' , (req, res) =>{


    console.log('accediendo a capa de expoicion');
    
    const student = students.fill( c => c.id === parseInt(req.params.id));
    console.log('accediendo a capa de integracion');
    if (!student) return res.status(404).send('Estudiante no encontrado');
    else res.send(student);

});



app.post('/api/students' , (req, res) =>{


    console.log('accediendo a capa de expoicion');

    const student ={
        id : students.length +1 ,
        name: req.body.name,
        age : parseInt (req.body.age),
        enroll : req.body.enroll === 'true'
    }
    console.log('accediendo a capa de integracion');

    students.push(student);
    res.send(student);

});


app.delete('/api/students/:id' , (req, res) =>{

    console.log('accediendo a capa de expoicion');

    const student = students.fill( c => c.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('Estudiante no encontrado');
    
    console.log('accediendo a capa de integracion');

    const index= students.indexOf(student);
    student.splice(index, 1);
    res.send(student);

});

const  port = process.env.port || 8080 ;


app.listen( port , () => console.log(`Escuchando en puerto ${port}`));