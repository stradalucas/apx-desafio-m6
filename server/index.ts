import * as express from "express";
import { firestore, rtdb } from "./database";
import * as cors from "cors";
import * as path from "path";
import { nanoid } from "nanoid";


// Init express app
const app = express();
const port = process.env.PORT || 3000;

// Collection references
const userCollection = firestore.collection("users");
const roomsCollections = firestore.collection("rooms");

// Use
app.use(express.json());
app.use(cors());

// Método que verifica el ambiente de desarollo
app.get("/env", (req, res) => {
   res.json({
      enviorment: process.env.NODE_ENV,
   });
});

// Método que crea nuevos jugadores. 
// Si ya existe retorna un status 404*/
app.post("/signup", (req, res) => {
   const { namePlayer } = req.body;
   // En la Firestore Database:
   userCollection
      .where("namePlayer", "==", namePlayer)
      .get()
      .then((snapshot) => {
         if (snapshot.empty) {
            userCollection
               .add({
                  namePlayer,
               })
               .then((newPlayerRef) => {
                  res.status(200).json({
                     id: newPlayerRef.id,
                     new: true,
                  });
               });
         } else {
            res.status(400).json({
               message: `El nombre ${namePlayer} ya existe.`
            });
         }
      });
});


//Método para crear una nueva sala de juego.
//Generar un ID complejo y un -short ID- para compartir a otro jugador.
app.post("/newroom", (req, res) => {
   const { namePlayer } = req.body;
   const roomRef = rtdb.ref(`/gameRooms/rooms/${nanoid()}`);
   // En RealTime Database:
   roomRef
      .set({
         player1: {
            namePlayer,
            score: 0,
            ready: false,
            moveElection: "none",
            chose: false,
         },
         player2: {
            namePlayer: false,
            score: 0,
            ready: false,
            moveElection: "none",
            chose: false,
         },
      })
      .then(() => {
         // Crea un -short ID- 
         const randomNum = 7000 + Math.floor(Math.random() * 999);
         const roomId = randomNum.toString();
         // En Firestore Database:
         roomsCollections
            .doc(roomId)
            .set({
               rtdbRoomId: roomRef.key,
            })
            .then(() => {
            res.status(200).json({
               roomId,
               rtdbRoomId: roomRef.key,
            });
         });
      });
});

//Método para autenticar si existe el -short ID- de una sala.
app.get("/authId/:roomId", (req, res) => {
   const { roomId } = req.params;
   // En la Firestore Databe:
   roomsCollections
      .doc(roomId.toString())
      .get()
      .then((snapshot) => {
         return res.status(200).json({
            rtdbRoomId: snapshot.get("rtdbRoomId"),
            exists: snapshot.exists
         });
      });
});

// Método que obtiene los datos de una sala.
app.get("/authRoomStatus/:rtdbRoomId", (req, res) => {
   const { rtdbRoomId } = req.params;
   const reference = rtdb.ref(`gameRooms/rooms/${rtdbRoomId}`);
// En la Realtime Database:
   reference.once("value", (snapshot) => {
      res.status(200).json(snapshot.val());
   });
});

// Método para obtener el ID de una sala a partir del -short ID-.
app.get("/change/:roomId", (req, res) => {
   const { roomId } = req.params;
   // En la Firestore Databe:
   roomsCollections
      .doc(roomId.toString())
      .get()
      .then((snapshot) => {
         return res.status(200).json({
            rtdbRoomId: snapshot.get("rtdbRoomId"),
         });
      });
});

// Método para elegir el nombre del segundo jugador
app.post("/namePlayer2/:rtdbRoomId", (req, res) => {
   const { rtdbRoomId } = req.params;
   const { namePlayer } = req.body;
   const roomRef = rtdb.ref(`/gameRooms/rooms/${rtdbRoomId}/player2`);
   // En la Realtime Database:
   roomRef.update(
      {namePlayer},
      () => {
         res.status(200).json(`El jugador 2 es: ${namePlayer}`);
      }
   );
});

