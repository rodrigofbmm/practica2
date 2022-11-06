import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

interface user  {
  Email: string,
  Nombre: string,
  Apellido: string,
  Telefono: string,
  Dni: string,
  Id?: string,
  Iban?: string
}


interface transacion {
  ID_Sender: string,
  ID_Reciber: string,
  amount: string
}

const transacciones : transacion[] = [
  {
    ID_Sender: "1",
    ID_Reciber: "2",
    amount: "234"
  },
  {
    ID_Sender: "2",
    ID_Reciber: "1",
    amount: "23123"
  }
];

let users: user[] = [
  {
    Email: "holaqtal",
    Nombre: "pepito",
    Apellido: "hola",
    Telefono: "638958021",
    Dni: "54215618V",
    Id: "1",
    Iban: "12312312321313U"
  },
  {
    Email: "maria@gmail.com",
    Nombre: "maria",
    Apellido: "hola",
    Telefono: "638958022",
    Dni: "54215619V",
    Id: "2",
    Iban: "123412341234123N"
  },
];

const letter = /[A-Z]/;
const numbers = /[0-9]/;
const emails = "gmail.com"; //mirar para hacer varios

const router = new Router();

router
  .get("/users", (context) => {
    context.response.body = users;
  })

  .get("/transacciones", (context) => {
    context.response.body = transacciones;
  })

  .get("/getUser/:Id", (context) => {

    if (context.params?.Id) {
      const User: user | undefined = users.find(
        (User) => User.Id === context.params.Id || User.Email === context.params.Id|| User.Telefono === context.params.Id|| User.Dni === context.params.Id|| User.Iban  === context.params.Id
      );
     
      if (User) {
        context.response.body = User;
        return;
      }
    }

    context.response.status = 404;
  })

  .post("/addUser", async (context) => {
    const result = context.request.body({ type: "json" });
    const value = await result.value;
    if (!value?.Email || !value?.Telefono || !value?.Dni || !value?.Nombre || !value?.Apellido ) {
      context.response.status = 400;
      return;
    }
    const User: user = {
      Email: value.Email,
      Nombre: value.Nombre,
      Apellido: value.Apellido,
      Telefono: value.Telefono,
      Dni: value.Dni,
      Id: value.Id,
      Iban: value.Iban
    };

    if(User.Dni.length > 9 || User.Dni.length < 9){
      context.response.status = 400;
      context.response.body = "DNI mal introducido";
      return;
    }else if(!User?.Dni.charAt(User.Dni.length-1).match(letter)){
      context.response.status = 400;
      context.response.body = "DNI mal introducido";
      return;
    }else{
      for(let i = 0; i <= 7; i++ ){
        if(!User?.Dni.charAt(i).match(numbers)){
          context.response.status = 400;
          context.response.body = "DNI mal introducido";
          return;
        }
      }
    }

    if(User.Iban){
      if(User?.Iban && User.Iban.length > 24 || User?.Iban && User.Iban.length < 24){ 
        context.response.status = 400;
        context.response.body = "Iban mal introducido";
        return;
      }else if(User?.Iban && User.Iban.charAt(0) != 'E'){ 
        context.response.status = 400;
        context.response.body = "Iban mal introducido";
        return;
      }else if(User?.Iban && User.Iban.charAt(1) != 'S'){
        context.response.status = 400;
        context.response.body = "Iban mal introducido";
        return;
      }else if(User?.Iban && User.Iban.charAt(2) != '2'){
        context.response.status = 400;
        context.response.body = "Iban mal introducido";
        return;
      }else if(User?.Iban && User.Iban.charAt(3) != '1'){
        context.response.status = 400;
        context.response.body = "Iban mal introducido";
        return;
      }else{
        for(let i = 4; i <= 23; i++ ){
          if(User?.Iban && User.Iban.charAt(i).match(numbers)){
            context.response.status = 200;
          }else{
            context.response.status = 400;
            context.response.body = "Iban mal introducido";
            return;
          }
        }
      }
    }

    if(User.Email.indexOf(emails) >-1){ 
      context.response.status = 200;
    }else{
      context.response.status = 400;
      context.response.body = "Email mal introducido";
      return;
    }

    users.push(User);
    context.response.status = 200;
    context.response.body = User;
  })
  
  .post("/addTransaccion", async (context) => { 
    const result = context.request.body({ type: "json" });
    const value = await result.value;
    if (!value?.ID_Sender || !value?.ID_Reciber || !value?.amount ) {
      context.response.status = 400;
      return;
    }
    const Transaccion: transacion = {
      ID_Sender: value.ID_Sender,
      ID_Reciber: value.ID_Reciber,
      amount: value.amount 
    };
    
    if(isNaN(value.amount) != false){
      context.response.status = 400;
      context.response.body = "amount mal introducido";
      return;
    }else if(value.amount.charAt(0) == '-'){
      context.response.status = 400;
      context.response.body = "amount mal introducido";
      return;
    }

    transacciones.push(Transaccion);
    context.response.status = 200;
    context.response.body = Transaccion;
  })

  .delete("/deleteUser/:Email", (context) => {
    if (
      context.params?.Email &&
      users.find((User) => User.Email === context.params.Email)
    ) {
      users = users.filter((User) => User.Email !== context.params.Email);
      context.response.status = 200;
      return;
    }
    context.response.status = 404;
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });