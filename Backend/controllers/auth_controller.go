package controllers
 
import (
	"time"
	"fmt"
	//"strings"
	"log" 
	"strconv"
	"../models"
	"../config"
	"net/http"
	"github.com/labstack/echo" 
	jwt "github.com/dgrijalva/jwt-go"
	opentok "github.com/eauge/opentok-go-sdk"
	"golang.org/x/net/context"  
	"firebase.google.com/go/auth" 
	//"crypto/md5"
	// "crypto/sha256"
	// "encoding/hex"
	// "crypto/hmac"
	//"encoding/json"
)

type FbRoom struct { 
	FullName    string `json:"full_name,omitempty"`
	Nickname    string `json:"nickname,omitempty"`
}


func (basectl *BaseController) GetInfo(c echo.Context) error {

	user := c.Get("user").(*jwt.Token)
	fmt.Println("data: ", user) 
	claims := user.Claims.(jwt.MapClaims) 
	usermodel := new(models.User)  
	usermodel.ID =   int(claims["id"].(float64))
	usermodel.FetchById(basectl.Dao) 
	if usermodel.ID > 0 { 
		//Init Balanceing ...
		// basectl.Dao.Model(&usermodel).Related(&usermodel.Balances)   
		// var f interface{} 
		return c.JSON(http.StatusOK,"ok") 

	}

	return echo.ErrUnauthorized 
}
 
func (basectl *BaseController)Signup(c echo.Context) error{

	user := new(models.User)
	if c.FormValue("fullname") =="" || c.FormValue("email") == "" || c.FormValue("password") =="" {
		var f interface{}
		f = map[string]interface{}{
			"fullname":  c.FormValue("fullname"),
			"email":  c.FormValue("email"),
			"password":  c.FormValue("password"), 
			"message": "Please enter valid infomation.",
		}
		return c.JSON(http.StatusInternalServerError,f) 
	} 
	user.Fullname = c.FormValue("fullname")
	user.Email = c.FormValue("email")
	user.Password, _ = models.HashPassword(c.FormValue("password"))  
	user.Create(basectl.Dao) 
	if user.ID > 0 { 
		//Init Balanceing ...
		//basectl.Dao.Model(&user).Related(&user.Balances)

		token := jwt.New(jwt.SigningMethodHS256) 
		// Set claims
		claims := token.Claims.(jwt.MapClaims)
		claims["id"] = user.ID
		claims["email"] = user.Email 
		claims["exp"] = time.Now().Add(time.Hour *  time.Duration(config.TOKEN_EXP_TIME)).Unix() 
		// Generate encoded token and send it as response.
		t, err := token.SignedString([]byte(config.SECRET_KEY))
		if err != nil {
			return err
		}  
		user.Password =""

		var f interface{}
		f = map[string]interface{}{
			"token": t,
			"user": user,
		}
		return c.JSON(http.StatusOK, f) 

	}

	var f interface{}
	f = map[string]interface{}{
		"fullname":  c.FormValue("fullname"),
		"email":  c.FormValue("email"),
		"password":  c.FormValue("password"), 
		"message": "email already exists.",
	}
	return c.JSON(http.StatusInternalServerError,f) 
	
	//return echo.ErrUnauthorized 

}

