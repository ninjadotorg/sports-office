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