// Método que actualiza el estado -ready- del jugador
app.post("/setReady", (req, res) => {
   const { player, rtdbRoomId, ready } = req.body;
   const roomRef = rtdb.ref(`/gameRooms/rooms/${rtdbRoomId}/${player}`);
   roomRef
      .update({
         ready,
      })
      .then(() => {
         res.status(200).json(`ready: ${player} ${ready}`);
      });
});

// Método para actualizar el "moveElection" del jugador.
app.post("/setPlay/:player", (req, res) => {
   const { player } = req.params;
   const { move, rtdbRoomId } = req.body;
   const roomRef = rtdb.ref(`/gameRooms/rooms/${rtdbRoomId}/${player}`);
   roomRef
      .update({
         moveElection: move,
         chose: true,
      })
      .then(() => {
         res.status(200).json(`La eleción fue ${move}`);
      });
});

// Método para actualizar el "score" del jugador.
app.post("/setScore/:player", (req, res) => {
   const { player } = req.params;
   const { score, rtdbRoomId } = req.body;
   const roomRef = rtdb.ref(`/gameRooms/rooms/${rtdbRoomId}/${player}`);
   roomRef
      .update({
         score,
      })
      .then(() => {
         res.status(200).json({
            message: `Score del ${player} actualizado`,
         });
      });
});

// Método que determina el ganador de la partida.
app.post("/setWinner/:winner", (req, res) => {
   const { winner } = req.params;
   const { rtdbRoomId } = req.body;
   const roomRef = rtdb.ref(`/gameRooms/rooms/${rtdbRoomId}`);
   // En la Realtime Database:
   roomRef
      .update({
         winner,
      })
      .then(() => {
         res.status(200).json({
            message: "Ganador establecido",
            winner
         });
      });
});

// Método para resetear el Score.
app.post("/resetScore", (req, res) => {
   const { rtdbRoomId } = req.body;

   const refPlayer = {
      RefPlayerOne: rtdb.ref(`/gameRooms/rooms/${rtdbRoomId}/player1`),
      RefPlayerTwo: rtdb.ref(`/gameRooms/rooms/${rtdbRoomId}/player2`)
   }

   for (let key in refPlayer){
      refPlayer[key]
      .update({
         score: 0
      })
      .then(() => {
         res.status(200).json({
            message: `El Score de los jugadores de la sala ${rtdbRoomId} han sido reseteado"`,
         });
      });
   }
});

// Método que resetea los parámetros de los jugadores "moveElection", "chose" and "ready".
app.post("/reset", (req, res) => {
   const { rtdbRoomId } = req.body;

   const refPlayer = {
      RefPlayerOne: rtdb.ref(`/gameRooms/rooms/${rtdbRoomId}/player1`),
      RefPlayerTwo: rtdb.ref(`/gameRooms/rooms/${rtdbRoomId}/player2`)
   }

   for (let key in refPlayer){
      refPlayer[key]
      .update({
         moveElection: "none",
         chose: false,
         ready: false,
      })
      .then(() => {
         res.status(200).json({
            message: `moveElection, ready y chose se resetearon.`,
         });
      });
   };
});

// Método que elimina una sala de la Firestore Database a partir del -short ID-
app.delete("/delete-room-firestore", (req, res) => {
   const { roomId } = req.body;
// En Firestore Database:
roomsCollections
            .doc(roomId)
            .delete()
            .then(() => {
            res.status(200).json({
               message: `La sala ${roomId} ha sido borrada con exito.`
            });
         });
});


// Método que elimina una sala de la Realtime Database a partir del -ID-
app.delete("/delete-room-realtime", (req, res) => {
   const { rtdbRoomId } = req.body;
// En Realtime Database:
const roomRef = rtdb.ref(`/gameRooms/rooms/${rtdbRoomId}`);
roomRef
      .remove()
            .then(() => {
            res.status(200).json({
               message: `La sala ${rtdbRoomId} ha sido borrada con exito.`
            });
         });
});

// Serve client
// .static: Sirve los archivos que están dentro de una carpeta.
app.use(express.static("dist"));

app.get("*", (req, res) => {
   res.sendFile(path.resolve(__dirname, "../dist/",  "index.html"));
})


// Express app listen
app.listen(port, () => {
   console.log(`App running in the port:${port}`);
});