func (basectl *BaseController)Auth(c echo.Context) error{

	//secretKey := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" 
	user := new(models.User)  
	user.Email = c.FormValue("email")
	user.Fullname = c.FormValue("fullname")
	//user.Password, _ = models.HashPassword(c.FormValue("password"))  
	user.FetchByUsername(basectl.Dao)
	 
	//===============
	fmt.Println("data: ", user.ID) 
	if user.ID <=0 {
		user = new(models.User)  
		user.Email = c.FormValue("email")
		user.Password, _ = models.HashPassword(c.FormValue("password"))  
		user.Create(basectl.Dao) 
	}else{
		
		if models.CheckPasswordHash( c.FormValue("password"), user.Password ) == false {
			return echo.ErrUnauthorized 
		} 
	}
	
	//Check and create User Firebase 
	var ctnx = context.Background()
	client, err := basectl.FbApp.Auth(ctnx)
	if err != nil {
		log.Fatalf("error getting Auth client: %v\n", err)
	} 
	//check GetUser.
	fbuser, err := client.GetUserByEmail(ctnx, user.Email)
	if err != nil {
		///create new user 
		var passFB, _ = models.HashPassword(user.Password) 
		params := (&auth.UserToCreate{}).
		Email(user.Email).
		EmailVerified(false). 
		Password(passFB ).   
		Disabled(false)
		fbuser2, err := client.CreateUser(ctnx, params)
		if err != nil {
				log.Fatalf("error creating user: %v\n", err)
		}  
		fbuser = fbuser2
	}else{
		log.Printf("aready created user: %v\n", fbuser.UID)  	
	} 
	log.Printf("Successfully created user: %v\n", fbuser.UID)  
	
	token2, _ := client.CustomToken(ctnx, fbuser.UID)  //fbToken


	token := jwt.New(jwt.SigningMethodHS256) 
	// Set claims
	claims := token.Claims.(jwt.MapClaims)
	claims["id"] = user.ID
	claims["fbuid"] = fbuser.UID
	claims["email"] = user.Email 
	claims["exp"] = time.Now().Add(time.Hour * time.Duration(config.TOKEN_EXP_TIME) ).Unix()  
	t, err := token.SignedString([]byte(config.SECRET_KEY))
	if err != nil {
		return err
	}  

	var f interface{}
	f = map[string]interface{}{
		"token": t,
		"fbtoken":token2,
		"id": user.ID,
		"fbuid": fbuser.UID,
		"email":  user.Email,
		"fullname": user.Fullname,
	}
	return c.JSON(http.StatusOK,f) 
	  
	return echo.ErrUnauthorized

}

//generation opentokcode. 
func (basectl *BaseController)CreateSession(c echo.Context) error{

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)  
	userid := int(claims["id"].(float64)) 
	fbuid := claims["fbuid"].(string)
 
	userModel := new(models.User)   
	userModel.ID = userid
	err12 := userModel.FetchById(basectl.Dao) 

	var f21 interface{}

	if err12 != nil {
		//panic(err)  
		f21 = map[string]interface{}{ 
			"status" : 0,
			"message": "User account not found.",
		}
		return c.JSON(http.StatusBadRequest,f21) 
	}

	ot := opentok.New(config.OPENTOK_API_KEY, config.OPENTOK_SCRET) 
	s, err := ot.Session(nil) 

	if err != nil {
			//panic(err)  
		f21 = map[string]interface{}{ 
			"status" : 0,
			"message": "Cant not create session",
		}
		return c.JSON(http.StatusBadRequest,f21) 
	}

	t, err := ot.Token(s.ID, nil)
	if err != nil {
			//panic(err)
			f21 = map[string]interface{}{ 
				"status" : 0,
				"message": "Cant not create Token",
			}
			return c.JSON(http.StatusBadRequest,f21) 
	}   
 
	room := new(models.Room) 
	room.Session = s.ID 
	room.Token = string(*t)
	room.Status = 1
	room.UserId = userid
	
	MapId,_ := strconv.Atoi(c.FormValue("mapid") )  
	Loop,_ := strconv.Atoi(c.FormValue("loop") )  
	Miles,_ := strconv.ParseFloat(c.FormValue("miles") , 64) 
	var NameRoom =  c.FormValue("name") 

	mapf := new(models.Map)
	mapf.ID = MapId 

	if err := basectl.Dao.Where(&models.Map{ID:mapf.ID}).Find(&mapf).Error; err != nil {
		 
		var f2 interface{}
		f2 = map[string]interface{}{ 
			"status" : 0,
			"message": "Map is invalid",
		}
		return c.JSON(http.StatusBadRequest,f2) 

	}  

	if NameRoom == "" {
		NameRoom = mapf.Name 
	}


	room.MapId = MapId
	room.Loop = Loop
	room.Miles = Miles 
	room.Photo =mapf.Photo 
	room.Name  = NameRoom

	room.Create(basectl.Dao)  

	player := new(models.RoomPlayer) 
	player.RoomId = room.ID 
	player.UserId = userModel.ID 
	player.PlayerName = userModel.Fullname
	player.Token  =room.Token
	player.Status = 1  // Ready join. 
	player.CreateRoomPlayer(basectl.Dao)  


	var fbData, _ = basectl.FbApp.Database(context.Background())
	var refDB = fbData.NewRef("games")  

	if err2 := refDB.Child("race-rooms/"+ room.Session).Set(context.Background(), &models.FbRacingRoom{
		Session:room.Session,
		MapId:room.MapId,
		Loop:room.Loop,
		Miles:room.Miles,
		Photo:room.Photo,
		Name :room.Name, 
		Status:"New",
	} ); err2 != nil {
		log.Fatalln("Error setting value:", err2)
	} 

	//write first player user. 
	if err3 := refDB.Child("race-rooms/"+ room.Session +"/players/"+ fbuid).Set(context.Background(), &models.FbRoomPlayer{
		PlayerName: userModel.Fullname,
		Token:room.Token,
		Speed:0,
		Goal:0,
	} ); err3 != nil {
		log.Fatalln("Error setting value:", err3)
	} 

	 
	var f interface{}
	f = map[string]interface{}{ 
		"room": room,
	}   
	return c.JSON(http.StatusOK,f) 
 
}

