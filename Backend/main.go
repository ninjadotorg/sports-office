package main
import (
	//"log"
	"time"
	//"strconv"
	"math/rand"
	"encoding/json"
	"fmt"
	"net/http"
	"github.com/labstack/echo" 
	//"github.com/dgrijalva/jwt-go"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/websocket"
	"github.com/satori/go.uuid"
	"github.com/labstack/echo/middleware"
	"./controllers"
	"./config"
	"./models"
	"github.com/jinzhu/gorm" 
	
)

// jwtCustomClaims are custom claims extending default ones.
 
var (
    // Websocket http upgrader
    upgrader = websocket.Upgrader{
        ReadBufferSize:  1024,
        WriteBufferSize: 1024,
        CheckOrigin: func(r *http.Request) bool {
            return true
        },
    }
)
 
 
type ConfigGlobalPaypout struct {
	Min    float64 `json:"min"`
	Max    float64 `json:"max"`
	Payout float64 `json:"payout"`
}

type ClientManager struct {
    clients    map[*Client]bool
    broadcast  chan []byte
    register   chan *Client
	unregister chan *Client 
}

type Client struct {
    id     string
    socket *websocket.Conn
	send   chan []byte
	user   models.User
}


type Message struct {
    Sender    string `json:"sender,omitempty"`
    Recipient string `json:"recipient,omitempty"`
	Content   string `json:"content,omitempty"`
	Amount    float64 `json:"amount,omitempty"`
	WinAmount string `json:"winAmount,omitempty"`
	Symbol    string  `json:"symbol,omitempty"`
	Chance 	  float64 `json:"chance,omitempty"`
	Bet		  float64 `json:"bet,omitempty"` 
	Win		  int 	  `json:"win,omitempty"` 
}

type DiceMessage struct{
	Amount    float64 `json:"amount,omitempty"`
	Symbol    string `json:"symbol,omitempty"`
	Chance 	  float64 `json:"chance,omitempty"`
	PayoutLocal float64 
}
//===========symbol:BTC
var manager = ClientManager{
    broadcast:  make(chan []byte),
    register:   make(chan *Client),
    unregister: make(chan *Client),
	clients:    make(map[*Client]bool), 
	 
}

//++++++++++++++++++++++++++++

var db = config.GetDatabaseConnection()  
var fbApp = config.InitFB()
// var fbData, _ = fbApp.Database(context.Background())
// var refDB = fbData.NewRef("games") 

//++++++++++++++++++++++++++++GAME ENGINE===========
func random( min, max int) int {
	
	fmt.Printf("message recv: %s", time.Now().UTC().UnixNano())
	rand.Seed(time.Now().UTC().UnixNano())
	return rand.Intn(max - min) + min
	
}

func getGameThrestholdOfUser(dm DiceMessage ) float64 {
 
	return 0.0

}

func gameWinOrLost( dm DiceMessage , gameDiceValueNow float64 , gameDiceThreshold float64 ) float64{
	
	//Cua duoi, user chon dice < GAME_THRESHOLD(5000)
	if dm.Chance ==0 { 
		if gameDiceValueNow  < gameDiceThreshold {
			return dm.Amount
		}else{
			return 0.0
		} 
	}
	//Cua trên, user chon dice > GAME_THRESHOLD(5000)
	if dm.Chance ==1 { 
		if gameDiceValueNow  < gameDiceThreshold {
			return 0.0
		}else{
			return dm.Amount
		} 
	}

	return 0.0

}

//++++++++++++++++++++++++++++GAME ENGINE===========


func (manager *ClientManager) start() {
	fmt.Printf("Start manager sockets") 
    for {
        select {
			case conn := <-manager.register:
				manager.clients[conn] = true
				fmt.Printf("webcome conn: %s\n", conn.user)  
				jsonMessage, _ := json.Marshal(&Message{Content: "/A new socket has connected."}) 
				manager.send(jsonMessage, conn)

			case conn := <-manager.unregister:
				if _, ok := manager.clients[conn]; ok {
					close(conn.send)
					delete(manager.clients, conn)
					jsonMessage, _ := json.Marshal(&Message{Content: "/A socket has disconnected."})
					manager.send(jsonMessage, conn)
				}
			case message := <-manager.broadcast:
				for conn := range manager.clients {
					select {
					case conn.send <- message:
					default:
						close(conn.send)
						delete(manager.clients, conn)
					}
				}
			}
    }
}

