package handler

import (
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"github.com/yaza-putu/golang-starter-api/internal/app/chat/service"
)

type wssHandler struct{}

func NewChatHandler() *wssHandler {
	return &wssHandler{}
}

func (w *wssHandler) Connect(ctx echo.Context) error {
	ws, err := websocket.Upgrade(ctx.Response(), ctx.Request(), ctx.Response().Header(), 1024, 1024)
	if err != nil {
		http.Error(ctx.Response(), "Could not open websocket connection", http.StatusBadRequest)
	}
	if err != nil {
		return err
	}

	service.NewChatService(ctx, ws, ctx.Param("room_id"), ctx.QueryParam("from"))
	return nil
}