//ActionSession START / FINISH
func (basectl *BaseController)ActionSession(c echo.Context) error{

	//ot := opentok.New(config.OPENTOK_API_KEY, config.OPENTOK_SCRET)  
	 
	var f interface{}
	f = map[string]interface{}{ 
		"archive": "",
	}
	return c.JSON(http.StatusOK,f) 

}
// CloseSession
func (basectl *BaseController)CloseSession(c echo.Context) error{

	ot := opentok.New(config.OPENTOK_API_KEY, config.OPENTOK_SCRET) 
	
	archive, _ := ot.ArchiveStart(c.FormValue("session"), nil)
	 
	if archive != nil { 
		ot.ArchiveStop(archive.ID)  
	}  
	var room models.Room
	//room := new(models.Room) 
	basectl.Dao.Where(&models.Room{Session: c.FormValue("session")  }).First(&room) 
	room.Status =0
	basectl.Dao.Save(&room)     
	fmt.Println("data room: ",room)  
	var f interface{}
	f = map[string]interface{}{ 
		"archive": room.ID,
	}
	return c.JSON(http.StatusOK,f) 
 
}

//generation opentokcode. 
func (basectl *BaseController)CreateToken(c echo.Context) error{

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)   
	fbuid := claims["fbuid"].(string)
	userid := int(claims["id"].(float64)) 

	userModel := new(models.User)   
	userModel.ID = userid
	err12 := userModel.FetchById(basectl.Dao) 

	var f21 interface{}
	if err12 != nil {
		//panic(err)  
		f21 = map[string]interface{}{ 
			"status" : 0,
			"message": "User account not found.",
		}
		return c.JSON(http.StatusBadRequest,f21) 
	}

	//find this room ... session.

	room := new(models.Room)
	room.Session = c.FormValue("session")
	basectl.Dao.Where(&models.Room{Session : room.Session }).First(&room) 
	if room.ID <=0 || room.Status ==0 {
		f21 = map[string]interface{}{ 
			"status" : 0,
			"message": "This room not found.",
		}
		return c.JSON(http.StatusBadRequest,f21) 
	}

	ot := opentok.New(config.OPENTOK_API_KEY, config.OPENTOK_SCRET) 
	t, err := ot.Token(c.FormValue("session"), nil)
	if err != nil {
		
		f21 = map[string]interface{}{ 
			"status" : 0,
			"message": "cant not create token.",
		}
		return c.JSON(http.StatusBadRequest,f21) 

	} 

	var f interface{}
	f = map[string]interface{}{ 
		"token":  t,
	}
	
	
	//insert to player if not exits. 
	player := new(models.RoomPlayer) 
	
	basectl.Dao.Where(&models.RoomPlayer{UserId : userModel.ID , RoomId: room.ID  }).First(&player) 

	player.RoomId = room.ID 
	player.UserId = userModel.ID 
	player.PlayerName = userModel.Fullname
	player.Token  = string(*t)
	player.Status = 1  // Ready join.  

	if player.ID <=0 {
		player.CreateRoomPlayer(basectl.Dao)   
	}else{
		basectl.Dao.Save(&player)
	}
	 
	//write first player user. 
	var fbData, _ = basectl.FbApp.Database(context.Background())
	var refDB = fbData.NewRef("games") 
	//log.Print("%+v" , refDB) 
	if err3 := refDB.Child("race-rooms/"+ c.FormValue("session") +"/players/"+ fbuid).Set(context.Background(),
		&models.FbRoomPlayer{
			PlayerName: player.PlayerName,
			Token:string(*t),
			Speed:0,
			Goal:0,
			Status:player.Status,
		}); err3 != nil {
		log.Fatalln("Error setting value:", err3)
	}  

	return c.JSON(http.StatusOK,f) 
 
}