func (manager *ClientManager) send(message []byte, ignore *Client) {
    for conn := range manager.clients {
        if conn != ignore {
            conn.send <- message
        }
    }
}
func (c *Client) read(ch chan string) {
    defer func() {
        manager.unregister <- c
        c.socket.Close()
    }()

    for {
		_, message, err := c.socket.ReadMessage() 
 
        if err != nil {
            manager.unregister <- c
            c.socket.Close()
            break
		} 

		var dat DiceMessage

		if err2 := json.Unmarshal(message, &dat); err2 != nil {
			//panic(err2)
			break
		}     
		
		//usermodel.Email != config.GUEST_USER
		if c.user.Email == config.GUEST_USER {
			
			id, _ := uuid.NewV4()
			ch <- id.String()
			//return nil 
		} 
		// + - Database ntn .... 
		//fmt.Printf("t %s , bet %s win %s", dicethresthosd, gameDiceValueNow , winAmount)
		jsonMessage, _ := json.Marshal(&Message{ 
			Sender: c.id, 
			Content: "", 
		}) 

		manager.broadcast <- jsonMessage
		   

		id, _ := uuid.NewV4()
		ch <- id.String()
    }
} 
//Chuyen qua Firebase message.

func (c *Client) write(ch chan string) {
    defer func() {
        c.socket.Close()
    }()

    for {
        select {
			case message, ok := <-c.send:
				if !ok {
					c.socket.WriteMessage(websocket.CloseMessage, []byte{})
					return
				}
				fmt.Printf("message to@@ : %s\n", message) 
				
				c.socket.WriteMessage(websocket.TextMessage, message)

				id, _ := uuid.NewV4()
				ch <- id.String()
        }
    }
}


func main() {
	
	e := echo.New()    
	// Generate encoded token and send it as response.
	// token := jwt.New(jwt.SigningMethodHS256)  
	// // Set claims
	// claims2 := token.Claims.(jwt.MapClaims)
	// claims2["id"] = 10010
	// claims2["exp"] = time.Now().Add(time.Hour *  time.Duration(config.TOKEN_EXP_TIME)).Unix()  
	// // t, _ = token.SignedString([]byte(config.SECRET_KEY)) 
	// // fmt.Println(t)
	// //================================

	//============================//
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.PUT, echo.POST, echo.DELETE},
	}))  
  

	migrateDatabase(db)  
	ctl := &controllers.BaseController{Dao:db, FbApp: fbApp } 
	
	// fmt.Printf("%+v ",refDB)
	
	// if err2 := refDB.Child("race-rooms").Set(context.Background(), &Message{
	// 	Sender:"FDSF", 
	// }); err2 != nil {
	// 		log.Fatalln("Error setting value:", err2)
	// }

	e.POST("/api/auth", ctl.Auth) 
	e.POST("/api/signup", ctl.Signup) 
	e.GET("/api/room/list", ctl.ListRoom)
	e.GET("/api/user/list", ctl.ListUser)
	e.GET("/api/user/info", ctl.GetUser) 
	e.GET("/api/map/list", ctl.ListMap)
	
	e.Static("/", "views")   
 
	//======================USER_GAME_API=============================
	userapi := e.Group("/api")
	userapi.Use(middleware.JWT([]byte(config.SECRET_KEY)))
	userapi.GET("/info", ctl.GetInfo)
  
	//userapi.GET("/room/session/create", ctl.CreateSession)
	userapi.POST("/room/session/create", ctl.CreateSession) 
	userapi.POST("/room/session/action", ctl.ActionSession)

	userapi.POST("/room/session/create-token", ctl.CreateToken)
	userapi.POST("/room/session/leave", ctl.LeaveRoom)
	userapi.POST("/room/session/close", ctl.CloseSession)
	
	//add Friends AddFriend  friendId
	userapi.POST("/friend/add", ctl.AddFriend) 
	userapi.POST("/friend/del", ctl.RemoveFriend) 
	userapi.GET("/friend/list", ctl.ListMyFriends) 

	//archivement  
	userapi.POST("/practive/archivement", ctl.PractiveArchivement) 

	//update UpdateUser
	userapi.POST("/user/update", ctl.UpdateUser) 
	
	//stream-data-

	
	//===================================================
	g := e.Group("/game")
	g.Use(middleware.BasicAuth(func(username, password string, c echo.Context) (bool, error) {
		
		user, err := jwt.Parse(username, func(token *jwt.Token) (interface{}, error) {
			return []byte(config.SECRET_KEY), nil
		})
		if err != nil {
			c.Logger().Error(err)
			return false, nil
		} 
		claims := user.Claims.(jwt.MapClaims)  
		usermodel := new(models.User)  
		usermodel.ID =   int(claims["id"].(float64))
		usermodel.FetchById(db)

		if usermodel.Email != config.GUEST_USER {
			for conn := range manager.clients {
				fmt.Printf("%s", conn.id)
				if conn.id == claims["username"].(string) {
					fmt.Printf("this user has a connected, rejected.")
					return false, nil
				}
			}
		}else{
			usermodel.Email = usermodel.Email;
		} 
 
		if claims["id"].(float64) > 0 { 
			c.Set("usermodel", *usermodel) 
			return true, nil
		}

		return false, nil
	}))  
 
	go manager.start() 
	g.GET("/ws", socketHandlerCenter) 

	e.Start(":8081")
}

