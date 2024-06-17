package service

import (
	"context"
	"fmt"
	"log"
	"strings"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"github.com/novalagung/gubrak/v2"
	"github.com/yaza-putu/golang-starter-api/internal/app/chat/entity"
	"github.com/yaza-putu/golang-starter-api/internal/app/chat/repository"
	"github.com/yaza-putu/golang-starter-api/pkg/unique"
)

// event name
const (
	SEND  = "send"
	CLOSE = "close"
)

var (
	connections = make([]*WsConn, 0)
	mutex       sync.Mutex
)

var roomRepository = repository.NewRoomRepository()
var chatRepository = repository.NewChatRepository()

type (
	WsConn struct {
		*websocket.Conn
	}
	SocketPayload struct {
		Event string `json:"event"`
		Data  any    `json:"data"`
	}
	SocketResponse struct {
		Event string `json:"event"`
		Data  any    `json:"data"`
	}
)

func NewChatService(ctx echo.Context, ws *websocket.Conn, roomId string, from string) {
	mutex.Lock()
	currentConn := WsConn{Conn: ws}
	connections = append(connections, &currentConn)
	mutex.Unlock()

	go handleIO(ctx, &currentConn, connections, roomId, from)
}

func handleIO(ctx echo.Context, currentConn *WsConn, connections []*WsConn, roomId string, from string) {
	defer func() {
		if r := recover(); r != nil {
			log.Println("ERROR", fmt.Sprintf("%v", r))
		}
	}()

	payloadForMe := SocketPayload{}
	errForME := currentConn.ReadJSON(&payloadForMe)
	if errForME != nil {
		log.Println(errForME)
	}

	broadcastMessage("client_connect", len(connections))
	actionFetchMessage(roomId)
	manageEvent(currentConn, ctx, payloadForMe, roomId, from)

	for {
		payload := SocketPayload{}
		err := currentConn.ReadJSON(&payload)
		if err != nil {
			if strings.Contains(err.Error(), "websocket: close") {
				broadcastMessage(CLOSE, "")
				closeConnection(currentConn)
				return
			}

			log.Println("ERROR", err.Error())
			continue
		}

		manageEvent(currentConn, ctx, payload, roomId, from)
	}
}

func manageEvent(currentConn *WsConn, ctx echo.Context, wssReq SocketPayload, roomId string, from string) {
	if wssReq.Event == "send" {
		eventSend(roomId, from, wssReq.Data.(string))
	}
}

func broadcastMessage(kind string, data any) {
	for _, eachConn := range connections {
		mutex.Lock()
		eachConn.WriteJSON(SocketResponse{
			Event: kind,
			Data:  data,
		})
		mutex.Unlock()
	}
}

func eventSend(room string, from string, message string) {
	// validate room user
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	c, err := roomRepository.Validate(ctx, from)
	if err != nil {
		cancel()
	}

	if c < 1 {
		broadcastMessage("forbidden", "You can't access this room")
	} else {
		chatRepository.Create(ctx, entity.Chat{
			ID:       unique.Uid(13),
			RoomId:   room,
			SenderId: from,
			Message:  message,
		})

		actionFetchMessage(room)
	}
}

func actionFetchMessage(room string) {
	data, err := chatRepository.All(context.Background(), room)
	if err != nil {
		fmt.Println(err)
	}
	broadcastMessage("messages", data)
}

func closeConnection(currentConn *WsConn) {
	filtered := gubrak.From(connections).Reject(func(each *WsConn) bool {
		return each == currentConn
	}).Result()
	connections = filtered.([]*WsConn)
}