//remove leave room  Player
func (basectl *BaseController)LeaveRoom(c echo.Context) error{

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)   
	fbuid := claims["fbuid"].(string)
	userid := int(claims["id"].(float64)) 

	userModel := new(models.User)   
	userModel.ID = userid
	err12 := userModel.FetchById(basectl.Dao) 

	var f21 interface{}
	if err12 != nil {
		//panic(err)  
		f21 = map[string]interface{}{ 
			"status" : 0,
			"message": "User account not found.",
		}
		return c.JSON(http.StatusBadRequest,f21) 
	}

	//find this room ... session.

	room := new(models.Room)
	room.Session = c.FormValue("session")
	basectl.Dao.Where(&models.Room{Session : room.Session }).First(&room) 
	if room.ID <=0 || room.Status ==0 {
		f21 = map[string]interface{}{ 
			"status" : 0,
			"message": "This room not found.",
		}
		return c.JSON(http.StatusBadRequest,f21) 
	}
  
	//insert to player if not exits. 
	player := new(models.RoomPlayer) 
	
	basectl.Dao.Where(&models.RoomPlayer{UserId : userModel.ID , RoomId: room.ID  }).First(&player) 

	if player.ID <=0 {
		
		f21 = map[string]interface{}{ 
			"status" : 0,
			"message": "Your account not exist in this room.",
		}
		return c.JSON(http.StatusBadRequest,f21) 

	}else{
		player.Status = 0 // Leave 
		basectl.Dao.Save(&player)
	} 
	//write first player user. 
	var fbData, _ = basectl.FbApp.Database(context.Background())
	var refDB = fbData.NewRef("games") 
	//log.Print("%+v" , refDB) 
	if err3 := refDB.Child("race-rooms/"+ c.FormValue("session") +"/players/"+ fbuid).Set(context.Background(),
		&models.FbRoomPlayer{
			Status:player.Status,
		}); err3 != nil {
		log.Fatalln("Error setting value:", err3)
	}  

	f21 = map[string]interface{}{  
		"player":player,
	}

	return c.JSON(http.StatusOK,f21) 
 
}


// api/practive/archivement
func (basectl *BaseController)PractiveArchivement(c echo.Context) error{
 
	Miles, _ := strconv.ParseFloat(c.FormValue("miles"),64)
	Kcals, _ := strconv.ParseFloat(c.FormValue("kcals"),64)

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)  
	userid := int(claims["id"].(float64))  

	usermodel := new(models.User) 
	basectl.Dao.Where(&models.User{ID : userid }).Set("gorm:auto_preload", true).First(&usermodel) 

	fmt.Println("Error setting value: %v ", usermodel.Profile)
	usermodel.Profile.Kcal = Kcals + usermodel.Profile.Kcal
	usermodel.Profile.Miles = Miles + usermodel.Profile.Miles 

	basectl.Dao.Save(&usermodel.Profile)

	var f interface{}
	f = map[string]interface{}{ 
		"Profile": usermodel.Profile,
	}   
	return c.JSON(http.StatusOK,f) 
 
}

// api/practive/archivement
func (basectl *BaseController)UpdateUser(c echo.Context) error{
 
	var Fullname =  c.FormValue("fullname") 
	//Kcals, _ := strconv.ParseFloat(c.FormValue("kcals"),64)
	if Fullname =="" {
		 
		var f2 interface{}
		f2 = map[string]interface{}{ 
			"status" : 0,
			"message": "Fullname is invalid",
		}
		return c.JSON(http.StatusBadRequest,f2) 

	}

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)  
	userid := int(claims["id"].(float64))  

	usermodel := new(models.User) 
	basectl.Dao.Where(&models.User{ID : userid }).Set("gorm:auto_preload", true).First(&usermodel)  
	usermodel.Fullname = Fullname

	basectl.Dao.Save(&usermodel)

	usermodel.Password = ""

	var f interface{}
	f = map[string]interface{}{ 
		"user": usermodel,
	}   
	return c.JSON(http.StatusOK,f) 
 
}