//https://github.com/smallnest/C1000K-Servers
func socketHandlerCenter(c echo.Context) error {
    
	usermodel := c.Get("usermodel").(models.User) 
	//fmt.Printf("%s\n", usermodel.Balances)
	//Khong co token thi khong conect dc vao day,  
	conn, error := upgrader.Upgrade(c.Response(), c.Request(), nil)   
    if error != nil {
        return error
	}  
	defer conn.Close()  

	client := &Client{id: usermodel.Email , socket: conn, send: make(chan []byte),user: usermodel } 
	
	manager.register <- client
	
	ch := make(chan string)
	 
    go client.read(ch)
	go client.write(ch) 
	for{
		<-ch
		<-ch
	} 

	return nil
	
}



// func restrictedAuth(c echo.Context) error{

// 	//fmt.Printf("%s\n", c)
// 	user := c.Get("user").(*jwt.Token)
// 	fmt.Printf("%s\n", user)
// 	claims := user.Claims.(jwt.MapClaims)
// 	name := claims["username"].(string)
// 	return c.String(http.StatusOK, "Welcome ! " + name) 
 
// }
func migrateDatabase(db *gorm.DB) {
	
	db.AutoMigrate(&models.User{})  
	db.AutoMigrate(&models.Room{})  
	db.AutoMigrate(&models.Map{})  
	db.AutoMigrate(&models.Friend{})  
	db.AutoMigrate(&models.Profile{})  
	db.AutoMigrate(&models.RoomPlayer{})  
	// db.Create(&models.Map{Name:"Weston", Status:1, Photo:"https://storage.googleapis.com/oskar-ai/110/Weston_ntuxxLP0LeY5u023r6dM.png" })
	// db.Create(&models.Map{Name:"Upper Bay",Status:1,  Photo:"https://storage.googleapis.com/oskar-ai/110/Upper_Bay_yF0wp8xBqUWMsbzZuXbB.png" })
	// db.Create(&models.Map{Name:"Slamon", Status:1, Photo:"https://storage.googleapis.com/oskar-ai/110/Slamon_uIoylyaC6TI3eCAuztH4.png" })
	// db.Create(&models.Map{Name:"Lakewood", Status:1, Photo:"https://storage.googleapis.com/oskar-ai/110/Lakewood_EyJn9zKE9mBNxue0m7Rp.png" })
	// db.Create(&models.Map{Name:"Lake Suppoeri",Status:1,  Photo:"https://storage.googleapis.com/oskar-ai/110/Lake_Suppoeri_Yzv5gEdRYTI885mVmkkq.png" })
	// db.Create(&models.Map{Name:"Lake Pont", Status:1, Photo:"https://storage.googleapis.com/oskar-ai/110/Lake_Pont_y3A6fo1JMVs1vH0MZZW9.png" })
	// db.Create(&models.Map{Name:"Gradnd Canyon",Status:1,  Photo:"https://storage.googleapis.com/oskar-ai/110/Gradnd_canyon_ukVdWrN87Xx2hKacF2lP.png" })
	// db.Create(&models.Map{Name:"Chiago", Status:1, Photo:"https://storage.googleapis.com/oskar-ai/110/Chiago_gcfQ7CkOufkVj2Xrmx5L.png" })
	// db.Create(&models.Map{Name:"Center Park",Status:1,  Photo:"https://storage.googleapis.com/oskar-ai/110/Center_Park_YV7YGwd8HKv0weW7tgQy.png" })
	// db.Create(&models.Map{Name:"Calop Pumbo", Status:1, Photo:"https://storage.googleapis.com/oskar-ai/110/calop_pumbo_cKNc071ADymBnwq4IAbt.png" })

}
