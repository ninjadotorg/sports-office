package models

type ApiAddressRespone struct { 
	PlayerId int  `json:"playerId"`
	ErrorCode int    `json:"errorCode"`
	Address string    `json:"address"`
}

type ApiWithdrawRespone struct {
	PlayerId int  `json:"playerId"`
	ErrorCode int    `json:"errorCode"`
}
 
type ApiHistoryWithdrawalsRespone struct {
	ErrorCode   int `json:"errorCode"`
	PlayerID    int `json:"playerId"`
	Total       int `json:"total"`
	Withdrawals []struct {
		Address string `json:"address"`
		Amount  string `json:"amount"`
		Fee     string `json:"fee"`
		SentAt  string `json:"sentAt"`
	} `json:"withdrawals"`
 
}


type ApiDepositsRespone struct {
	PlayerID  int `json:"playerId"`
	ErrorCode int `json:"errorCode"`
	Total     int `json:"total"`
	Deposits  []struct {
		DepositAt   string `json:"depositAt"`
		Amount      string `json:"amount"`
		Status      bool   `json:"status"`
		TxHash      string `json:"txHash"`
		Address     string `json:"address"`
		BlockNumber int    `json:"blockNumber"`
	} `json:"deposits"`
}


//===========
type FbRacingRoom struct { 
	Session string  `json:"session"`
	Name  string  `json:"name"`
	Photo  string  `json:"photo"`
	MapId 	int 	`json:"mapId"`
	Loop 	int 	`json:"loop"`
	Miles	float64 `json:"miles"`
	Status  string	`json:"status"`
	Players []FbRoomPlayer  `json:"players"`
}

type FbRoomPlayer struct { 
	PlayerName  string  `json:"playerName"`
	Token string  `json:"token"`
	Speed float64 	`json:"speed"`
	Goal  float64	`json:"goal"`
	Status int 	`json:"status"` // 0 : leave, 1 : joined. 
	Archivement int 	`json:"archivement"` // Ket qua, dung thu may : 1, 2, 3, 4, 5, 6, 7, 8, 9 , 10 ...
}