//generation opentokcode. 
func (basectl *BaseController)ListRoom(c echo.Context) error{

	var listroom []models.Room
	basectl.Dao.Where(models.Room{Status:1}).Order("ID desc").Set("gorm:auto_preload", true).Find(&listroom) //Limit(50).Find(&dices)
	
	//basectl.Dao.Model(&u).Related(&u.Balances)

	var f interface{}
	f = map[string]interface{}{ 
		"list": listroom,
	}   
	return c.JSON(http.StatusOK,f) 
 
}

//generation opentokcode. 
func (basectl *BaseController)ListMap(c echo.Context) error{

	var listmaps []models.Map
	basectl.Dao.Where(models.Map{Status:1}).Order("ID desc").Find(&listmaps) //Limit(50).Find(&dices)
	var f interface{}
	f = map[string]interface{}{ 
		"list": listmaps,
	}   
	return c.JSON(http.StatusOK,f) 
 
}



//GetUser users. 
func (basectl *BaseController)GetUser(c echo.Context) error{

	userid , _ := strconv.Atoi(c.QueryParam("id"))  
	fmt.Println("userid: ", userid) 

	usermodel := new(models.User) 
	basectl.Dao.Where(&models.User{ID : userid }).Set("gorm:auto_preload", true).First(&usermodel)   

	usermodel.Password = ""
	if userid==0 || usermodel.ID <= 0 {
		 
		var f2 interface{}
		f2 = map[string]interface{}{  
			"message": "Not found user",
		}
		return c.JSON(http.StatusBadRequest,f2) 

	} 

	var f interface{}
	f = map[string]interface{}{ 
		"user": usermodel,
	}   
	return c.JSON(http.StatusOK,f) 


	 
}
//list users. 
func (basectl *BaseController)ListUser(c echo.Context) error{

	var listuser []models.UserView  
	limit, _ := strconv.Atoi(c.QueryParam("limit"))
	offset, _ := strconv.Atoi(c.QueryParam("offset"))

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)   
	userid := int(claims["id"].(float64)) 
	search := c.QueryParam("search")
	if search != "" {
		basectl.Dao.Model(&models.UserView{}).Where("email LIKE ? OR fullname LIKE ?", "%"+search+"%",  "%"+search+"%" ).Order("ID desc").Offset(offset).Limit(limit).Set("gorm:auto_preload", true).Find(&listuser)
	}else{
		basectl.Dao.Model(&models.UserView{}).Order("ID desc").Offset(offset).Limit(limit).Set("gorm:auto_preload", true).Find(&listuser)
	}
	if len(listuser) == limit {
		offset= limit + offset
	}
	
	usermodel := new(models.User) 
	basectl.Dao.Where(&models.User{ID : userid }).Set("gorm:auto_preload", true).First(&usermodel)   
	fmt.Println("usermodel: ", usermodel) 
	// Get List Friends of user and friends id in list user. 
	var lists []int
    for _, us := range listuser {
        lists = append(lists, us.ID)
	}  
	
	//var listid = strings.Trim(strings.Replace(fmt.Sprint(lists), " ",  "," , -1), "[]")
 
	//  
	//db.Raw("SELECT name, age FROM users WHERE name = ?", 3).Scan(&result)
	//basectl.Dao.Raw("select user_id, friend_id from users  left join friends on users.ID = friends.user_id where users.ID =7 and friend_id in (7,6,5,4) " ).Scan(&result)
	
	rows, _ := basectl.Dao.Raw("select friends.user_id, friends.friend_id from users left join friends on users.ID = friends.user_id   where users.ID =? and friend_id in (?)  ",userid, lists ).Rows() // (*sql.Rows, error)
	defer rows.Close() 

	for rows.Next() {
		var tt  models.IsFriend
		basectl.Dao.ScanRows(rows, &tt)
		fmt.Println("friendsID %v ", tt)
		//update status friends. 

		for i := range listuser {
			attr := &listuser[i]
			attr.IsMakeFriend = 0
			if attr.ID == tt.FriendId {
					attr.IsMakeFriend = 1
			}
	   }

	}


	 
	
	var f interface{}
	f = map[string]interface{}{ 
		"list": listuser,
		"next": map[string]interface{}{ 
			"limit":limit,
			"offset":offset,
			
		},
	}  
	 
	return c.JSON(http.StatusOK,f) 
 
}

