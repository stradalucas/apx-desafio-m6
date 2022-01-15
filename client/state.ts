import { rtdb } from "./rtdb";
import { Router } from "@vaadin/router";


const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

type movement = "stone" | "paper" | "scissor";

export const state = {
   data: {},
   listeners: [],

   getState() {
      return this.data;
   },

   setState(newState): void {
      this.data = newState;
      for (const cb of this.listeners) {
         cb();
      }
      console.log(`New State:`, this.data);
      console.log(`listeners:`, this.listeners);
   },
   
   resetListener(): void {
      this.listeners = [];
      console.log(`listeners:`, this.listeners);
   },
   
   subscribe(callback: (any) => any): void {
      this.listeners.push(callback);
   },

   initLocalStorage(): void {
      const localData = JSON.parse(localStorage.getItem("data"));
      console.log(localData, "mostrar local data");
      if (localData != null) {
         this.setState({
            ...localData,
         });
         const { rtdbRoomId } = state.getState();
         this.suscribeRtdbRoom(rtdbRoomId);
      }
   },
   // once realiza un snap una sola vez
   // on realiza un snap cada vez que cambia la Realtime Database
   suscribeRtdbRoom(rtdbRoomId: string): void {
      const rtdbRoomRef = rtdb.ref(`/gameRooms/rooms/${rtdbRoomId}`);
      rtdbRoomRef.on("value", (snap) => {
         const currentState = state.getState();
         const rtdbPlayer1 = snap.val().player1;
         const rtdbPlayer2 = snap.val().player2;
         const namePlayer1 = rtdbPlayer1.namePlayer;
         const namePlayer2 = rtdbPlayer2.namePlayer;
         const readyPlayer1 = rtdbPlayer1.ready;
         const readyPlayer2 = rtdbPlayer2.ready;
         const chosePlayer1 = rtdbPlayer1.chose;
         const chosePlayer2 = rtdbPlayer2.chose;
         const movePlayer1 = rtdbPlayer1.moveElection;
         const movePlayer2 = rtdbPlayer2.moveElection;
         const scorePlayer1 = rtdbPlayer1.score;
         const scorePlayer2 = rtdbPlayer2.score;
         const { winner } = snap.val();

         state.setState({
            ...currentState,
            namePlayer1,
            namePlayer2,
            readyPlayer1,
            readyPlayer2,
            chosePlayer1,
            chosePlayer2,
            movePlayer1,
            movePlayer2,
            scorePlayer1,
            scorePlayer2,
            winner,
         });

         const storedData = state.getState();
         localStorage.setItem(
            "data",
            JSON.stringify({
               ...storedData,
            })
         );
      });
   },

   newPlayer(namePlayer: string): Promise<any> {
      return fetch(`${API_BASE_URL}/signup`, {
         method: "post",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            namePlayer,
         }),
      })
   },

   newRoom(namePlayer: string): Promise<any> {
      return fetch(`${API_BASE_URL}/newroom`, {
         method: "post",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            namePlayer,
         }),
      });
   },

   authRoomStatus(rtdbRoomId: string): Promise<any> {
      return fetch(`${API_BASE_URL}/authRoomStatus/${rtdbRoomId}`, {
         method: "get",
      }).then((res) => res.json());
   },

   authRoomId(roomId: string): Promise<any> {
      return fetch(`${API_BASE_URL}/authId/${roomId}`, {
         method: "get",
      }).then((res) => res.json());
   },

   namePlayer2(namePlayer: string, rtdbRoomId: string): Promise<any> {
      return fetch(`${API_BASE_URL}/namePlayer2/${rtdbRoomId}`, {
         method: "post",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            namePlayer,
         }),
      });
   },

   setReadyPlayers(namePlayer: string, rtdbRoomId: string, ready: boolean): Promise<any> {
      const { namePlayer1, namePlayer2 } = state.getState();
      let player: string;
      // 
      if (namePlayer == namePlayer1) {
         player = "player1";
      }
      if (namePlayer == namePlayer2) {
         player = "player2";
      }
      return fetch(`${API_BASE_URL}/setReady`, {
         method: "post",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            player,
            rtdbRoomId,
            ready,
         }),
      });
   },

   setMovePlayer(move: movement, player: string, rtdbRoomId: string): Promise<any> {
      const { namePlayer, namePlayer1, namePlayer2 } = state.getState();

      if (namePlayer == namePlayer1) {
         player = "player1";
      }
      if (namePlayer == namePlayer2) {
         player = "player2";
      }

      return fetch(`${API_BASE_URL}/setPlay/${player}`, {
         method: "post",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            move,
            rtdbRoomId,
         }),
      });
   },

   whoWins() {
      const { chosePlayer1, chosePlayer2, movePlayer1, movePlayer2, rtdbRoomId } = state.getState();
      let { scorePlayer1, scorePlayer2 } = state.getState();

      if (chosePlayer1 == true && chosePlayer2 == true) {
         if (movePlayer1 == movePlayer2) {
            // Tied game
            this.setWinerRtdb("tied game", rtdbRoomId);
         }
         if (
            // Player 1 wins
            (movePlayer1 == "scissor" && movePlayer2 == "paper") ||
            (movePlayer1 == "stone" && movePlayer2 == "scissor") ||
            (movePlayer1 == "paper" && movePlayer2 == "stone")
         ) {
            scorePlayer1++;

            this.setScoreRtdb("player1", scorePlayer1, rtdbRoomId);
            this.setWinerRtdb("player1", rtdbRoomId);
         }
         if (
            // Player 2 wins
            (movePlayer2 == "scissor" && movePlayer1 == "paper") ||
            (movePlayer2 == "stone" && movePlayer1 == "scissor") ||
            (movePlayer2 == "paper" && movePlayer1 == "stone")
         ) {
            scorePlayer2 ++;

            this.setScoreRtdb("player2", scorePlayer2, rtdbRoomId);
            this.setWinerRtdb("player2", rtdbRoomId);
         }
      }
   },

   setScoreRtdb(player: string, score: number, rtdbRoomId: string): void {
      fetch(`${API_BASE_URL}/setScore/${player}`, {
         method: "post",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            rtdbRoomId,
            score,
         }),
      });
   },

   setWinerRtdb(winner: string, rtdbRoomId: string): void {
      fetch(`${API_BASE_URL}/setWinner/${winner}`, {
         method: "post",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            rtdbRoomId,
         }),
      });
   },

   reset(rtdbRoomId: string): Promise<any> {

      return fetch(`${API_BASE_URL}/reset`, {
         method: "post",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            rtdbRoomId,
         }),
      });
   },

   resetScore(rtdbRoomId: string): Promise<any> {

      return fetch(`${API_BASE_URL}/resetScore`, {
         method: "post",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            rtdbRoomId,
         }),
      });
   },
};