//List My Friends 

//list users. 
func (basectl *BaseController)ListMyFriends(c echo.Context) error{

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)   
	userid := int(claims["id"].(float64)) 

	var listuser []models.User  
	limit, _ := strconv.Atoi(c.QueryParam("limit"))
	offset, _ := strconv.Atoi(c.QueryParam("offset"))

	basectl.Dao.Table("users").Select("users.id, users.email, users.fullname").Joins("JOIN friends ON users.id = friends.friend_id").Where("friends.user_id = ?", userid ).Offset(offset).Limit(limit).Find(&listuser)
 
	//var next = ""  
	fmt.Println("limit: ", limit) 
	fmt.Println("data: ", len(listuser)) 

	if len(listuser) == limit {
		//next =  "offset=" + strconv.Itoa(limit + offset) + "&limit=" +  c.QueryParam("limit")
		offset = limit + offset
	}
	
	var f interface{}
	f = map[string]interface{}{ 
		"list": listuser,
		"next": map[string]interface{}{ 
			"offset":offset,
			"limit":limit,
		},
	}  
	 
	return c.JSON(http.StatusOK,f) 
 
}

//Add Friend  
func (basectl *BaseController)AddFriend(c echo.Context) error{

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)   
	userid := int(claims["id"].(float64)) 
	//fbuid := claims["fbuid"].(string)
	FriendId,_ := strconv.Atoi(c.FormValue("friendId") )  

	friendUser := new(models.User)   
	friendUser.ID = FriendId
	err := friendUser.FetchById(basectl.Dao) 

	fmt.Println("data: ", friendUser.ID) 
	if err !=nil  {
		var f interface{}
		f = map[string]interface{}{ 
			"success": "0",
			"message":"friend is invalid",
		}   
		return c.JSON(http.StatusOK,f) 
	}

	//Aready???
	var myfriend models.Friend 
	basectl.Dao.Where( &models.Friend{UserId: userid, FriendId: FriendId} ).First(&myfriend)  
	if myfriend.ID <= 0{ 
		basectl.Dao.Create(&models.Friend{UserId: userid, FriendId: FriendId})
		basectl.Dao.Create(&models.Friend{UserId: FriendId, FriendId: userid}) 
	} 
	var f interface{}
	
	friendUser.Password ="" 
	f = map[string]interface{}{ 
		"success": "1",
		"user": friendUser,
	}   
	return c.JSON(http.StatusOK,f) 
 
}

//Remove Friend  
func (basectl *BaseController)RemoveFriend(c echo.Context) error{

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)   
	userid := int(claims["id"].(float64)) 
	//fbuid := claims["fbuid"].(string)
	FriendId,_ := strconv.Atoi(c.FormValue("friendId") )  

	friendUser := new(models.User)   
	friendUser.ID = FriendId
	err := friendUser.FetchById(basectl.Dao) 

	fmt.Println("data: ", friendUser.ID) 
	if err !=nil  {
		var f interface{}
		f = map[string]interface{}{ 
			"success": "0",
			"message":"friend is invalid",
		}   
		return c.JSON(http.StatusOK,f) 
	}

	//Aready???
	var myfriend models.Friend 
	basectl.Dao.Where( &models.Friend{UserId: userid, FriendId: FriendId} ).First(&myfriend)  
	if myfriend.ID > 0{ 
		basectl.Dao.Delete(&models.Friend{UserId: userid, FriendId: FriendId})
		basectl.Dao.Delete(&models.Friend{UserId: FriendId, FriendId: userid}) 
	} 
	var f interface{}
	f = map[string]interface{}{ 
		"success": "1",
	}   
	return c.JSON(http.StatusOK,f) 
 
}
